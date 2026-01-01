"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { Alert } from "@/lib/hooks/useAlerts";

interface AlertsListProps {
  alerts: Alert[];
  isLoading?: boolean;
  onToggleStatus: (alertId: number) => void;
  onDelete: (alertId: number) => void;
}

const getConditionLabel = (alert: Alert): string => {
  const labels: Record<string, string> = {
    direction_change: "Direction Changes",
    direction_up: "Direction is Up",
    direction_down: "Direction is Down",
    confidence_above: `Confidence > ${alert.condition_value}%`,
    confidence_below: `Confidence < ${alert.condition_value}%`,
    expected_move_above: `Expected Move > ${alert.condition_value}%`,
    expected_move_below: `Expected Move < ${alert.condition_value}%`,
    price_above: `Price > $${alert.condition_value}`,
    price_below: `Price < $${alert.condition_value}`,
  };
  return labels[alert.condition_type] || alert.condition_type;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AlertsList = ({
  alerts,
  isLoading,
  onToggleStatus,
  onDelete,
}: AlertsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <AnimatedCard delay={50}>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <svg
              className="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            No alerts configured
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Create an alert to get notified about forecast changes
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <AnimatedCard key={alert.id} delay={50 + index * 30}>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {alert.market_symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {alert.market_symbol}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        alert.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {alert.status}
                    </span>
                    {alert.horizon !== "ANY" && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {alert.horizon}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {getConditionLabel(alert)}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                    <span>
                      Triggered: {alert.trigger_count} time
                      {alert.trigger_count !== 1 ? "s" : ""}
                    </span>
                    <span>Last: {formatDate(alert.last_triggered_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(alert.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    alert.status === "active"
                      ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }`}
                  title={alert.status === "active" ? "Pause" : "Activate"}
                >
                  {alert.status === "active" ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => onDelete(alert.id)}
                  className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default AlertsList;
