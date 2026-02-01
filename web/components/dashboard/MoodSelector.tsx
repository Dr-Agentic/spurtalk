"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOOD_OPTIONS, MOOD_ICONS, type MoodOption } from "@/lib/design-tokens";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface MoodSelectorProps {
  value?: MoodOption;
  onChange: (mood: MoodOption | undefined) => void;
  className?: string;
}

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={cn("space-y-3", className)}
    >
      <h3 className="text-subheader text-foreground">How are you feeling?</h3>
      
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => onChange(val as MoodOption | undefined)}
        className="flex flex-wrap justify-start gap-2"
      >
        {MOOD_OPTIONS.map((mood) => (
          <ToggleGroupItem
            key={mood}
            value={mood}
            aria-label={`Select mood: ${mood}`}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full border transition-all",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="mr-1.5">{MOOD_ICONS[mood]}</span>
            {mood}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      {value && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-body-small text-muted-foreground"
        >
          {value === "Energized" && "Great! Let's tackle something challenging."}
          {value === "Low energy" && "No problem! We'll find something gentle."}
          {value === "Creative" && "Perfect! Time for something expressive."}
          {value === "Need a win" && "Got it! Let's find a quick accomplishment."}
        </motion.p>
      )}
    </motion.section>
  );
}
