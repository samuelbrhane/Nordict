"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthCard, AuthInput, AuthButton, AuthError } from "@/components/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Validation
  const validations = {
    password: formData.password.length >= 8,
    confirmPassword:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword.length > 0,
  };

  const errors = {
    password:
      touched.password && !validations.password
        ? "Password must be at least 8 characters"
        : null,
    confirmPassword:
      touched.confirmPassword && !validations.confirmPassword
        ? formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "Please confirm your password"
        : null,
  };

  const canSubmit =
    validations.password && validations.confirmPassword && !isLoading;

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

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (!canSubmit) {
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/password-reset/confirm/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password: formData.password,
            password_confirm: formData.confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
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

  if (success) {
    return (
      <AuthCard title="Password reset!" subtitle="Redirecting to login...">
        <div className="mt-6 text-center">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
          >
            <svg
              className="h-7 w-7"
              style={{ color: "var(--brand)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Your password has been updated successfully.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set new password" subtitle="Enter your new password below">
      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthInput
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          error={errors.password}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          error={errors.confirmPassword}
        />

        <AuthButton type="submit" isLoading={isLoading}>
          Reset password
        </AuthButton>
      </form>
    </AuthCard>
  );
}
