"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model, withRetries } from "@/lib/gemini";

import { ratelimit } from "@/lib/ratelimit";

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = userId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a ${data.tone || "professional"} cover letter for a ${data.jobTitle} position at ${
      data.companyName
    }.

    Candidate Name: ${data.fullName || "The applicant"}
    Industry: ${user.industry}
    Years of Experience: ${user.experience}
    Skills: ${user.skills?.join(", ")}
    Bio: ${user.bio}

    Job Description:
    ${data.jobDescription}

    Requirements:
    - Tailor it to this job and company
    - Use a ${data.tone} tone
    - Max 400 words, markdown format
    - Highlight achievements with examples
    `;


  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        templateId: data.templateId || "professional",
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      user: true,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
