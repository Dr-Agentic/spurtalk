"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { FRIENDLY_ERRORS } from "@/lib/design-tokens";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { FriendlyError } from "@/components/auth/FriendlyError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(FRIENDLY_ERRORS.passwordMismatch);
      return;
    }

    // Validate password strength (basic)
    if (password.length < 8) {
      setError(FRIENDLY_ERRORS.weakPassword);
      return;
    }

    // Validate terms
    if (!agreedToTerms) {
      setError("Please agree to the terms to continue - they're friendly, we promise!");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/register", { email, password });
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user);
      router.push("/deck");
    } catch (err: unknown) {
      // Use friendly error messages
      const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
      if (axiosError.response?.status === 409) {
        setError(FRIENDLY_ERRORS.emailTaken);
      } else if (axiosError.response?.status === 0 || !axiosError.response) {
        setError(FRIENDLY_ERRORS.networkError);
      } else {
        setError(FRIENDLY_ERRORS.genericError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Ready to start?"
      subtitle="No pressure. Just possibilities."
      footer={
        <Link
          href="/login"
          className="text-primary transition-colors hover:text-primary/80"
        >
          Already have an account? Sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords don't match yet" : undefined}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              privacy policy
            </Link>
          </Label>
        </div>

        {/* Error Message */}
        <FriendlyError message={error} />

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your space...
              </>
            ) : (
              "Create my space"
            )}
          </Button>
        </motion.div>
      </form>
    </AuthCard>
  );
}
