"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function UpgradePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Icon */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
        >
          <svg
            className="h-8 w-8"
            style={{ color: "var(--brand)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Your trial has ended
          </h1>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Hi {user?.first_name || "there"}, your 7-day free trial has expired.
            Upgrade to Pro to continue using Nordict.
          </p>
        </div>

        {/* Pricing options */}
        <div className="mt-8 space-y-3">
          {/* Pro Plan */}
          <div className="rounded-xl border-2 border-[var(--brand)] bg-[var(--brand)]/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Pro
                </h3>
                <p className="text-sm text-neutral-500">Most popular</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  €19
                </span>
                <span className="text-sm text-neutral-500">/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>✓ 5 markets</li>
              <li>✓ 5 alerts</li>
              <li>✓ 2 devices</li>
              <li>✓ Daily forecasts</li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  Premium
                </h3>
                <p className="text-sm text-neutral-500">For power users</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  €49
                </span>
                <span className="text-sm text-neutral-500">/month</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>✓ Unlimited markets</li>
              <li>✓ Unlimited alerts</li>
              <li>✓ 5 devices</li>
              <li>✓ All forecast horizons</li>
              <li>✓ API access</li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            href="/app/settings/billing"
            className="block w-full rounded-xl py-3 text-center text-sm font-medium text-black transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand)" }}
          >
            Choose a plan
          </Link>
          <button
            onClick={logout}
            className="block w-full rounded-xl border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>

        {/* Help */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          Questions?{" "}
          <a
            href="mailto:support@nordict.com"
            className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
