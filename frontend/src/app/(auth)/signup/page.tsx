"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  AuthCard,
  AuthInput,
  AuthButton,
  AuthError,
  AuthDivider,
  AuthLink,
  AuthCheckbox,
} from "@/components/auth";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  // Validation
  const validations = {
    fullName: formData.fullName.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 8,
    confirmPassword:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword.length > 0,
  };

  const errors = {
    fullName:
      touched.fullName && !validations.fullName
        ? "Name must be at least 2 characters"
        : null,
    email:
      touched.email && !validations.email
        ? "Enter a valid email address"
        : null,
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
    terms:
      touched.terms && !agreedToTerms ? "You must agree to the terms" : null,
  };

  const canSubmit =
    validations.fullName &&
    validations.email &&
    validations.password &&
    validations.confirmPassword &&
    agreedToTerms &&
    !isLoading;

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
      setTouched({
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        terms: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await register({
        email: formData.email,
        full_name: formData.fullName,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        timezone: userTimezone,
      });

      router.push("/app/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          const errorMessage = Object.values(parsed).flat().join(", ");
          setError(errorMessage);
        } catch {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Get started with Nordict for free"
    >
      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthInput
          id="fullName"
          label="Full name"
          type="text"
          autoComplete="name"
          value={formData.fullName}
          onChange={handleChange("fullName")}
          onBlur={handleBlur("fullName")}
          error={errors.fullName}
        />

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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange("password")}
          onBlur={handleBlur("password")}
          error={errors.password}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          error={errors.confirmPassword}
        />

        <AuthCheckbox
          checked={agreedToTerms}
          onChange={(checked) => {
            setAgreedToTerms(checked);
            setTouched((t) => ({ ...t, terms: true }));
          }}
          error={errors.terms}
        />

        <AuthButton type="submit" isLoading={isLoading}>
          Create account
        </AuthButton>
      </form>

      <AuthDivider text="Already have an account?" />
      <AuthLink href="/login">Sign in instead</AuthLink>
    </AuthCard>
  );
}
