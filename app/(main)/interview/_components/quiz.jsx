"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff } from "lucide-react";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const quizCompleted = false;

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answerText) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerText;
    setAnswers(newAnswers);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        const currentAnswer = answers[currentQuestion] || "";
        handleAnswer(currentAnswer + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    // Score is now calculated by AI
    return 0;
  };

  const finishQuiz = async () => {
    try {
      await saveQuizResultFn(quizData, answers);
      toast.success("Quiz completed! Analyzing results...");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            {BUTTONS_MENUS.START_QUIZ}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <div className="relative">
          <Textarea
            value={answers[currentQuestion] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here or click the microphone to speak..."
            className="min-h-[150px]"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={`absolute bottom-2 right-2 ${
              isRecording ? "text-red-500 animate-pulse" : "text-muted-foreground"
            }`}
             type="button"
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>

        {quizCompleted && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium" >Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!quizCompleted}
          >
            {BUTTONS_MENUS.EXPLAIN}
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}
