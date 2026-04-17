"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model, withRetries } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

import { ratelimit } from "@/lib/ratelimit";

export async function generateResumeWithAI() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = userId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
You are an expert resume writer and career coach. Generate a complete, professional, ATS-optimised resume in markdown format for the following candidate.

Candidate Profile:
- Name: ${user.name || "The Candidate"}
- Industry: ${user.industry || "General"}
- Years of Experience: ${user.experience ?? 0}
- Skills: ${user.skills?.join(", ") || "Not specified"}
- Professional Bio / Summary: ${user.bio || "Not provided"}
${
  user.industryInsight
    ? `- Top skills in their industry: ${user.industryInsight.topSkills?.join(", ")}
- Key industry trends: ${user.industryInsight.keyTrends?.slice(0, 3).join("; ")}`
    : ""
}

Instructions:
1. Write a compelling Professional Summary (3-4 sentences) that highlights the candidate's value proposition.
2. List Skills in a clean, comma-separated or grouped format relevant to their industry.
3. Create 2-3 realistic Work Experience entries (use placeholders like "Company Name" if unknown) with:
   - Job title, company, date range
   - 3-4 bullet points using strong action verbs and quantified achievements
4. Add 1-2 Education entries with degree, institution, and year.
5. Add 1-2 Projects relevant to their skills.
6. Use this exact markdown structure:

# [Candidate Full Name]

📧 your@email.com | 📱 +1 234 567 8900 | 💼 [LinkedIn](https://linkedin.com) | 🌐 [Portfolio](https://portfolio.com)

---

## Professional Summary

[summary here]

---

## Skills

[skills here]

---

## Work Experience

### [Job Title] | [Company Name]
*[Start Date] – [End Date or Present]*

- Achievement bullet 1
- Achievement bullet 2
- Achievement bullet 3

---

## Education

### [Degree] in [Field]
**[Institution Name]** | [Year]

---

## Projects

### [Project Name]
[Brief description of the project, technologies used, and impact]

---

IMPORTANT:
- Return ONLY the markdown content, no code fences, no extra text.
- Make it sound professional and confident.
- Tailor everything to the ${user.industry || "general"} industry.
- Use industry-specific keywords to pass ATS screening.
`;

  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const content = result.response.text().trim();

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error generating resume with AI:", error?.message ?? error);
    // Surface a specific message for API key / quota issues
    const msg = error?.message ?? "";
    if (msg.includes("API_KEY") || msg.includes("API key") || msg.includes("invalid") || msg.includes("401")) {
      throw new Error("Invalid or missing Gemini API key. Check your GEMINI_API_KEY in .env");
    }
    if (msg.includes("quota") || msg.includes("429")) {
      throw new Error("Gemini API quota exceeded. Please try again later.");
    }
    throw new Error(`Failed to generate resume: ${msg || "Unknown error"}`);
  }
}

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = userId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
