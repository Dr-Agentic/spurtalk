"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  CheckCircle2,
  ArrowLeft,
  Timer,
  Sparkles,
  ChevronDown,
  Flower,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getRandomCelebration } from "@/lib/design-tokens";
import { api } from "@/lib/api";
import { Task, NanoStep } from "@spurtalk/shared";

export default function FocusModePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const timerMinutes = searchParams.get("timer");

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(!!timerMinutes);
  const [timeRemaining, setTimeRemaining] = useState(
    timerMinutes ? parseInt(timerMinutes) * 60 : 2 * 60
  );
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebration, setCelebration] = useState("");

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${params.id}`);
        setTask(data);
        // Initialize completedSteps from pre-completed nano-steps
        const preCompletedSteps = data.nanoSteps
          .filter((step: NanoStep) => step.isCompleted)
          .map((step: NanoStep) => step.id);
        setCompletedSteps(preCompletedSteps);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

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

  const progress =
    task && task.nanoSteps && task.nanoSteps.length > 0
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
                  scale: [1, 1.2, 1],
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
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Flower className="h-8 w-8 text-success animate-bloom mb-4" />
            <p className="text-body text-muted-foreground">
              Loading your task...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <p className="text-h3 text-foreground mb-2">
              This task couldn&apos;t be found
            </p>
            <p className="text-body text-muted-foreground mb-6">
              It may have been moved or deleted.
            </p>
            <Button onClick={() => router.push("/deck")}>Back to Deck</Button>
          </motion.div>
        )}

        {/* Task Info */}
        {!loading && !error && task && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Badge variant="outline" className="mb-3">
                {task.effortLevel}
              </Badge>
              <h1 className="text-h2 text-foreground mb-2">{task.title}</h1>
              {task.description && (
                <p className="text-body text-muted-foreground">
                  {task.description}
                </p>
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
                <span className="text-body-small text-muted-foreground">
                  Progress
                </span>
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

              {task.nanoSteps.map((step: NanoStep, index: number) => {
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
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                            isCompleted
                              ? "bg-success border-success text-success-foreground"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                        <span
                          className={cn(
                            "text-body transition-colors",
                            isCompleted && "text-muted-foreground line-through"
                          )}
                        >
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
          </>
        )}
      </main>
    </div>
  );
}
