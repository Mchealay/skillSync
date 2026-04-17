"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

import { inngest } from "@/lib/inngest/client";
import { logger } from "@/lib/logger";

const updateUserSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  experience: z.number().min(0).max(50).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  subIndustry: z.string().optional(), // In case the frontend sends it, we can safely ignore/accept it
});

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Server-side validation
  const validatedData = updateUserSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    logger.info({
      msg: "Starting user profile update",
      userId: user.id,
      industry: validatedData.industry,
    });

    // Start a transaction to update user
    const result = await db.$transaction(
      async (tx) => {
        // Check if an industry insight exists
        const existingInsight = await tx.industryInsight.findUnique({
          where: { industry: validatedData.industry },
        });

        // If it doesn't exist, create a default placeholder
        // This will be replaced by actual AI data when the Inngest background job finishes
        if (!existingInsight) {
          await tx.industryInsight.create({
            data: {
              industry: validatedData.industry,
              salaryRanges: [],
              growthRate: 0,
              demandLevel: "Medium",
              topSkills: [],
              marketOutlook: "Neutral",
              keyTrends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Update user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: validatedData.industry,
            experience: validatedData.experience,
            bio: validatedData.bio,
            skills: validatedData.skills,
          },
        });

        return updatedUser;
      },
      {
        timeout: 10000,
      }
    );

    // Trigger Inngest function to sync industry insights in background
    // We don't await this to keep the response snappy and resilient to background job failures
    inngest
      .send({
        name: "app/industry.sync",
        data: {
          industry: validatedData.industry,
        },
      })
      .catch((err) => {
        logger.error({
          msg: "Failed to trigger background industry sync",
          error: err.message,
          industry: validatedData.industry,
        });
      });

    logger.info({
      msg: "User profile updated and background sync triggered",
      userId: user.id,
    });

    revalidatePath("/");
    return { success: true, user: result };
  } catch (error) {
    logger.error({
      msg: "Error updating user and industry",
      error: error.message,
      userId: user.id,
    });
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
