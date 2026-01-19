"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { GardenState, GardenElement } from "@spurtalk/shared";
import { motion } from "framer-motion";

export default function GardenPage() {
  const user = useAuthStore((state) => state.user);
  const [garden, setGarden] = useState<GardenState | null>(null);

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const { data } = await api.get<GardenState>("/garden");
        setGarden(data);
      } catch (error) {
        console.error("Failed to fetch garden", error);
      }
    };

    if (user) fetchGarden();
  }, [user]);

  if (!garden) return <div>Growing Garden...</div>;

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Sun */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 bg-yellow-400 rounded-full blur-xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ opacity: garden.sunBrightness }}
      />

      <div className="container mx-auto h-screen flex items-end pb-20">
        <div className="flex flex-wrap gap-4 justify-center items-end w-full">
          {garden.elements.map((element) => (
            <GardenItem key={element.id} element={element} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full text-center text-green-800 dark:text-green-400">
        <p className="text-xl font-bold">{garden.currentStreak} Day Streak!</p>
        <p>Total Blooms: {garden.totalFlowers + garden.totalTrees}</p>
      </div>
    </div>
  );
}

function GardenItem({ element }: { element: GardenElement }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="relative"
    >
      {element.type === "flower" ? (
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: element.color }}
        />
      ) : (
        <div className="w-12 h-16 bg-green-700 rounded-t-full flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full -mt-8"
            style={{ backgroundColor: element.color }}
          />
        </div>
      )}
    </motion.div>
  );
}
