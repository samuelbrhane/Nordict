"use client";

import { useAuth } from "@/context/AuthContext";
import AnimatedCard from "./AnimatedCard";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface DashboardHeaderProps {
  horizon: Horizon;
  onHorizonChange: (horizon: Horizon) => void;
  lastUpdatedAgo?: string;
  isLoading: boolean;
}

const DashboardHeader = ({
  horizon,
  onHorizonChange,
  lastUpdatedAgo,
  isLoading,
}: DashboardHeaderProps) => {
  const { user } = useAuth();

  const availableHorizons = user?.plan_limits?.horizons || [
    "24H",
    "30D",
    "12W",
    "12M",
  ];

  const handleHorizonClick = (h: Horizon) => {
    if (availableHorizons.includes(h)) {
      onHorizonChange(h);
    }
  };

  return (
    <AnimatedCard delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Latest forecasts, confidence, and system freshness
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Horizon Toggle */}
          <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {(["24H", "30D", "12W", "12M"] as const).map((h) => {
              const isAvailable = availableHorizons.includes(h);
              const isActive = horizon === h;

              return (
                <button
                  key={h}
                  onClick={() => handleHorizonClick(h)}
                  disabled={!isAvailable}
                  title={
                    !isAvailable
                      ? "Upgrade to Premium to access this horizon"
                      : undefined
                  }
                  className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : isAvailable
                      ? "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                      : "cursor-not-allowed text-neutral-300 dark:text-neutral-600"
                  }`}
                >
                  {h}
                  {!isAvailable && (
                    <svg
                      className="absolute -right-1 -top-1 h-3 w-3 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Last Updated Status */}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            {isLoading ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-400" />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Loading...
                </span>
              </>
            ) : (
              <>
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Updated {lastUpdatedAgo || "Never"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DashboardHeader;
