"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Zustand persist hydration check
  // In a real app, we might want a proper hydration loading state
  // or use persist's onFinishHydration.
  // For now, we rely on the fact that persist usually hydrates synchronously if storage is available,
  // or we might flicker.

  useEffect(() => {
    // Basic client-side redirect
    // We can improve this with middleware later for better UX
    if (user) {
      router.push("/deck");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading SpurTalk...</div>
    </div>
  );
}
