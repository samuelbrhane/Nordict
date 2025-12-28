"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

interface UsageItem {
  label: string;
  used: number;
  total: number;
}

const USAGE: UsageItem[] = [
  { label: "API Calls", used: 12847, total: 50000 },
  { label: "Markets", used: 6, total: 10 },
  { label: "Alerts", used: 4, total: 25 },
];

const UsageSection = () => {
  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Usage
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Dec 1 – Dec 31, 2024
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {USAGE.map((item) => {
            const percent = Math.round((item.used / item.total) * 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.label}
                  </p>
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">
                    {item.used.toLocaleString()} / {item.total.toLocaleString()}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: "var(--brand)",
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">{percent}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default UsageSection;
