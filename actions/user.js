"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

import { inngest } from "@/lib/inngest/client";
import { logger } from "@/lib/logger";
import { actionSuccess, actionError } from "@/lib/api-response";


const updateUserSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  experience: z.number().min(0).max(50).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  subIndustry: z.string().optional(), // In case the frontend sends it, we can safely ignore/accept it
});

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) return actionError("Unauthorized");

  try {
    // Server-side validation
    const validatedData = updateUserSchema.parse(data);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return actionError("User not found");

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

    // Trigger Inngest function
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
    return actionSuccess(result);
  } catch (error) {
    logger.error({
      msg: "Error updating user and industry",
      error: error.message,
    });
    return actionError(error instanceof z.ZodError ? "Invalid input data" : "Failed to update profile");
  }
}


export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return actionError("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
      },
    });

    return actionSuccess({
      isOnboarded: !!user?.industry,
    });
  } catch (error) {
    logger.error({
      msg: "Error checking onboarding status",
      error: error.message,
    });
    return actionError("Failed to check onboarding status");
  }
}

