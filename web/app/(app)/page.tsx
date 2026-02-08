"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { type MoodOption } from "@/lib/design-tokens";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MoodSelector } from "@/components/dashboard/MoodSelector";

import { type Task } from "@spurtalk/shared";

// Dashboard task with adjusted effort type for HeroSection
type EffortLevel = "Tiny" | "Small" | "Medium" | "Big";

interface DashboardTask extends Omit<Task, "effortLevel"> {
  effort: EffortLevel;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [currentMood, setCurrentMood] = React.useState<MoodOption>();
  const [nextTask, setNextTask] = React.useState<DashboardTask | null>(null);
  const [stats, setStats] = React.useState({
    streak: 0,
    todayWins: 0,
    gardenGrowth: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    // Fetch deck
    api
      .get("/tasks/deck")
      .then((res) => {
        const data = res.data as Task[];
        if (data && data.length > 0) {
          const rawTask = data[0];
          setNextTask({
            ...rawTask,
            effort: (rawTask.effortLevel as EffortLevel) || "Small",
          });
        } else {
          // Fetch active
          return api.get("/tasks?state=Active");
        }
      })
      .then((res) => {
        if (res && res.data) {
          const data = res.data as Task[];
          if (data.length > 0 && !nextTask) {
            const rawTask = data[0];
            setNextTask({
              ...rawTask,
              effort: (rawTask.effortLevel as EffortLevel) || "Small",
            });
          }
        }
      })
      .catch((err: Error) =>
        console.error("[Dashboard] Task fetch error:", err)
      )
      .finally(() => setLoading(false));

    // Fetch garden
    api
      .get("/garden")
      .then((res) => {
        const data = res.data;
        if (data) {
          setStats({
            streak: data.currentStreak,
            todayWins: (data.totalFlowers || 0) + (data.totalTrees || 0),
            gardenGrowth: (data.totalFlowers || 0) + (data.totalTrees || 0),
          });
        }
      })
      .catch((err: Error) =>
        console.error("[Dashboard] Garden fetch error:", err)
      );
  }, [user, nextTask]);

  const handleStartTimer = () => {
    if (nextTask) router.push(`/focus/${nextTask.id}?timer=2`);
  };

  const handleStartTask = (taskId: string) => {
    router.push(`/focus/${taskId}`);
  };

  const handleMoodChange = (mood: MoodOption | undefined) => {
    setCurrentMood(mood);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-4xl px-4 py-8 space-y-8"
    >
      {/* Hero Section - Single Primary Task */}
      <HeroSection
        task={nextTask}
        userName={(user as { name?: string })?.name}
        onStartTimer={handleStartTimer}
        onStartTask={handleStartTask}
      />

      {/* Quick Stats */}
      <QuickStats
        streak={stats.streak}
        todayWins={stats.todayWins}
        gardenGrowth={stats.gardenGrowth}
      />

      {/* Mood Selector */}
      <MoodSelector value={currentMood} onChange={handleMoodChange} />
    </motion.div>
  );
}
