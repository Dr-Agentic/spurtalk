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
import { CardCreationModal } from "@/components/deck/CardCreationModal";
import { useQueryClient } from "@tanstack/react-query";

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks", "deck"] });
    queryClient.invalidateQueries({ queryKey: ["garden"] });
    // Trigger a re-fetch of the dashboard data
    setLoading(true);

    // Return focus to the trigger button after modal closes
    setTimeout(() => triggerRef.current?.focus(), 100);

    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const deckRes = await api.get("/tasks/deck");
      const deckData = deckRes.data as Task[];
      if (deckData && deckData.length > 0) {
        const rawTask = deckData[0];
        setNextTask({
          ...rawTask,
          effort: (rawTask.effortLevel as EffortLevel) || "Small",
        });
      } else {
        const activeRes = await api.get("/tasks?state=Active");
        const activeData = activeRes.data as Task[];
        if (activeData.length > 0) {
          const rawTask = activeData[0];
          setNextTask({
            ...rawTask,
            effort: (rawTask.effortLevel as EffortLevel) || "Small",
          });
        } else {
          setNextTask(null);
        }
      }

      const gardenRes = await api.get("/garden");
      const gardenData = gardenRes.data;
      if (gardenData) {
        setStats({
          streak: gardenData.currentStreak,
          todayWins: (gardenData.totalFlowers || 0) + (gardenData.totalTrees || 0),
          gardenGrowth: (gardenData.totalFlowers || 0) + (gardenData.totalTrees || 0),
        });
      }
    } catch (err) {
      console.error("[Dashboard] Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        ref={triggerRef}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        task={nextTask as any}
        userName={(user as { name?: string })?.name}
        onStartTimer={handleStartTimer}
        onStartTask={handleStartTask}
        onAddCard={() => setIsModalOpen(true)}
      />

      {/* Quick Stats */}
      <QuickStats
        streak={stats.streak}
        todayWins={stats.todayWins}
        gardenGrowth={stats.gardenGrowth}
      />

      {/* Mood Selector */}
      <MoodSelector value={currentMood} onChange={handleMoodChange} />

      {/* Card Creation Modal */}
      <CardCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </motion.div>
  );
}
