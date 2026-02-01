"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flower, TreeDeciduous, Sparkles, Sun } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { GardenState, GardenElement } from "@spurtalk/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function GardenPage() {
  const user = useAuthStore((state) => state.user);
  const [garden, setGarden] = useState<GardenState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const { data } = await api.get<GardenState>("/garden");
        setGarden(data);
      } catch (error) {
        console.error("Couldn't load your garden", error);
        // Use mock data for demo
        setGarden({
          userId: user?.id || "",
          elements: generateMockGarden(),
          currentStreak: 3,
          totalFlowers: 8,
          totalTrees: 4,
          sunBrightness: 0.8,
          longestStreak: 7,
          lastUpdated: new Date(),
        } as GardenState);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchGarden();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Flower className="h-8 w-8 text-success animate-bloom" />
          <p className="text-body-small text-muted-foreground">Growing your garden...</p>
        </div>
      </div>
    );
  }

  if (!garden) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 text-center">
        <Flower className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-h2 text-foreground mb-2">Your Garden Awaits</h2>
        <p className="text-body-small text-muted-foreground">
          Complete tasks to grow flowers and trees!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] relative overflow-hidden"
    >
      {/* Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-green-50 dark:from-slate-900 dark:to-slate-800" />

      {/* Sun */}
      <motion.div
        className="absolute top-8 right-8 md:top-16 md:right-16"
        animate={{ 
          scale: [1, 1.1, 1], 
          opacity: [0.8, 1, 0.8] 
        }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ opacity: garden.sunBrightness }}
      >
        <Sun className="h-16 w-16 md:h-24 md:w-24 text-warning drop-shadow-lg" />
      </motion.div>

      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 text-foreground flex items-center gap-2">
              <Flower className="h-7 w-7 text-success" />
              Your Garden
            </h1>
            <p className="text-body-small text-muted-foreground mt-1">
              Every task completed grows something beautiful
            </p>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flower className="h-3 w-3" />
              {garden.totalFlowers} flowers
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <TreeDeciduous className="h-3 w-3" />
              {garden.totalTrees} trees
            </Badge>
          </div>
        </header>

        {/* Streak Card */}
        <Card className="max-w-sm mx-auto mb-8 border-warning/30 bg-warning/5">
          <CardContent className="flex items-center justify-center gap-3 py-4">
            <Sparkles className="h-6 w-6 text-warning animate-gentle-pulse" />
            <span className="text-h3 text-foreground">{garden.currentStreak} Day Streak!</span>
          </CardContent>
        </Card>
      </div>

      {/* Garden Floor */}
      <div className="relative z-10 container mx-auto px-4 pb-32">
        <div className="flex flex-wrap justify-center items-end gap-4 min-h-[300px]">
          {garden.elements.map((element, index) => (
            <GardenItem key={element.id} element={element} index={index} />
          ))}
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-success/30 to-transparent" />
    </motion.div>
  );
}

function GardenItem({ element, index }: { element: GardenElement; index: number }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.05, 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center cursor-pointer"
    >
      {element.type === "flower" ? (
        <Flower 
          className="h-8 w-8 md:h-10 md:w-10 transition-transform" 
          style={{ color: element.color }}
        />
      ) : (
        <TreeDeciduous 
          className="h-12 w-12 md:h-16 md:w-16 transition-transform" 
          style={{ color: element.color }}
        />
      )}
      {/* Stem */}
      <div 
        className="w-0.5 rounded-full bg-success/60"
        style={{ height: element.type === "flower" ? "16px" : "24px" }}
      />
    </motion.div>
  );
}

function generateMockGarden(): GardenElement[] {
  const colors = [
    "#14b8a6", "#8b7cf6", "#10b981", "#f59e0b", "#ec4899", "#6366f1",
  ];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `element-${i}`,
    type: Math.random() > 0.7 ? "tree" : "flower",
    color: colors[Math.floor(Math.random() * colors.length)],
    position: { x: 0, y: 0 },
    size: 1,
    taskId: `task-${i}`,
    createdAt: new Date(),
  } as GardenElement));
}
