"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to your logger (Phase 5)
    console.error("Route Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 text-center space-y-6">
      <div className="bg-destructive/10 p-6 rounded-full">
        <AlertCircle className="h-16 w-16 text-destructive" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground">
          We encountered an unexpected error while loading this page. Don't worry, it's not your fault.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          size="lg"
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          size="lg"
        >
          Go Back Home
        </Button>
      </div>

      <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded">
        Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </p>
    </div>
  );
}
