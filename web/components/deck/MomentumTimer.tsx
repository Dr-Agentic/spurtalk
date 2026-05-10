"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Sparkles, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MomentumTimerProps {
  taskId: string;
  onComplete: (result: MomentumResult) => void;
  onAbandon: (secondsWorked: number) => void;
}

export interface MomentumResult {
  id: string;
  durationSeconds: number;
  completed: boolean;
  earnedFlower: boolean;
  totalSecondsWorked: number;
}

const FIVE_MINUTES = 5 * 60;

export function MomentumTimer({ taskId, onComplete, onAbandon }: MomentumTimerProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(FIVE_MINUTES);
  const [isActive, setIsActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedFlower, setEarnedFlower] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const secondsWorkedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start session on mount
  useEffect(() => {
    const startSession = async () => {
      try {
        const { data } = await api.post(`/momentum/start/${taskId}`);
        setSessionId(data.sessionId);
        setIsActive(true);
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error("Failed to start momentum session:", err);
      }
    };

    startSession();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // Timer tick
  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer finished!
          handleComplete();
          return 0;
        }
        secondsWorkedRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleComplete = async () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!sessionId) return;

    const actualSeconds = secondsWorkedRef.current || FIVE_MINUTES;

    try {
      const { data } = await api.post(`/momentum/complete/${sessionId}`, {
        actualSecondsWorked: actualSeconds,
      });

      setEarnedFlower(data.earnedFlower);
      setShowCelebration(true);

      setTimeout(() => {
        onComplete(data);
      }, 2500);
    } catch (err) {
      console.error("Failed to complete session:", err);
      onComplete({
        id: sessionId,
        durationSeconds: actualSeconds,
        completed: true,
        earnedFlower: false,
        totalSecondsWorked: actualSeconds,
      });
    }
  };

  const handleAbandon = async () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!sessionId) {
      onAbandon(0);
      return;
    }

    const actualSeconds = secondsWorkedRef.current;

    try {
      await api.post(`/momentum/abandon/${sessionId}`, {
        actualSecondsWorked: actualSeconds,
      });
    } catch (err) {
      console.error("Failed to abandon session:", err);
    }

    onAbandon(actualSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((FIVE_MINUTES - timeRemaining) / FIVE_MINUTES) * 100;

  return (
    <>
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
              className="flex flex-col items-center gap-4 text-center p-8"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                {earnedFlower ? (
                  <Flower2 className="h-20 w-20 text-success" />
                ) : (
                  <Sparkles className="h-20 w-20 text-warning" />
                )}
              </motion.div>
              <h2 className="text-h1 text-foreground">
                {earnedFlower ? "You earned a flower! 🌸" : "Great effort! 💪"}
              </h2>
              <p className="text-body text-muted-foreground">
                {earnedFlower
                  ? "Your garden is growing..."
                  : `You worked for ${Math.floor(secondsWorkedRef.current / 60)} minutes`}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Momentum Timer Card */}
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardContent className="py-6 px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-subheader font-medium">5-Minute Momentum</span>
            </div>

            {/* Timer Display */}
            <div className="relative">
              <motion.div
                animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                className="text-h1 font-mono text-foreground"
              >
                {formatTime(timeRemaining)}
              </motion.div>

              {/* Progress ring */}
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${progress * 2.83} 283`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-body-small text-muted-foreground text-center">
                {isActive ? "Momentum building..." : "Timer paused"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActive(!isActive)}
                className="gap-2"
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Resume
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleAbandon}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" /> Give Up
              </Button>
            </div>

            {/* Helper text */}
            <p className="text-body-small text-muted-foreground text-center max-w-xs">
              Just 5 minutes. That&apos;s all. If you keep going after, even better!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}