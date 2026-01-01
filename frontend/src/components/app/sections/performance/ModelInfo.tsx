"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface ModelInfoData {
  id: number;
  name: string;
  version: string;
  horizon: string;
  status: string;
  mae: number | null;
  rmse: number | null;
  mape: number | null;
  directional_accuracy: number | null;
  r2: number | null;
  training_data_start: string | null;
  training_data_end: string | null;
  created_at: string;
}

interface ModelInfoProps {
  model: ModelInfoData | null;
  isLoading?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTrainingPeriod = (
  start: string | null,
  end: string | null
): string => {
  if (!start || !end) return "N/A";
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })} – ${endDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })}`;
};

const getHorizonLabel = (horizon: string): string => {
  switch (horizon) {
    case "24H":
      return "24 Hours";
    case "30D":
      return "30 Days";
    case "12W":
      return "12 Weeks";
    case "12M":
      return "12 Months";
    default:
      return horizon;
  }
};

const ModelInfo = ({ model, isLoading }: ModelInfoProps) => {
  if (isLoading) {
    return (
      <AnimatedCard delay={100}>
        <div className="h-40 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800" />
      </AnimatedCard>
    );
  }

  if (!model) {
    return (
      <AnimatedCard delay={100}>
        <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">
            No model found for this horizon
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              v{model.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {model.name}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    model.status === "production"
                      ? "text-black"
                      : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                  }`}
                  style={
                    model.status === "production"
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {model.status === "production" ? "Production" : model.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {getHorizonLabel(model.horizon)} forecast horizon
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Active
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              RMSE
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
              {model.rmse !== null
                ? `${(model.rmse * 100).toFixed(1)}%`
                : "N/A"}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Root Mean Square Error
            </p>
          </div>

          <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              MAE
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
              {model.mae !== null ? `${(model.mae * 100).toFixed(1)}%` : "N/A"}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Mean Absolute Error
            </p>
          </div>

          <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Training Data
            </p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
              {formatTrainingPeriod(
                model.training_data_start,
                model.training_data_end
              )}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Historical data period
            </p>
          </div>

          <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Deployed
            </p>
            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
              {formatDate(model.created_at)}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Last updated
            </p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ModelInfo;
