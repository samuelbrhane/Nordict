"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { MetricData } from "@/config/performanceData";

interface MetricConfig {
  key: string;
  label: string;
  tooltip: string;
  higherIsBetter: boolean;
}

const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: "mae",
    label: "MAE",
    tooltip: "Mean Absolute Error",
    higherIsBetter: false,
  },
  {
    key: "rmse",
    label: "RMSE",
    tooltip: "Root Mean Square Error",
    higherIsBetter: false,
  },
  {
    key: "mape",
    label: "MAPE",
    tooltip: "Mean Absolute Percentage Error",
    higherIsBetter: false,
  },
  {
    key: "directionalAccuracy",
    label: "Directional",
    tooltip: "Directional Accuracy",
    higherIsBetter: true,
  },
  {
    key: "calibrationScore",
    label: "Calibration",
    tooltip: "Calibration Score",
    higherIsBetter: true,
  },
  {
    key: "sharpeRatio",
    label: "Sharpe",
    tooltip: "Sharpe Ratio",
    higherIsBetter: true,
  },
];

interface MetricsGridProps {
  metricsData: Record<string, MetricData>;
}

const MetricsGrid = ({ metricsData }: MetricsGridProps) => {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {METRIC_CONFIGS.map((config, index) => {
        const metric = metricsData[config.key];
        const isPositiveChange = metric.trend === "up";
        const isGoodChange = config.higherIsBetter
          ? isPositiveChange
          : !isPositiveChange;

        return (
          <AnimatedCard key={config.key} delay={50 + index * 30}>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {config.label}
                </p>
                <div className="group relative">
                  <svg
                    className="h-3 w-3 cursor-help text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-neutral-700">
                    {config.tooltip}
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {metric.value}
                </p>
                <span
                  className={`text-xs font-medium ${
                    isGoodChange
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          </AnimatedCard>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
