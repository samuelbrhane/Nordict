"use client";

import { useState } from "react";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const emailError =
    touched && !isEmailValid ? "Enter a valid email address" : null;
  const canSubmit = isEmailValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setTouched(true);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Replace with actual password reset logic
      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
        {isSubmitted ? (
          /* Success state */
          <div className="text-center">
            {/* Success icon */}
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Check your email
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              If an account exists for{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                {email}
              </span>
              , we've sent a link to reset your password.
            </p>

            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setTouched(false);
                }}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Try another email
              </button>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
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
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          /* Form state */
          <>
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Reset your password
              </h1>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Enter your email and we'll send you a reset link
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
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
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
                  onBlur={() => setTouched(true)}
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
                  Send reset link
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

            {/* Back to login */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
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
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
