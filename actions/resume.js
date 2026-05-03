"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model, withRetries } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { checkUser } from "@/lib/checkUser";

import { ratelimit } from "@/lib/ratelimit";

export async function generateResumeWithAI() {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = user.clerkUserId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const userWithInsights = await db.user.findUnique({
    where: { id: user.id },
    include: { industryInsight: true },
  });

  if (!userWithInsights) throw new Error("User not found");

  const prompt = `
You are an expert resume writer and career coach. Generate a complete, professional, ATS-optimised resume in markdown format for the following candidate.

Candidate Profile:
- Name: ${userWithInsights.name || "The Candidate"}
- Industry: ${userWithInsights.industry || "General"}
- Years of Experience: ${userWithInsights.experience ?? 0}
- Skills: ${userWithInsights.skills?.join(", ") || "Not specified"}
- Professional Bio / Summary: ${userWithInsights.bio || "Not provided"}
${
  userWithInsights.industryInsight
    ? `- Top skills in their industry: ${userWithInsights.industryInsight.topSkills?.join(", ")}
- Key industry trends: ${userWithInsights.industryInsight.keyTrends?.slice(0, 3).join("; ")}`
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
      where: { userId: userWithInsights.id },
      update: { content },
      create: { userId: userWithInsights.id, content },
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
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

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
  const user = await checkUser();
  if (!user) return null;

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function generateStructuredResume(jobDescription = "") {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = user.clerkUserId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  // Reload user to include industry insights
  const userWithInsights = await db.user.findUnique({
    where: { id: user.id },
    include: { industryInsight: true },
  });

  if (!userWithInsights) throw new Error("User not found");

  const prompt = `
    You are an expert resume writer. Generate a complete, professional, ATS-optimized resume in JSON format for the following candidate.
    ${jobDescription ? `Tailor the resume specifically for this job description: "${jobDescription}"` : ""}

    Candidate Profile:
    - Name: ${userWithInsights.name || "The Candidate"}
    - Industry: ${userWithInsights.industry || "General"}
    - Experience: ${userWithInsights.experience ?? 0} years
    - Skills: ${userWithInsights.skills?.join(", ") || "Not specified"}
    - Bio: ${userWithInsights.bio || "Not provided"}

    JSON Structure Required:
    {
      "fullName": "string",
      "contactInfo": {
        "email": "string",
        "mobile": "string",
        "linkedin": "string"
      },
      "summary": "3-4 premium sentences",
      "skills": ["skill1", "skill2", ...],
      "experience": [
        { "title": "string", "organization": "string", "startDate": "string", "endDate": "string", "current": boolean, "description": "3-4 achievement bullet points" }
      ],
      "education": [
        { "title": "string", "organization": "string", "startDate": "string", "endDate": "string" }
      ],
      "projects": [
        { "title": "string", "organization": "string", "startDate": "string", "endDate": "string", "description": "string" }
      ]
    }

    Return ONLY the raw JSON. No markdown fences.
  `;

  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const text = result.response.text().trim();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const data = JSON.parse(cleanedText);

    return data;
  } catch (error) {
    console.error("Error generating structured resume:", error);
    throw new Error("Failed to generate resume data");
  }
}

export async function updateResumeSettings({ templateId, jobDescription }) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  return await db.resume.upsert({
    where: { userId: user.id },
    update: { templateId, jobDescription },
    create: { userId: user.id, content: "", templateId, jobDescription },
  });
}

