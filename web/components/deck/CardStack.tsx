"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Task } from "@spurtalk/shared";
import { TaskCard } from "./TaskCard";

interface CardStackProps {
  tasks: Task[];
  onSwipe: (taskId: string, direction: "right" | "left" | "down") => void;
}

export function CardStack({ tasks, onSwipe }: CardStackProps) {
  // We only render the top 2 cards for performance and visual stacking
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTask = tasks[currentIndex];
  const nextTask = tasks[currentIndex + 1];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on X movement
  const rotate = useTransform(x, [-200, 200], [-30, 30]);

  // Opacity for cues (Like/Nope overlays if we added them)
  // const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const verticalThreshold = 100;

    if (info.offset.x > threshold) {
      // Swipe Right
      onSwipe(activeTask.id, "right");
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x < -threshold) {
      // Swipe Left
      onSwipe(activeTask.id, "left");
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.y > verticalThreshold) {
      // Swipe Down (Drag down)
      onSwipe(activeTask.id, "down");
      // Down usually means "break down", so maybe we don't advance?
      // Or we replace the current card with the broken down version (subtasks)?
      // For MVP, let's assume we advance or reload.
      // Requirement 5.4: "Triggers Nano-Step Unblocker"
      // Ideally the UI updates to show the steps.
      // We'll let the parent handle the data update, but for animation we might need to reset.
      // Reset position
    }

    // Reset if no threshold met or handled by parent logic that keeps card
    // We rely on 'key' changing to reset state if tasks change
  };

  if (!activeTask) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div className="text-2xl text-gray-400">All caught up! 🎉</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">
      {/* Next Card (Background) */}
      {nextTask && (
        <div className="absolute top-0 w-full h-full scale-95 opacity-50 -z-10 translate-y-4">
          <TaskCard task={nextTask} />
        </div>
      )}

      {/* Active Card (Draggable) */}
      <motion.div
        style={{ x, y, rotate }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        className="absolute top-0 w-full h-full cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 1.05 }}
        key={activeTask.id} // Important for resetting position when task changes
        initial={{ scale: 0.5, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <TaskCard task={activeTask} />
      </motion.div>
    </div>
  );
}
