"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { NavigationHeader } from "./NavigationHeader";
import { FooterGarden } from "./FooterGarden";
import { cn } from "@/lib/utils";

interface GardenData {
  elements: Array<{
    id: string;
    type: "flower" | "tree" | "sun";
    color: string;
  }>;
  currentStreak: number;
  totalFlowers: number;
  totalTrees: number;
  sunBrightness: number;
  longestStreak: number;
}

interface AppLayoutProps {
  children: React.ReactNode;
  /** Hide the footer garden on certain pages */
  hideFooter?: boolean;
  /** Additional className for the main content area */
  className?: string;
}

export function AppLayout({
  children,
  hideFooter = false,
  className,
}: AppLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [gardenData, setGardenData] = React.useState<GardenData | null>(null);

  // Handle hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [isHydrated, user, router]);

  // Fetch real garden data from API
  React.useEffect(() => {
    if (!user || hideFooter) return;

    api
      .get<GardenData>("/garden")
      .then(({ data }) => {
        if (data) setGardenData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch garden for footer:", err);
      });
  }, [user, hideFooter]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-gentle-pulse rounded-full bg-primary" />
          <p className="text-sm text-muted-foreground">Loading SpurTalk...</p>
        </div>
      </div>
    );
  }

  // Don't render layout if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <NavigationHeader />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1",
          // Add bottom padding to account for footer
          !hideFooter && "pb-24",
          className
        )}
      >
        {children}
      </main>

      {/* Footer Garden */}
      {!hideFooter && (
        <FooterGarden
          streakCount={gardenData?.currentStreak || 0}
          gardenElements={gardenData?.elements || []}
        />
      )}
    </div>
  );
}
