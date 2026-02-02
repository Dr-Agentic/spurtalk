"use client";

import { toast } from "sonner";
import { Sparkles, Lightbulb, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationVariant = "success" | "info" | "attention";

interface NotificationOptions {
    variant?: NotificationVariant;
    message: string;
    duration?: number;
}

const variantConfig = {
    success: {
        icon: Sparkles,
        className: "bg-primary text-primary-foreground",
        iconClassName: "text-warning",
    },
    info: {
        icon: Lightbulb,
        className: "bg-secondary text-secondary-foreground",
        iconClassName: "text-warning",
    },
    attention: {
        icon: Star,
        className: "bg-warning text-warning-foreground",
        iconClassName: "text-warning-foreground",
    },
} as const;

/**
 * Show a non-intrusive notification with encouraging, psychological safety-focused messaging.
 * Uses teal (success), purple (info), and amber (attention) colors - never red.
 */
export function showNotification({
    variant = "info",
    message,
    duration = 4000,
}: NotificationOptions) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    toast.custom(
        (_id) => (
            <div
                className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg",
                    "animate-fade-slide",
                    config.className
                )}
            >
                <Icon className={cn("h-5 w-5", config.iconClassName)} />
                <span className="text-body-small font-medium">{message}</span>
            </div>
        ),
        { duration }
    );
}

// Pre-configured notification helpers
export const notify = {
    success: (message: string, duration?: number) =>
        showNotification({ variant: "success", message, duration }),

    info: (message: string, duration?: number) =>
        showNotification({ variant: "info", message, duration }),

    attention: (message: string, duration?: number) =>
        showNotification({ variant: "attention", message, duration }),

    // Celebratory notification with sparkle animation
    celebrate: (message: string) =>
        showNotification({
            variant: "success",
            message,
            duration: 5000
        }),
};

export default notify;
