"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Flower, TreeDeciduous, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GardenElement {
  id: string;
  type: "flower" | "tree";
  color: string;
}

interface FooterGardenProps {
  streakCount?: number;
  gardenElements?: GardenElement[];
  className?: string;
}

export function FooterGarden({
  streakCount = 0,
  gardenElements = [],
  className,
}: FooterGardenProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Generate placeholder elements if none provided
  const elements = gardenElements.length > 0 
    ? gardenElements 
    : generatePlaceholderGarden();

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t border-success/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "transition-all duration-300 ease-out",
        isExpanded ? "h-40" : "h-20",
        className
      )}
    >
      <div className="container mx-auto flex h-full items-end justify-between px-4 pb-3">
        {/* Garden Preview */}
        <div className="flex items-end gap-1">
          {elements.slice(0, isExpanded ? 12 : 6).map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05, 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="flex flex-col items-center"
            >
              {element.type === "flower" ? (
                <Flower 
                  className="h-5 w-5 transition-transform hover:scale-110" 
                  style={{ color: element.color }}
                />
              ) : (
                <TreeDeciduous 
                  className="h-7 w-7 transition-transform hover:scale-110" 
                  style={{ color: element.color }}
                />
              )}
              {/* Stem */}
              <div 
                className="w-0.5 rounded-full bg-success/60"
                style={{ height: element.type === "flower" ? "12px" : "16px" }}
              />
            </motion.div>
          ))}
          
          {/* Placeholder for more */}
          {elements.length > (isExpanded ? 12 : 6) && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
              +{elements.length - (isExpanded ? 12 : 6)}
            </div>
          )}
        </div>

        {/* Center Actions */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            aria-label={isExpanded ? "Collapse garden preview" : "Expand garden preview"}
          >
            <ChevronUp 
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )} 
            />
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/garden">
              <Flower className="h-4 w-4 text-success" />
              <span>View Garden</span>
            </Link>
          </Button>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={cn(
              "gap-1.5 px-3 py-1",
              streakCount > 0 && "bg-warning/20 text-warning hover:bg-warning/30"
            )}
          >
            <Flame className={cn(
              "h-4 w-4",
              streakCount > 0 && "animate-gentle-pulse"
            )} />
            <span className="font-semibold">
              {streakCount > 0 ? `${streakCount} day streak` : "Start a streak!"}
            </span>
          </Badge>
        </div>
      </div>

      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-success/20 via-success/40 to-success/20" />
    </motion.footer>
  );
}

// Generate placeholder garden for demo
function generatePlaceholderGarden(): GardenElement[] {
  const colors = [
    "#14b8a6", // teal (primary)
    "#8b7cf6", // lavender (secondary)
    "#10b981", // emerald (success)
    "#f59e0b", // amber (warning)
    "#ec4899", // pink
    "#6366f1", // indigo
  ];

  return Array.from({ length: 8 }, (_, i) => ({
    id: `placeholder-${i}`,
    type: Math.random() > 0.7 ? "tree" : "flower",
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}
