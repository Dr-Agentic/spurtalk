"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { FRIENDLY_ERRORS } from "@/lib/design-tokens";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch {
      setError(FRIENDLY_ERRORS.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle={`If ${email} is registered, we sent a reset link.`}
        footer={
          <Link href="/login" className="text-primary transition-colors hover:text-primary/80">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <p className="text-body-small text-muted-foreground text-center">
            Click the link in the email to reset your password. Links expire in 1 hour.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link href="/login" className="text-primary transition-colors hover:text-primary/80">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>

        <p className="text-body-small text-muted-foreground text-center">
          No email? Check your spam folder, or{" "}
          <Link href="/register" className="text-primary hover:underline">
            create a new account
          </Link>
          .
        </p>
      </form>
    </AuthCard>
  );
}
