"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle2, Sparkles, Heart, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Show loading while we check - or redirect if user exists
  if (user) {
    // Use window navigation since router isn't ready during SSR
    if (typeof window !== "undefined") {
      window.location.href = "/deck";
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/waitlist", { email });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">SpurTalk</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="text-sm">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2 text-sm text-primary font-medium">
              Anti-guilt project management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Get things done without the guilt
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              A calming way to manage tasks that understands{" "}
              <em>why</em> you procrastinate — and helps you start anyway.
            </p>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="h-10">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Join waitlist"
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Join {500}+ others waiting. No spam, ever.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-muted rounded-lg"
              >
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">You&apos;re on the list!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We&apos;ll email you when spots open up.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">No guilt trips</h3>
            <p className="text-sm text-muted-foreground">
              No &quot;just do it&quot; speeches. We meet you where you are.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Break it down</h3>
            <p className="text-sm text-muted-foreground">
              Overwhelmed? We&apos;ll break big tasks into tiny steps.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Watch it grow</h3>
            <p className="text-sm text-muted-foreground">
              Complete tasks → grow a garden. Your progress, visualized.
            </p>
          </div>
        </motion.div>

        {/* Social Proof / CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Made for people who care about getting things done — just need a little help starting.
          </p>
          <Link href="/register">
            <Button variant="outline">Try it free</Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 SpurTalk. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}