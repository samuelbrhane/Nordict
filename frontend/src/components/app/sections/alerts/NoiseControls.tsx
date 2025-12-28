"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";

const NoiseControls = () => {
  const [quietHours, setQuietHours] = useState(false);

  return (
    <AnimatedCard delay={150} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Noise Controls
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Manage alert frequency
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Default Cooldown
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Min time between alerts
              </p>
            </div>
            <select className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <option>15 min</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>24 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Daily Limit
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Max alerts per day
              </p>
            </div>
            <select className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <option>5</option>
              <option>10</option>
              <option>25</option>
              <option>Unlimited</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Quiet Hours
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pause during night
              </p>
            </div>
            <button
              onClick={() => setQuietHours(!quietHours)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                quietHours ? "" : "bg-neutral-200 dark:bg-neutral-700"
              }`}
              style={quietHours ? { backgroundColor: "var(--brand)" } : {}}
            >
              <span
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  quietHours ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            Delivery
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Email
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                </svg>
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Webhook
                </span>
              </div>
              <span className="text-xs text-neutral-400">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default NoiseControls;
