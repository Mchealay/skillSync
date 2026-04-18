"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model, withRetries } from "@/lib/gemini";
import { ratelimit } from "@/lib/ratelimit";
import { checkUser } from "@/lib/checkUser";
import { z } from "zod";
import { actionSuccess, actionError } from "@/lib/api-response";
import { logger } from "@/lib/logger";


import { generateIndustryInsightsData } from "@/services/industry.service";

export const generateAIInsights = async (industry) => {
  const user = await checkUser();
  if (!user) return actionError("Unauthorized");

  const userId = user.clerkUserId;

  try {
    // Validate input
    z.string().min(1).parse(industry);

    if (ratelimit) {
      const identifier = userId;
      const { success } = await ratelimit.limit(identifier);
      if (!success) return actionError("Rate limit exceeded. Please try again later.");
    }

    const insightsData = await generateIndustryInsightsData(industry);
    return actionSuccess(insightsData);
  } catch (error) {
    logger.error({
      msg: "Error generating action insights",
      error: error.message,
      industry,
    });
    return actionError("Failed to generate industry insights");
  }
};


export async function getIndustryInsights() {
  const user = await checkUser();
  if (!user) return actionError("Unauthorized");

  try {
    const userWithInsights = await db.user.findUnique({
      where: { clerkUserId: user.clerkUserId },
      include: {
        industryInsight: true,
      },
    });

    if (!userWithInsights) return actionError("User not found");

    // If no insights exist or insights are a placeholder (empty salaryRanges), generate them
    if (!userWithInsights.industryInsight || userWithInsights.industryInsight.salaryRanges.length === 0) {
      const response = await generateAIInsights(userWithInsights.industry);
      
      if (!response.success) return response;
      const insights = response.data;

      const industryInsight = await db.industryInsight.upsert({
        where: { industry: userWithInsights.industry },
        update: {
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          industry: userWithInsights.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return actionSuccess(industryInsight);
    }

    return actionSuccess(userWithInsights.industryInsight);
  } catch (error) {
    logger.error({
      msg: "Error fetching industry insights",
      error: error.message,
    });
    return actionError("Failed to fetch industry insights");
  }
}

