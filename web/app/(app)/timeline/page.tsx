"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Droplets } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { Timeline, TimelineTask } from "@spurtalk/shared";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TimelinePage() {
  console.log("!!! TIMELINE RENDERED !!!");
  const user = useAuthStore((state) => state.user);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (user) fetchTimeline();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-gentle-pulse rounded-full bg-primary" />
          <p className="text-body-small text-muted-foreground">Loading your river...</p>
        </div>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="text-center">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-h2 text-foreground mb-2">Your River</h2>
          <p className="text-body-small text-muted-foreground">
            Start adding tasks to see them flow through time.
          </p>
        </div>
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
      <header className="mb-8 text-center">
        <h1 className="text-h2 text-foreground flex items-center justify-center gap-2">
          <Droplets className="h-7 w-7 text-primary" />
          Your River
        </h1>
        <p className="mt-2 text-body-small text-muted-foreground">
          Watch your tasks flow through time, naturally.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* River Line */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/20 rounded-full" />

        {/* Tasks */}
        <div className="space-y-8">
          {timeline.tasks.map((task, index) => (
            <TimelineTaskItem key={task.taskId} task={task} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineTaskItem({
  task,
  index,
}: {
  task: TimelineTask;
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "flex items-center justify-between w-full",
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Card
        className={cn(
          "w-5/12 transition-all duration-500 hover:shadow-card",
          task.renderStyle === "blurred" && "blur-[2px] hover:blur-none opacity-80",
          task.renderStyle === "misty" && "blur-[4px] hover:blur-[1px] opacity-60"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground truncate max-w-[150px]">
              {task.title || "Untitled Task"}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {format(new Date(task.scheduledDate), "MMM d")}
            </Badge>
          </div>
          {(task as { isBufferDay?: boolean }).isBufferDay && (
            <p className="text-caption text-success">🌿 Buffer day - time to rest</p>
          )}
        </CardContent>
      </Card>

      {/* River Node */}
      <div className="relative z-10">
        <div className={cn(
          "h-4 w-4 rounded-full border-4 border-background",
          (task as { isBufferDay?: boolean }).isBufferDay ? "bg-success" : "bg-primary"
        )} />
      </div>

      <div className="w-5/12" />
    </motion.div>
  );
}
