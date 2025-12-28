"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

interface UsageStatsProps {
  activeKeys: number;
}

const UsageStats = ({ activeKeys }: UsageStatsProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            API Calls (Month)
          </p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
            12,847
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            of 50,000
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full"
              style={{ width: "25.7%", backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Active Keys
          </p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
            {activeKeys}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            of 10 allowed
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Avg Response
          </p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
            124ms
          </p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
            ↓ 8ms from last month
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default UsageStats;
