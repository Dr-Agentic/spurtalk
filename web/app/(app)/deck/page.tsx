"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import axios from "axios";
import { CardStack } from "@/components/deck/CardStack";
import { Task, NanoStep } from "@spurtalk/shared";
import { UnblockerModal } from "@/components/deck/UnblockerModal";
import { Loader2, Layers } from "lucide-react";

export default function DeckPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Unblocker State
  const [isUnblockerOpen, setIsUnblockerOpen] = useState(false);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [suggestedSteps, setSuggestedSteps] = useState<NanoStep[]>([]);
  const [stuckTaskId, setStuckTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDeck = async () => {
      try {
        const { data } = await api.get<Task[]>("/tasks/deck");
        setTasks(data);
      } catch (error: unknown) {
        console.error("Couldn't load your deck", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [user, router, logout]);

  const handleSwipe = async (
    taskId: string,
    direction: "right" | "left" | "down"
  ) => {
    if (direction === "down") {
      // Trigger Unblocker
      setStuckTaskId(taskId);
      setIsUnblockerOpen(true);
      setIsDecomposing(true);

      try {
        const { data } = await api.post<NanoStep[]>(
          `/unblocker/${taskId}/decompose`
        );
        setSuggestedSteps(data);
      } catch (error) {
        console.error("Let's try breaking that down differently", error);
        setIsUnblockerOpen(false);
      } finally {
        setIsDecomposing(false);
      }

      return;
    }

    try {
      await api.post(`/tasks/deck/${taskId}/swipe`, { direction });

      if (direction === "right") {
        router.push(`/focus/${taskId}`);
      }
    } catch (error) {
      console.error("Something went wrong with the swipe", error);
    }
  };

  const handleAcceptUnblock = async () => {
    if (!stuckTaskId) return;

    try {
      router.push(`/focus/${stuckTaskId}`);
    } catch (error) {
      console.error("Let's try that again", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
        <p className="text-body-small text-muted-foreground animate-gentle-pulse">
          Loading your deck...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-md px-4 py-8"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-h2 text-foreground flex items-center justify-center gap-2">
          <Layers className="h-7 w-7 text-primary" />
          Focus Deck
        </h1>
        <p className="mt-2 text-body-small text-muted-foreground">
          One card at a time. Swipe right to focus, left for later.
        </p>
      </motion.header>

      {/* Card Stack */}
      <main className="h-[500px]">
        <AnimatePresence mode="wait">
          {tasks.length > 0 ? (
            <CardStack tasks={tasks} onSwipe={handleSwipe} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center"
            >
              <Layers className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-h3 text-foreground mb-2">Deck is clear!</h2>
              <p className="text-body-small text-muted-foreground max-w-xs">
                All your tasks are organized. Add a new one when you&apos;re ready,
                or enjoy your accomplishments in the garden.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-caption text-muted-foreground"
      >
        {tasks.length > 0 && (
          <p>You have {tasks.length} card{tasks.length !== 1 ? 's' : ''} in your deck</p>
        )}
      </motion.footer>

      {/* Unblocker Modal */}
      <UnblockerModal
        isOpen={isUnblockerOpen}
        onClose={() => setIsUnblockerOpen(false)}
        isLoading={isDecomposing}
        steps={suggestedSteps}
        onAccept={handleAcceptUnblock}
      />
    </motion.div>
  );
}
