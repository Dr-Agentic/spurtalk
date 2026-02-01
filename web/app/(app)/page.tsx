"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { type MoodOption } from "@/lib/design-tokens";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MoodSelector } from "@/components/dashboard/MoodSelector";

// Mock task data - in production this would come from API/store
const MOCK_TASK = {
  id: "task-1",
  title: "Review the quarterly report",
  description: "Take a quick look at the Q4 numbers and highlight any questions for tomorrow's meeting.",
  effort: "Small" as const,
  emotionalTag: "Boring" as const,
};

const MOCK_STATS = {
  streak: 3,
  todayWins: 2,
  gardenGrowth: 12,
};

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [currentMood, setCurrentMood] = React.useState<MoodOption>();
  const [isTimerActive, setIsTimerActive] = React.useState(false);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    // In production, this would open a timer modal or navigate to focus mode
    router.push(`/focus/${MOCK_TASK.id}?timer=2`);
  };

  const handleStartTask = (taskId: string) => {
    router.push(`/focus/${taskId}`);
  };

  const handleMoodChange = (mood: MoodOption | undefined) => {
    setCurrentMood(mood);
    // In production, this would filter/reorder tasks based on mood
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-4xl px-4 py-8 space-y-8"
    >
      {/* Hero Section - Single Primary Task */}
      <HeroSection
        task={MOCK_TASK}
        userName={(user as { name?: string })?.name}
        onStartTimer={handleStartTimer}
        onStartTask={handleStartTask}
      />

      {/* Quick Stats */}
      <QuickStats
        streak={MOCK_STATS.streak}
        todayWins={MOCK_STATS.todayWins}
        gardenGrowth={MOCK_STATS.gardenGrowth}
      />

      {/* Mood Selector */}
      <MoodSelector
        value={currentMood}
        onChange={handleMoodChange}
      />
    </motion.div>
  );
}
