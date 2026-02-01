"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsProps {
  streak: number;
  todayWins: number;
  gardenGrowth: number;
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  delay?: number;
}

function StatCard({ icon, label, value, subtext, highlight, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn(
        "transition-colors hover:border-primary/30",
        highlight && "border-warning/50 bg-warning/5"
      )}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            highlight ? "bg-warning/20" : "bg-primary/10"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-caption text-muted-foreground">{label}</p>
            <p className="text-h3 text-foreground">{value}</p>
            {subtext && (
              <p className="text-caption text-muted-foreground">{subtext}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function QuickStats({
  streak,
  todayWins,
  gardenGrowth,
  className,
}: QuickStatsProps) {
  return (
    <section className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4", className)}>
      <StatCard
        icon={<Flame className={cn(
          "h-6 w-6",
          streak > 0 ? "text-warning animate-gentle-pulse" : "text-muted-foreground"
        )} />}
        label="Your streak"
        value={streak > 0 ? `${streak} days` : "Start today!"}
        highlight={streak > 0}
        delay={0}
      />
      
      <StatCard
        icon={<Sparkles className="h-6 w-6 text-primary" />}
        label="Small wins today"
        value={todayWins}
        subtext={todayWins === 0 ? "Let's get one!" : todayWins === 1 ? "Great start!" : "Amazing!"}
        delay={0.1}
      />
      
      <StatCard
        icon={<Sprout className="h-6 w-6 text-success" />}
        label="Garden growth"
        value={`${gardenGrowth} blooms`}
        subtext="Keep growing!"
        delay={0.2}
      />
    </section>
  );
}
