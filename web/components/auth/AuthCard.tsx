"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  children,
  title,
  subtitle,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-neutral p-4">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("w-full max-w-[400px]", className)}
      >
        <Card className="shadow-card border-border/50">
          <CardHeader className="space-y-4 text-center">
            {/* Logo */}
            <Link 
              href="/" 
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary transition-transform hover:scale-105"
            >
              <Sprout className="h-7 w-7 text-primary-foreground" />
            </Link>

            {/* Title */}
            <div className="space-y-1">
              <CardTitle className="text-h2">{title}</CardTitle>
              {subtitle && (
                <CardDescription className="text-body-small">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </CardHeader>

          <CardContent>{children}</CardContent>

          {footer && (
            <CardFooter className="flex flex-col gap-3 text-center text-sm">
              {footer}
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
