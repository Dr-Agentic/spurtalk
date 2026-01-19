"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { Task, NanoStep } from "@spurtalk/shared";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FocusModePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const { data } = await api.get<Task>(`/tasks/${params.id}`);
        setTask(data);
      } catch (error) {
        console.error("Failed to fetch task", error);
        router.push("/deck");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [user, router, params.id]);

  const toggleCinemaMode = () => {
    setIsCinemaMode(!isCinemaMode);
    if (typeof document !== "undefined") {
      if (!isCinemaMode) {
        document.documentElement.requestFullscreen?.().catch(console.error);
      } else {
        document.exitFullscreen?.().catch(console.error);
      }
    }
  };

  const handleCompleteTask = async () => {
    try {
      await api.post(`/garden/complete/${task?.id}`);
      router.push("/garden");
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  if (loading || !task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Focus Mode...
      </div>
    );
  }

  const steps = (task.nanoSteps as unknown as NanoStep[]) || [];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500",
        isCinemaMode ? "bg-black text-white" : "bg-background text-foreground"
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "p-4 flex justify-between items-center transition-opacity duration-300",
          isCinemaMode ? "opacity-0 hover:opacity-100" : "opacity-100"
        )}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className={isCinemaMode ? "text-white" : ""}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCinemaMode}
          className={isCinemaMode ? "text-white" : ""}
        >
          {isCinemaMode ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </header>

      {/* Main Focus Area */}
      <main className="container mx-auto px-4 py-8 max-w-2xl flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{task.title}</h1>
          {task.description && (
            <p
              className={cn(
                "text-xl",
                isCinemaMode ? "text-gray-400" : "text-muted-foreground"
              )}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Nano Steps */}
        <div className="w-full space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer",
                activeStepId === step.id
                  ? "border-primary bg-primary/10 scale-105 shadow-lg"
                  : "border-border hover:border-primary/50",
                isCinemaMode ? "bg-gray-900 border-gray-800" : "bg-card"
              )}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center",
                    step.isCompleted
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  )}
                >
                  {step.isCompleted && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={cn(
                    "text-lg",
                    step.isCompleted && "line-through text-muted-foreground"
                  )}
                >
                  {step.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Big Finish Button */}
        <Button
          size="lg"
          className="mt-12 w-full max-w-sm text-lg h-16 rounded-full shadow-xl animate-pulse"
          onClick={handleCompleteTask}
        >
          Complete Task & Grow Garden 🌱
        </Button>
      </main>
    </div>
  );
}
