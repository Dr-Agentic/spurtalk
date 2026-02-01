"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type LoadingVariant = "spinner" | "skeleton" | "progress";

interface LoadingStateProps {
    variant?: LoadingVariant;
    message?: string;
    showMessageDelay?: number;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const LONG_LOADING_MESSAGES = [
    "Still working on it...",
    "Almost there...",
    "Good things take time...",
    "Hang in there...",
    "Just a moment more...",
];

/**
 * Calming loading indicators with gentle animations.
 * Shows encouraging messages after a delay to reduce anxiety.
 */
export function LoadingState({
    variant = "spinner",
    message,
    showMessageDelay = 5000,
    className,
    size = "md",
}: LoadingStateProps) {
    const [showDelayedMessage, setShowDelayedMessage] = useState(false);
    const [delayedMessage, setDelayedMessage] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayedMessage(
                LONG_LOADING_MESSAGES[
                Math.floor(Math.random() * LONG_LOADING_MESSAGES.length)
                ]
            );
            setShowDelayedMessage(true);
        }, showMessageDelay);

        return () => clearTimeout(timer);
    }, [showMessageDelay]);

    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                className
            )}
            role="status"
            aria-label="Loading"
        >
            {variant === "spinner" && (
                <motion.div
                    className={cn(
                        "rounded-full border-2 border-primary border-t-transparent",
                        sizeClasses[size]
                    )}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            )}

            {variant === "skeleton" && (
                <div className="space-y-2 w-full max-w-xs">
                    <div className="h-4 bg-muted rounded animate-shimmer" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-shimmer" />
                    <div className="h-4 bg-muted rounded w-1/2 animate-shimmer" />
                </div>
            )}

            {variant === "progress" && (
                <div className="w-full max-w-xs">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-secondary rounded-full"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            style={{ width: "50%" }}
                        />
                    </div>
                </div>
            )}

            {/* Display provided message or delayed encouraging message */}
            <AnimatePresence mode="wait">
                {(message || showDelayedMessage) && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-body-small text-muted-foreground animate-gentle-pulse"
                    >
                        {message || delayedMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

// Pre-configured loading states
export const Loading = {
    Spinner: (props: Omit<LoadingStateProps, "variant">) => (
        <LoadingState variant="spinner" {...props} />
    ),
    Skeleton: (props: Omit<LoadingStateProps, "variant">) => (
        <LoadingState variant="skeleton" {...props} />
    ),
    Progress: (props: Omit<LoadingStateProps, "variant">) => (
        <LoadingState variant="progress" {...props} />
    ),
};

export default LoadingState;
