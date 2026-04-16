import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterviewSimulator from "../_components/interview-simulator";

export const metadata = {
  title: "Interview Simulator | SkillSync",
  description:
    "Practice real interview questions powered by Gemini AI. Get instant, constructive feedback on every answer.",
};

export default function InterviewSimulatorPage() {
  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Back button */}
      <div className="flex flex-col space-y-1 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Prep
          </Button>
        </Link>
        <div>
          <h1 className="text-6xl font-bold gradient-title">Interview Simulator</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered interview practice with real-time constructive feedback
          </p>
        </div>
      </div>

      {/* Main simulator */}
      <InterviewSimulator />
    </div>
  );
}
