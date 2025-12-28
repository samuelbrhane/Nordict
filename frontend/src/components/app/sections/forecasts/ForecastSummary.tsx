"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface ForecastSummaryProps {
  direction: "up" | "down" | "neutral";
  expectedRange: string;
  confidence: number;
  expectedChange: string;
}

const ForecastSummary = ({
  direction,
  expectedRange,
  confidence,
  expectedChange,
}: ForecastSummaryProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <AnimatedCard delay={50}>
        <div className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              direction === "up"
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : direction === "down"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-neutral-100 dark:bg-neutral-800"
            }`}
          >
            <svg
              className={`h-6 w-6 ${
                direction === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : direction === "down"
                  ? "rotate-180 text-red-600 dark:text-red-400"
                  : "rotate-90 text-neutral-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Direction
            </p>
            <p
              className={`text-lg font-semibold capitalize ${
                direction === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : direction === "down"
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              {direction} {expectedChange}
            </p>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <div className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
          >
            <svg
              className="h-6 w-6"
              style={{ color: "var(--brand)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Expected Range
            </p>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              {expectedRange}
            </p>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={150}>
        <div className="flex h-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
          >
            <svg
              className="h-6 w-6"
              style={{ color: "var(--brand)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Confidence
            </p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {confidence}%
              </p>
              <div className="h-2 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${confidence}%`,
                    backgroundColor: "var(--brand)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ForecastSummary;
