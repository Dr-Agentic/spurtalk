"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { CardStack } from "@/components/deck/CardStack";
import { Task, NanoStep } from "@spurtalk/shared";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UnblockerModal } from "@/components/deck/UnblockerModal";

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
      } catch (error) {
        console.error("Failed to fetch deck", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [user, router]);

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
        // Call the decompose endpoint
        const { data } = await api.post<NanoStep[]>(
          `/unblocker/${taskId}/decompose`
        );
        setSuggestedSteps(data);
      } catch (error) {
        console.error("Decomposition failed", error);
        // Maybe show toast error
        setIsUnblockerOpen(false);
      } finally {
        setIsDecomposing(false);
      }

      return; // Don't call swipe endpoint yet, waiting for user confirmation
    }

    try {
      await api.post(`/tasks/deck/${taskId}/swipe`, { direction });

      if (direction === "right") {
        router.push(`/focus/${taskId}`);
      }
      // Left swipe handled by optimistic update in CardStack
    } catch (error) {
      console.error("Swipe failed", error);
    }
  };

  const handleAcceptUnblock = async () => {
    if (!stuckTaskId) return;

    try {
      // The decomposition endpoint already persists the steps and sets state to Active
      // We just need to navigate to Focus Mode
      router.push(`/focus/${stuckTaskId}`);
    } catch (error) {
      console.error("Failed to start unblocked task", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Focus Deck...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Focus Deck</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <main className="w-full max-w-md h-[600px]">
        <CardStack tasks={tasks} onSwipe={handleSwipe} />
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>You have {tasks.length} cards in your deck</p>
      </footer>

      <UnblockerModal
        isOpen={isUnblockerOpen}
        onClose={() => setIsUnblockerOpen(false)}
        isLoading={isDecomposing}
        steps={suggestedSteps}
        onAccept={handleAcceptUnblock}
      />
    </div>
  );
}
