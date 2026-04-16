"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 5 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    The questions should be open-ended.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
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

export async function saveQuizResult(questions, answers) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    You are an expert technical interviewer for a ${user.industry} professional.
    The user was asked the following 5 questions and provided the following answers:
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
    const result = await model.generateContent(prompt);
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
