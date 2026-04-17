"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model, withRetries } from "@/lib/gemini";

import { ratelimit } from "@/lib/ratelimit";

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = userId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 8 realistic interview questions for a ${user.industry || "general"} professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.

    Include a balanced mix of commonly asked interview questions:
    - 3 Behavioral questions (e.g. "Tell me about yourself", "Describe a time you faced a challenge", "What are your strengths and weaknesses?")
    - 2 Situational questions relevant to the industry (e.g. "How would you handle...")
    - 3 Technical or domain-specific questions based on their skills and industry

    The questions must be commonly asked in real job interviews — not hypothetical puzzles.
    Each question should have a brief 1-sentence tip on how to structure the answer.

    Return ONLY this JSON format, no additional text or code fences:
    {
      "questions": [
        {
          "question": "string",
          "type": "Behavioral" | "Situational" | "Technical",
          "tip": "string (a brief 1-sentence hint on how to structure the answer, e.g. use the STAR method)"
        }
      ]
    }
  `;

  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

/**
 * Analyze a single interview answer using Gemini AI.
 * Returns structured feedback with score, strengths, improvements, and a model answer.
 */
export async function analyzeAnswer({ question, answer, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (ratelimit) {
    const identifier = userId;
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new Error("Rate limit exceeded. Please try again later.");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });

  if (!user) throw new Error("User not found");

  if (!answer || answer.trim().length < 5) {
    return {
      score: 0,
      scoreLabel: "No Answer",
      feedback: "No meaningful answer was provided.",
      strengths: [],
      improvements: ["Please provide a detailed answer to receive feedback."],
      modelAnswer: "",
    };
  }

  const prompt = `
    You are an expert interview coach evaluating a candidate's interview response.

    Candidate Context:
    - Industry: ${user.industry || "General"}
    - Skills: ${user.skills?.join(", ") || "Not specified"}
    - Question Type: ${type || "General"}

    Question: "${question}"
    Candidate's Answer: "${answer}"

    Evaluate the answer thoroughly and return ONLY this JSON, no additional text or code fences:
    {
      "score": number (1-10, where 10 is perfect),
      "scoreLabel": "Excellent" | "Strong" | "Good" | "Fair" | "Needs Work",
      "feedback": "string (2-3 sentences of constructive overall feedback on the answer quality, clarity, and relevance)",
      "strengths": ["string", "string"] (2-3 specific things the candidate did well),
      "improvements": ["string", "string"] (2-3 specific, actionable areas to improve),
      "modelAnswer": "string (a brief 3-4 sentence model answer demonstrating the ideal response)"
    }

    Score guide:
    - 9-10: Excellent — comprehensive, structured, specific examples, industry-aligned
    - 7-8: Strong — good structure and content, minor gaps
    - 5-6: Good — adequate but lacks depth or specifics
    - 3-4: Fair — partially relevant but misses key elements
    - 1-2: Needs Work — off-topic, too brief, or unclear
  `;

  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing answer:", error);
    throw new Error("Failed to analyze your answer. Please try again.");
  }
}

export async function saveQuizResult(questions, answers) {
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
    You are an expert technical interviewer for a ${user.industry} professional.
    The user was asked the following questions and provided the following answers:
    ${questions
      .map(
        (q, i) => `Q: ${q.question}
A: ${answers[i] || "No answer provided"}`
      )
      .join("\n\n")}

    Please evaluate the user's answers.
    Return your response in this exact JSON format only, no additional text:
    {
      "evaluations": [
        {
          "question": "string",
          "userAnswer": "string",
          "isCorrect": boolean (true if the answer is mostly functionally correct/demonstrates good understanding, false otherwise),
          "feedback": "string (what they did well and how they can improve)",
          "expectedAnswer": "string (a model answer)"
        }
      ],
      "overallScore": number (0 to 100),
      "improvementTip": "string (overall feedback for improvement, limit to 2 sentences)"
    }
  `;

  let evalResult;
  try {
    const result = await withRetries(() => model.generateContent(prompt));
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    evalResult = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error evaluating answers with AI:", error);
    throw new Error("Failed to evaluate answers. Try again.");
  }

  const questionResults = evalResult.evaluations.map((e) => ({
    question: e.question,
    answer: e.expectedAnswer,
    userAnswer: e.userAnswer,
    isCorrect: e.isCorrect,
    explanation: e.feedback,
  }));

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: evalResult.overallScore,
        questions: questionResults,
        category: "Technical",
        improvementTip: evalResult.improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
