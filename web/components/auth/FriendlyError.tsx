"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FriendlyErrorProps {
  message?: string;
  className?: string;
}

/**
 * A friendly, non-aggressive error message component.
 * Uses amber/sand colors instead of red to maintain psychological safety.
 */
export function FriendlyError({ message, className }: FriendlyErrorProps) {
  if (!message) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -5, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -5, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm",
          className
        )}
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
        <p className="text-warning">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
