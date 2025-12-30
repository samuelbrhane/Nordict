"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  AuthCard,
  AuthInput,
  AuthButton,
  AuthError,
  AuthDivider,
  AuthLink,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation
  const validations = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 8,
  };

  const errors = {
    email:
      touched.email && !validations.email
        ? "Enter a valid email address"
        : null,
    password:
      touched.password && !validations.password
        ? "Password must be at least 8 characters"
        : null,
  };

  const canSubmit = validations.email && validations.password && !isLoading;

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push("/app/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={errors.email}
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          error={errors.password}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-[var(--brand)] focus:ring-[var(--brand)] focus:ring-offset-0 dark:border-neutral-600 dark:bg-neutral-800"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--brand)" }}
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Sign in
        </AuthButton>
      </form>

      <AuthDivider text="New to Nordict?" />
      <AuthLink href="/signup">Create an account</AuthLink>
    </AuthCard>
  );
}
