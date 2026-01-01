"use client";

import { useAuth } from "@/context/AuthContext";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface PerformanceHeaderProps {
  selectedHorizon: Horizon;
  onHorizonChange: (horizon: Horizon) => void;
}

const HORIZONS: Horizon[] = ["24H", "30D", "12W", "12M"];

const PerformanceHeader = ({
  selectedHorizon,
  onHorizonChange,
}: PerformanceHeaderProps) => {
  const { user } = useAuth();

  const availableHorizons = user?.plan_limits?.horizons || [
    "24H",
    "30D",
    "12W",
    "12M",
  ];

  const handleHorizonClick = (horizon: Horizon) => {
    if (availableHorizons.includes(horizon)) {
      onHorizonChange(horizon);
    }
  };

  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Model Performance
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Accuracy and validation metrics
            </p>
          </div>

          {/* Horizon Selector */}
          <div className="flex w-fit rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {HORIZONS.map((horizon) => {
              const isAvailable = availableHorizons.includes(horizon);
              const isActive = selectedHorizon === horizon;

              return (
                <button
                  key={horizon}
                  onClick={() => handleHorizonClick(horizon)}
                  disabled={!isAvailable}
                  title={
                    !isAvailable
                      ? "Upgrade to Premium to access this horizon"
                      : undefined
                  }
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "text-black shadow-sm"
                      : isAvailable
                      ? "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      : "cursor-not-allowed text-neutral-300 dark:text-neutral-600"
                  }`}
                  style={isActive ? { backgroundColor: "var(--brand)" } : {}}
                >
                  {horizon}
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
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PerformanceHeader;
