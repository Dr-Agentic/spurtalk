"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Droplets, Plus } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { Timeline, TimelineTask } from "@spurtalk/shared";
import { cn } from "@/lib/utils";
import { TimelineTaskCard } from "@/components/timeline/TimelineTaskCard";
import { TaskDetailSheet } from "@/components/timeline/TaskDetailSheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TimelinePage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);

  // Detail Sheet State
  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchTimeline = async () => {
    try {
      const { data } = await api.get<Timeline>("/timeline");
      setTimeline(data);
    } catch (error) {
      console.error("Couldn't load your timeline", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTimeline();
  }, [user]);

  const handleTaskClick = (task: TimelineTask) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-bloom rounded-full bg-primary" />
          <p className="text-body-small text-muted-foreground animate-gentle-pulse">
            Surveying your river...
          </p>
        </div>
      </div>
    );
  }

  const hasTasks = timeline && timeline.tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-block">
            <Calendar className="h-20 w-20 text-muted-foreground/30" />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-2 p-2 rounded-full bg-background border shadow-sm"
            >
              <Droplets className="h-6 w-6 text-primary" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-h2 text-foreground">Your River is calm.</h2>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              Add some tasks and watch them flow through time, or take a moment to enjoy the stillness. 🌿
            </p>
          </div>

          <Button
            size="lg"
            className="gap-2 rounded-full px-8 shadow-gentle hover:shadow-hover transition-all"
            onClick={() => router.push("/deck")}
          >
            <Plus className="h-5 w-5" />
            Add a new task
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-2xl px-4 py-8"
    >
      {/* Header */}
      <header className="mb-12 text-center">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 mb-2"
        >
          <Droplets className="h-6 w-6 text-primary" />
          <span className="text-caption font-semibold tracking-widest text-primary uppercase">The River</span>
        </motion.div>
        <h1 className="text-h1 text-foreground mb-3">Your Timeline</h1>
        <p className="text-body text-muted-foreground mx-auto max-w-sm">
          A gentle flow of what&apos;s coming next. Focus on the clear, let the misty wait.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative pb-20">
        {/* River Line */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent rounded-full" />

        {/* Tasks */}
        <div className="space-y-12">
          {timeline!.tasks.map((task, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineTaskItem
                key={task.taskId}
                task={task}
                isLeft={isLeft}
                onClick={handleTaskClick}
              />
            );
          })}
        </div>
      </div>

      <TaskDetailSheet
        task={selectedTask}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdate={fetchTimeline}
      />
    </motion.div>
  );
}

function TimelineTaskItem({
  task,
  isLeft,
  onClick,
}: {
  task: TimelineTask;
  isLeft: boolean;
  onClick: (task: TimelineTask) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-between w-full relative",
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
    >
      <TimelineTaskCard
        task={task}
        isLeft={isLeft}
        onClick={onClick}
      />

      {/* River Node */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div className="h-5 w-5 rounded-full border-[3px] border-background bg-primary shadow-sm ring-4 ring-primary/10" />
      </div>

      {/* Empty side for balance */}
      <div className="w-5/12" />
    </motion.div>
  );
}

