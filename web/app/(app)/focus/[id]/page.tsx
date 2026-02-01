"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  CheckCircle2,
  ArrowLeft,
  Timer,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getRandomCelebration } from "@/lib/design-tokens";

// Mock task data
const MOCK_TASK = {
  id: "task-1",
  title: "Review the quarterly report",
  description: "Take a quick look at the Q4 numbers and highlight any questions for tomorrow's meeting.",
  effort: "Small" as const,
  nanoSteps: [
    { id: "step-1", text: "Open the report document", completed: false },
    { id: "step-2", text: "Scan the executive summary", completed: false },
    { id: "step-3", text: "Note any questions", completed: false },
  ],
};

export default function FocusModePage() {
  const _params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerMinutes = searchParams.get("timer");

  const [task] = useState(MOCK_TASK);
  const [isTimerActive, setIsTimerActive] = useState(!!timerMinutes);
  const [timeRemaining, setTimeRemaining] = useState(
    timerMinutes ? parseInt(timerMinutes) * 60 : 2 * 60
  );
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebration, setCelebration] = useState("");

  // Timer logic
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepId)) {
        return prev.filter((id) => id !== stepId);
      }
      return [...prev, stepId];
    });
  };

  const handleComplete = () => {
    setCelebration(getRandomCelebration());
    setShowCelebration(true);

    setTimeout(() => {
      router.push("/deck");
    }, 2000);
  };

  const progress = task.nanoSteps.length > 0
    ? (completedSteps.length / task.nanoSteps.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-16 w-16 text-warning" />
              </motion.div>
              <h2 className="text-h1 text-foreground">{celebration}</h2>
              <p className="text-body text-muted-foreground">
                Your garden is growing...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <Badge
              variant={isTimerActive ? "default" : "secondary"}
              className={cn(
                "gap-1 font-mono text-lg px-3 py-1",
                isTimerActive && "bg-primary animate-gentle-pulse"
              )}
            >
              <Timer className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsTimerActive(!isTimerActive)}
            >
              {isTimerActive ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Task Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-3">
            {task.effort}
          </Badge>
          <h1 className="text-h2 text-foreground mb-2">{task.title}</h1>
          {task.description && (
            <p className="text-body text-muted-foreground">{task.description}</p>
          )}
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-small text-muted-foreground">Progress</span>
            <span className="text-body-small font-medium text-foreground">
              {completedSteps.length} / {task.nanoSteps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Nano Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h3 className="text-subheader text-foreground flex items-center gap-2">
            <ChevronDown className="h-5 w-5" />
            Tiny Steps
          </h3>

          {task.nanoSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/30",
                    isCompleted && "bg-success/10 border-success/30"
                  )}
                  onClick={() => toggleStep(step.id)}
                >
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                      isCompleted
                        ? "bg-success border-success text-success-foreground"
                        : "border-muted-foreground/30"
                    )}>
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      "text-body transition-colors",
                      isCompleted && "text-muted-foreground line-through"
                    )}>
                      {step.text}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Complete Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            className="w-full h-12 text-base font-medium gap-2"
            onClick={handleComplete}
            disabled={completedSteps.length === 0}
          >
            <CheckCircle2 className="h-5 w-5" />
            Mark Complete
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
