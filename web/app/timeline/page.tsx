"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { Timeline, TimelineTask } from "@spurtalk/shared";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TimelinePage() {
  const user = useAuthStore((state) => state.user);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const { data } = await api.get<Timeline>("/timeline");
        setTimeline(data);
      } catch (error) {
        console.error("Failed to fetch timeline", error);
      }
    };

    if (user) fetchTimeline();
  }, [user]);

  if (!timeline) return <div>Loading Timeline...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-8 flex justify-center">
      <div className="w-full max-w-2xl relative">
        <div className="absolute left-1/2 h-full w-1 bg-blue-300 dark:bg-blue-700 -translate-x-1/2" />

        {timeline.tasks.map((task, index) => (
          <TimelineTaskItem key={task.taskId} task={task} index={index} />
        ))}
      </div>
    </div>
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
    <div
      className={cn(
        "flex items-center justify-between mb-12 w-full",
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "w-5/12 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-all duration-500",
          task.renderStyle === "blurred" &&
            "blur-[2px] hover:blur-none opacity-80",
          task.renderStyle === "misty" &&
            "blur-[4px] hover:blur-[1px] opacity-60"
        )}
      >
        <h3 className="font-bold text-lg">Task</h3>
        <p className="text-sm text-gray-500">
          Due: {format(new Date(task.scheduledDate), "MMM d")}
        </p>
      </div>

      <div className="w-4 h-4 bg-blue-500 rounded-full z-10 border-4 border-white dark:border-gray-900" />

      <div className="w-5/12" />
    </div>
  );
}
