"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function RootPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Small delay to show the loading animation
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-neutral">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow-primary"
        >
          <Sprout className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        <p className="text-body text-muted-foreground animate-gentle-pulse">
          Loading SpurTalk...
        </p>
      </motion.div>
    </div>
  );
}
