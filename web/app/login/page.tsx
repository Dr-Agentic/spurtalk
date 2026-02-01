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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user);
      router.push("/deck");
    } catch (err: unknown) {
      // Use friendly error messages - never say "Failed"
      const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
      if (axiosError.response?.status === 401) {
        setError(FRIENDLY_ERRORS.invalidCredentials);
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
      title="Welcome back!"
      subtitle="We're glad to see you again"
      footer={
        <>
          <Link
            href="/forgot-password"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-primary transition-colors hover:text-primary/80"
          >
            New here? Create account
          </Link>
        </>
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
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            error={error}
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal text-muted-foreground cursor-pointer"
          >
            Remember me
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
                Signing in...
              </>
            ) : (
              "Let's go!"
            )}
          </Button>
        </motion.div>
      </form>
    </AuthCard>
  );
}
