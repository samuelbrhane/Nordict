"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app";

const UpgradePage = () => {
  return (
    <AppLayout title="" subtitle="">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/20">
          <svg
            className="mx-auto h-16 w-16 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <h1 className="mt-6 text-2xl font-bold text-amber-800 dark:text-amber-200">
            Upgrade Required
          </h1>
          <p className="mt-3 text-amber-700 dark:text-amber-300">
            This feature requires a higher subscription plan.
          </p>
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Upgrade to Premium for unlimited markets, all horizons, and more.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/app/settings/billing"
              className="block w-full rounded-xl py-3 font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              View Plans & Upgrade
            </Link>
            {/* <Link
              href="/app/dashboard"
              className="block w-full rounded-xl border border-neutral-300 bg-white py-3 font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Go Back to Dashboard
            </Link> */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UpgradePage;
