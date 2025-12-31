// components/app/sections/dashboard/forecastchart/ForecastSummary.tsx

"use client";

import Link from "next/link";
import { ForecastSummary as ForecastSummaryType } from "./utils";

interface ForecastSummaryProps {
  summary: ForecastSummaryType;
  marketSymbol: string;
}

const DirectionIcon = ({ direction }: { direction: string }) => (
  <svg
    className={`h-3 w-3 ${
      direction === "Bullish"
        ? "text-emerald-600 dark:text-emerald-400"
        : direction === "Bearish"
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
);

const ForecastSummary = ({ summary, marketSymbol }: ForecastSummaryProps) => {
  return (
    <div className="w-full shrink-0 rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 xl:w-52">
      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
        Summary
      </h3>

      <div className="mt-3 space-y-3">
        {/* Direction */}
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Direction
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md ${
                summary.direction === "Bullish"
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : summary.direction === "Bearish"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-neutral-100 dark:bg-neutral-700"
              }`}
            >
              <DirectionIcon direction={summary.direction} />
            </span>
            <span
              className={`text-sm font-medium ${
                summary.direction === "Bullish"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : summary.direction === "Bearish"
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              {summary.direction}
            </span>
          </div>
        </div>

        {/* Range */}
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Range
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
            {summary.range}
          </p>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Confidence
          </p>
          <div className="mt-1">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {summary.confidence}%
            </span>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${summary.confidence}%`,
                  backgroundColor: "var(--brand)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Details Link */}
      <Link
        href={`/app/forecasts/${marketSymbol}`}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
      >
        View Details
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
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ForecastSummary;
