"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../dashboard";

const PasswordSection = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    setError(null);
    setSuccess(false);

    // Validation
    if (form.new.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (form.new !== form.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (form.current === form.new) {
      setError("New password must be different from current password");
      return;
    }

    setIsChanging(true);

    try {
      await changePassword({
        current_password: form.current,
        new_password: form.new,
        new_password_confirm: form.confirm,
      });
      setSuccess(true);
      setForm({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setIsChanging(false);
    }
  };

  const isDisabled =
    isChanging ||
    !form.current ||
    !form.new ||
    !form.confirm ||
    form.new.length < 8;

  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Change Password
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Update your password for security
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-300">
            Password changed successfully
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Current Password
            </label>
            <input
              type="password"
              value={form.current}
              onChange={(e) => {
                setForm({ ...form, current: e.target.value });
                setError(null);
                setSuccess(false);
              }}
              autoComplete="current-password"
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              New Password
            </label>
            <input
              type="password"
              value={form.new}
              onChange={(e) => {
                setForm({ ...form, new: e.target.value });
                setError(null);
                setSuccess(false);
              }}
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            {form.new && form.new.length < 8 && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Must be at least 8 characters
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => {
                setForm({ ...form, confirm: e.target.value });
                setError(null);
                setSuccess(false);
              }}
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            {form.confirm && form.new !== form.confirm && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Passwords don't match
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleChange}
          disabled={isDisabled}
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "var(--brand)" }}
        >
          {isChanging && (
            <svg
              className="h-3.5 w-3.5 animate-spin"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          Update Password
        </button>
      </div>
    </AnimatedCard>
  );
};

export default PasswordSection;
