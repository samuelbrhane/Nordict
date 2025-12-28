"use client";

import { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8;

  const emailError =
    touched.email && !isEmailValid ? "Enter a valid email address" : null;
  const passwordError =
    touched.password && !isPasswordValid
      ? "Password must be at least 8 characters"
      : null;

  const canSubmit = isEmailValid && isPasswordValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Replace with actual auth logic
      // For demo, simulate an error
      setError("Invalid email or password. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-5 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/50">
            <svg
              className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                emailError
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:focus:border-red-500"
                  : "border-neutral-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:focus:border-[var(--brand)]"
              }`}
            />
            {emailError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                passwordError
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:focus:border-red-500"
                  : "border-neutral-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:focus:border-[var(--brand)]"
              }`}
            />
            {passwordError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                {passwordError}
              </p>
            )}
          </div>

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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-black shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              backgroundColor: "var(--brand)",
              boxShadow: "0 4px 14px 0 rgba(4, 236, 58, 0.25)",
            }}
          >
            <span
              className={`relative z-10 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            >
              Sign in
            </span>

            {/* Loading spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-5 w-5 animate-spin text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}

            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              New to Nordict?
            </span>
          </div>
        </div>

        {/* Create account link */}
        <div className="mt-6 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--brand)" }}
          >
            Create an account
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
