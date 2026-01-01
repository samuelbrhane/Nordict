"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface ModelData {
  mae: number | null;
  rmse: number | null;
  mape: number | null;
  r2: number | null;
  median_ae: number | null;
  max_error: number | null;
  bias: number | null;
  correlation: number | null;
}

interface MetricsGridProps {
  model: ModelData | null;
  isLoading?: boolean;
}

const MetricsGrid = ({ model, isLoading }: MetricsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (!model) {
    return null;
  }

  const metrics = [
    {
      label: "MAPE",
      value: model.mape !== null ? `${model.mape.toFixed(2)}%` : "N/A",
      description: "Mean Absolute Percentage Error",
      good: model.mape !== null && model.mape < 10,
    },
    {
      label: "R²",
      value: model.r2 !== null ? model.r2.toFixed(3) : "N/A",
      description: "Coefficient of Determination",
      good: model.r2 !== null && model.r2 > 0.5,
    },
    {
      label: "Correlation",
      value: model.correlation !== null ? model.correlation.toFixed(3) : "N/A",
      description: "Prediction vs Actual",
      good: model.correlation !== null && model.correlation > 0.5,
    },
    {
      label: "Bias",
      value: model.bias !== null ? `${(model.bias * 100).toFixed(2)}%` : "N/A",
      description: "Prediction Bias",
      good: model.bias !== null && Math.abs(model.bias) < 0.01,
    },
  ];

  return (
    <AnimatedCard delay={150}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Extended Metrics
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Additional model performance indicators
        </p>

        <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {metric.label}
              </p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  metric.good
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-900 dark:text-white"
                }`}
              >
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default MetricsGrid;
