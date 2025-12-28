"use client";

import { useState } from "react";
import AnimatedCard from "./AnimatedCard";

interface DashboardHeaderProps {
  marketFilter: "all" | "favorites";
  onMarketFilterChange: (filter: "all" | "favorites") => void;
  horizon: "1D" | "7D" | "30D";
  onHorizonChange: (horizon: "1D" | "7D" | "30D") => void;
  lastUpdated: string;
}

const DashboardHeader = ({
  marketFilter,
  onMarketFilterChange,
  horizon,
  onHorizonChange,
  lastUpdated,
}: DashboardHeaderProps) => {
  return (
    <AnimatedCard delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left - Title */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Latest forecasts, confidence, and system freshness
          </p>
        </div>

        {/* Right - Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Horizon selector */}
          <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {(["1D", "7D", "30D"] as const).map((h) => (
              <button
                key={h}
                onClick={() => onHorizonChange(h)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  horizon === h
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Last updated */}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Updated {lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DashboardHeader;
