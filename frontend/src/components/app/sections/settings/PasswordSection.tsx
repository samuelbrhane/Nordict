"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";

const PasswordSection = () => {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [isChanging, setIsChanging] = useState(false);

  const handleChange = async () => {
    if (form.new !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    setIsChanging(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsChanging(false);
    setForm({ current: "", new: "", confirm: "" });
  };

  const isDisabled = isChanging || !form.current || !form.new || !form.confirm;

  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Change Password
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Update your password for security
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Current
            </label>
            <input
              type="password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              New
            </label>
            <input
              type="password"
              value={form.new}
              onChange={(e) => setForm({ ...form, new: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Confirm
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleChange}
          disabled={isDisabled}
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
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
