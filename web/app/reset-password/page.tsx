"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      setStatus("success");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setStatus("error");
      setErrorMsg(axiosError.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <AuthCard
        title="Password updated!"
        subtitle="Your password has been changed. You can now sign in."
        footer={
          <Link href="/login" className="text-primary transition-colors hover:text-primary/80">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <Button onClick={() => router.push("/login")} className="w-full h-11 text-base font-medium">
            Sign in with new password
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (status === "error") {
    return (
      <AuthCard
        title="Invalid link"
        subtitle={errorMsg}
        footer={
          <Link href="/forgot-password" className="text-primary transition-colors hover:text-primary/80">
            Request new reset link
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <Link href="/login" className="text-primary hover:underline text-sm">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password you haven't used before"
      footer={
        <Link href="/login" className="text-primary transition-colors hover:text-primary/80">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <PasswordInput
            id="confirm-password"
            placeholder="Same as above"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
          />
        </div>

        {errorMsg && (
          <p className="text-sm text-destructive" role="alert">
            {errorMsg}
          </p>
        )}

        <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthCard title="Loading..." subtitle="Please wait">
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AuthCard>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
