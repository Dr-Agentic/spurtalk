"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCardButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddCardButton = forwardRef<HTMLButtonElement, AddCardButtonProps>(
  function AddCardButton({ onClick, className }, ref) {
    return (
      <motion.button
        ref={ref}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        aria-label="Add a new card"
        className={cn(
          "fixed bottom-24 right-24 z-40",
          "flex h-14 w-14 items-center justify-center",
          "rounded-full bg-primary text-white shadow-lg",
          "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    );
  }
);
