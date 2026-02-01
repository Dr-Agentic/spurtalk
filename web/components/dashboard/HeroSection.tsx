"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGreeting } from "@/lib/design-tokens";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description?: string;
  effort: "Tiny" | "Small" | "Medium" | "Big";
  emotionalTag?: "Boring" | "Scary" | "Fun";
}

interface HeroSectionProps {
  task: Task | null;
  userName?: string;
  onStartTimer: () => void;
  onStartTask: (taskId: string) => void;
  className?: string;
}

const EFFORT_STYLES = {
  Tiny: "bg-success/20 text-success border-success/30",
  Small: "bg-primary/20 text-primary border-primary/30",
  Medium: "bg-secondary/20 text-secondary border-secondary/30",
  Big: "bg-attention/20 text-attention border-attention/30",
};

export function HeroSection({
  task,
  userName,
  onStartTimer,
  onStartTask,
  className,
}: HeroSectionProps) {
  const [greeting, setGreeting] = React.useState("");

  React.useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(getGreeting(hour, userName));
  }, [userName]);

  return (
    <section className={cn("space-y-6", className)}>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-h1 text-foreground">{greeting}</h1>
      </motion.div>

      {/* Primary Task Card */}
      {task ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 shadow-card hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Task Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h2 className="text-h3 text-foreground">{task.title}</h2>
                    {task.description && (
                      <p className="text-body-small text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      variant="outline"
                      className={cn("font-medium", EFFORT_STYLES[task.effort])}
                    >
                      {task.effort}
                    </Badge>
                    {task.emotionalTag && (
                      <Badge variant="secondary" className="text-xs">
                        {task.emotionalTag === "Boring" && "😴"}
                        {task.emotionalTag === "Scary" && "😰"}
                        {task.emotionalTag === "Fun" && "🎉"}
                        {" "}{task.emotionalTag}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-medium gap-2 animate-gentle-pulse hover:animate-none"
                      onClick={onStartTimer}
                    >
                      <Play className="h-5 w-5" />
                      Just 2 Minutes
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 gap-2"
                      onClick={() => onStartTask(task.id)}
                    >
                      Full Focus
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
              <h2 className="text-h3 text-foreground mb-2">All caught up!</h2>
              <p className="text-body-small text-muted-foreground max-w-md">
                You&apos;ve completed all your tasks. Take a moment to enjoy your garden,
                or add a new task when you&apos;re ready.
              </p>
              <Button className="mt-6" variant="outline">
                Add a new task
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </section>
  );
}
