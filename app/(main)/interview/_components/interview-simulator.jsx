"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { generateQuiz, analyzeAnswer } from "@/actions/interview";
import {
  Mic,
  MicOff,
  ChevronRight,
  RotateCcw,
  Trophy,
  Lightbulb,
  CheckCircle,
  XCircle,
  Star,
  Target,
  Brain,
  Zap,
  Clock,
  ArrowRight,
  Play,
  MessageSquare,
  TrendingUp,
  BookOpen,
} from "lucide-react";

// ─── Config ─────────────────────────────────────────────────────────────────
const TYPE_STYLES = {
  Behavioral: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  Situational: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glow: "shadow-purple-500/10",
  },
  Technical: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
};

const SCORE_STYLES = {
  Excellent:    { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", bar: "bg-emerald-500" },
  Strong:       { color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       bar: "bg-blue-500" },
  Good:         { color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20",   bar: "bg-yellow-500" },
  Fair:         { color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20",   bar: "bg-orange-500" },
  "Needs Work": { color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         bar: "bg-red-500" },
  "No Answer":  { color: "text-gray-400",    bg: "bg-gray-500/10 border-gray-500/20",       bar: "bg-gray-500" },
};

const QUESTION_TIME = 120; // seconds per question

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function overallLabel(avg) {
  if (avg >= 8.5) return "Excellent";
  if (avg >= 7)   return "Strong";
  if (avg >= 5)   return "Good";
  if (avg >= 3.5) return "Fair";
  return "Needs Work";
}

// ─── Sub-Components ──────────────────────────────────────────────────────────
function PhaseLoading({ title, subtitle, icon: Icon, color = "primary" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-6">
      <div className="relative w-24 h-24">
        <div className={`absolute inset-0 rounded-full border-4 border-${color}/20 animate-ping`} />
        <div className={`absolute inset-0 rounded-full border-4 border-t-${color} animate-spin border-${color}/20`} />
        <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
          <Icon className={`h-8 w-8 text-${color} animate-pulse`} />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

function ScoreBadge({ scoreLabel, score }) {
  const cfg = SCORE_STYLES[scoreLabel] || SCORE_STYLES["Good"];
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border ${cfg.bg} ${cfg.color}`}>
      <Star className="h-4 w-4" />
      {scoreLabel} — {score}/10
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InterviewSimulator() {
  const [phase, setPhase] = useState("intro"); // intro | loading | question | analyzing | feedback | results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]); // [{question,type,tip,answer,feedback}]
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [timer, setTimer] = useState(QUESTION_TIME);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const isTimerActive = phase === "question";

  // ── Timer ──
  useEffect(() => {
    if (!isTimerActive) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          toast.warning("Time's up! Consider submitting your answer.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  // ── Start simulator ──
  const startSimulator = async () => {
    setPhase("loading");
    try {
      const qs = await generateQuiz();
      setQuestions(qs);
      setCurrentIndex(0);
      setFeedbacks([]);
      setCurrentAnswer("");
      setShowTip(false);
      setTimer(QUESTION_TIME);
      setPhase("question");
    } catch (err) {
      toast.error(err.message || "Failed to generate questions. Please try again.");
      setPhase("intro");
    }
  };

  // ── Voice recording ──
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      }
      if (final) setCurrentAnswer((prev) => prev + final);
    };
    rec.onerror = () => {
      setIsRecording(false);
      toast.error("Microphone error. Please check permissions.");
    };
    rec.onend = () => setIsRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setIsRecording(true);
  };

  // ── Submit answer → Gemini analysis ──
  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    clearInterval(timerRef.current);
    setPhase("analyzing");

    const q = questions[currentIndex];
    try {
      const fb = await analyzeAnswer({
        question: q.question,
        answer: currentAnswer,
        type: q.type,
      });
      setCurrentFeedback(fb);
      setFeedbacks((prev) => [
        ...prev,
        { question: q.question, type: q.type, tip: q.tip, answer: currentAnswer, feedback: fb },
      ]);
      setPhase("feedback");
    } catch (err) {
      toast.error(err.message || "Failed to analyze answer.");
      setPhase("question");
    }
  };

  // ── Next question ──
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswer("");
      setCurrentFeedback(null);
      setShowTip(false);
      setTimer(QUESTION_TIME);
      setPhase("question");
    } else {
      setPhase("results");
    }
  };

  // ── Restart ──
  const restart = () => {
    setPhase("intro");
    setQuestions([]);
    setFeedbacks([]);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setCurrentFeedback(null);
    setTimer(QUESTION_TIME);
  };

  // ── Computed values ──
  const avgScore =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, f) => acc + (f.feedback?.score ?? 0), 0) / feedbacks.length
      : 0;
  const resultLabel = overallLabel(avgScore);
  const resultCfg = SCORE_STYLES[resultLabel];

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Intro
  // ═════════════════════════════════════════════════════════════════
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl border bg-card shadow-xl p-8 space-y-7">
          {/* Hero */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-primary/10 p-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-bold gradient-title">Interview Simulator</h2>
              <p className="text-muted-foreground mt-2 leading-relaxed max-w-md mx-auto">
                Practice with real interview questions generated by Gemini AI. Answer by typing or
                speaking and get instant, constructive feedback on every response.
              </p>
            </div>
          </div>

          {/* Feature tiles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Brain,       label: "Gemini AI",      desc: "Real-world questions" },
              { icon: Mic,         label: "Voice Input",     desc: "Speak or type" },
              { icon: Zap,         label: "Live Feedback",   desc: "After every answer" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-xl border bg-muted/20 p-4 text-center space-y-1.5 hover:bg-muted/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* Question types */}
          <div className="rounded-xl border bg-muted/10 p-4 space-y-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" /> What to expect
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(TYPE_STYLES).map((t) => (
                <Badge key={t} variant="outline" className={TYPE_STYLES[t].badge}>
                  {t}
                </Badge>
              ))}
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 8 questions — a mix of behavioral, situational &amp; technical</li>
              <li>• 2-minute timer per question (non-blocking)</li>
              <li>• Instant AI feedback with score, strengths &amp; model answers</li>
            </ul>
          </div>

          <Button onClick={startSimulator} size="lg" className="w-full gap-2 text-base h-12">
            <Play className="h-5 w-5" />
            Start Interview
          </Button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Loading questions
  // ═════════════════════════════════════════════════════════════════
  if (phase === "loading") {
    return (
      <PhaseLoading
        icon={Brain}
        title="Gemini is crafting your questions…"
        subtitle="Tailored to your role & skills"
      />
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Analyzing answer
  // ═════════════════════════════════════════════════════════════════
  if (phase === "analyzing") {
    return (
      <PhaseLoading
        icon={Zap}
        title="Analyzing your answer…"
        subtitle="Getting personalized feedback from Gemini"
        color="blue-400"
      />
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Question
  // ═════════════════════════════════════════════════════════════════
  if (phase === "question") {
    const q = questions[currentIndex];
    const ts = TYPE_STYLES[q.type] || TYPE_STYLES.Technical;
    const progress = (currentIndex / questions.length) * 100;
    const timerCritical = timer <= 30;

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Progress + meta bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">
              Question {currentIndex + 1} <span className="text-muted-foreground/50">of {questions.length}</span>
            </span>
            <Badge variant="outline" className={ts.badge}>
              {q.type}
            </Badge>
          </div>
          <div
            className={`flex items-center gap-1.5 font-mono font-semibold tabular-nums transition-colors ${
              timerCritical ? "text-red-400" : "text-muted-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timer)}
          </div>
        </div>

        <Progress value={progress} className="h-1.5" />

        {/* Question card */}
        <div className={`rounded-2xl border bg-card shadow-xl p-6 space-y-5 ${ts.glow} shadow-lg`}>
          {/* Question text */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-semibold leading-relaxed">{q.question}</p>
          </div>

          {/* Tip toggle */}
          {q.tip && (
            <div>
              <button
                onClick={() => setShowTip((s) => !s)}
                className="flex items-center gap-1.5 text-sm text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
              >
                <Lightbulb className="h-4 w-4" />
                {showTip ? "Hide answering tip" : "Show answering tip"}
              </button>
              {showTip && (
                <div className="mt-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-200 leading-relaxed">
                  💡 {q.tip}
                </div>
              )}
            </div>
          )}

          {/* Answer textarea + mic */}
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                id="interview-answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here, or click the microphone to speak…"
                className="min-h-[170px] pr-12 resize-none text-sm leading-relaxed"
              />
              <button
                type="button"
                onClick={toggleRecording}
                title={isRecording ? "Stop recording" : "Start voice input"}
                className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all ${
                  isRecording
                    ? "bg-red-500/10 text-red-400 animate-pulse"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>

            {isRecording && (
              <p className="flex items-center gap-2 text-xs text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
                Listening — click the mic icon to stop recording
              </p>
            )}
          </div>

          <Button
            onClick={submitAnswer}
            disabled={!currentAnswer.trim()}
            className="w-full gap-2 h-11"
          >
            Submit Answer <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Feedback
  // ═════════════════════════════════════════════════════════════════
  if (phase === "feedback") {
    const q = questions[currentIndex];
    const fb = currentFeedback;
    const ts = TYPE_STYLES[q.type] || TYPE_STYLES.Technical;
    const sc = SCORE_STYLES[fb?.scoreLabel] || SCORE_STYLES["Good"];
    const isLast = currentIndex === questions.length - 1;
    const lastEntry = feedbacks[feedbacks.length - 1];

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Progress bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">
              Question {currentIndex + 1} <span className="text-muted-foreground/50">of {questions.length}</span>
            </span>
            <Badge variant="outline" className={ts.badge}>
              {q.type}
            </Badge>
          </div>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5" />

        {/* Feedback card */}
        <div className="rounded-2xl border bg-card shadow-xl p-6 space-y-6">
          {/* Score */}
          <ScoreBadge scoreLabel={fb?.scoreLabel} score={fb?.score} />

          {/* Score bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Score</span>
              <span>{fb?.score}/10</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${sc.bar}`}
                style={{ width: `${((fb?.score ?? 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Question recap */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Question</p>
            <p className="font-medium">{q.question}</p>
          </div>

          {/* User answer */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Your Answer</p>
            <p className="text-sm bg-muted/40 rounded-xl p-3 leading-relaxed">{lastEntry?.answer}</p>
          </div>

          {/* Overall AI feedback */}
          <div className="rounded-xl bg-muted/30 border border-border/40 p-4 space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5" /> AI Feedback
            </p>
            <p className="text-sm leading-relaxed">{fb?.feedback}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-medium text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Strengths
              </p>
              {fb?.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {fb.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-snug">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notable strengths identified.</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider font-medium text-orange-400 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Improvements
              </p>
              {fb?.improvements?.length > 0 ? (
                <ul className="space-y-2">
                  {fb.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-snug">
                      <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Great answer!</p>
              )}
            </div>
          </div>

          {/* Model answer */}
          {fb?.modelAnswer && (
            <details className="group">
              <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 select-none">
                <BookOpen className="h-4 w-4" />
                View model answer
              </summary>
              <div className="mt-3 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-muted-foreground leading-relaxed">
                {fb.modelAnswer}
              </div>
            </details>
          )}

          <Button onClick={nextQuestion} className="w-full gap-2 h-11">
            {isLast ? (
              <>
                <Trophy className="h-4 w-4 text-yellow-400" /> See Final Results
              </>
            ) : (
              <>
                Next Question <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // RENDER — Results
  // ═════════════════════════════════════════════════════════════════
  if (phase === "results") {
    const pct = (avgScore / 10) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Overall score card */}
        <div className="rounded-2xl border bg-card shadow-xl p-8 text-center space-y-5">
          <Trophy className="h-14 w-14 text-yellow-400 mx-auto" />
          <div>
            <h2 className="text-3xl font-bold gradient-title">Interview Complete!</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              You answered {feedbacks.length} question{feedbacks.length !== 1 ? "s" : ""} across{" "}
              Behavioral, Situational &amp; Technical categories.
            </p>
          </div>

          <div className={`text-6xl font-black ${resultCfg.color}`}>
            {avgScore.toFixed(1)}
            <span className="text-2xl text-muted-foreground font-normal">/10</span>
          </div>

          <div
            className={`inline-block px-5 py-1.5 rounded-full text-sm font-semibold border ${resultCfg.bg} ${resultCfg.color}`}
          >
            {resultLabel}
          </div>

          <div className="space-y-1.5">
            <Progress value={pct} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground px-0.5">
              <span>Needs Work</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Questions", value: feedbacks.length },
              {
                label: "Avg Score",
                value: `${avgScore.toFixed(1)}/10`,
              },
              {
                label: "Best Answer",
                value: `${Math.max(...feedbacks.map((f) => f.feedback?.score ?? 0))}/10`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-muted/30 border p-3 text-center">
                <p className={`text-xl font-bold ${resultCfg.color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Per-question review */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">Full Question Review</h3>
          {feedbacks.map((item, i) => {
            const sc = SCORE_STYLES[item.feedback?.scoreLabel] || SCORE_STYLES["Good"];
            const ts = TYPE_STYLES[item.type] || TYPE_STYLES.Technical;
            return (
              <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={ts.badge}>
                      {item.type}
                    </Badge>
                    <span className={`text-sm font-bold ${sc.color}`}>
                      {item.feedback?.score ?? 0}/10 — {item.feedback?.scoreLabel}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <p className="font-medium text-sm">{item.question}</p>

                {/* Answer preview */}
                <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5 leading-relaxed line-clamp-3">
                  {item.answer}
                </p>

                {/* Brief feedback */}
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  {item.feedback?.feedback}
                </p>

                {/* Score mini-bar */}
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${sc.bar}`}
                    style={{ width: `${((item.feedback?.score ?? 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={restart} variant="outline" className="w-full gap-2 h-11">
          <RotateCcw className="h-4 w-4" />
          Start a New Interview
        </Button>
      </div>
    );
  }

  return null;
}
