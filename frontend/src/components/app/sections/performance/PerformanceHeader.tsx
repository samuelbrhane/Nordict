"use client";

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
            {HORIZONS.map((horizon) => (
              <button
                key={horizon}
                onClick={() => onHorizonChange(horizon)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedHorizon === horizon
                    ? "text-black shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                style={
                  selectedHorizon === horizon
                    ? { backgroundColor: "var(--brand)" }
                    : {}
                }
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PerformanceHeader;
