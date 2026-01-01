"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { AlertHistory as AlertHistoryType } from "@/lib/hooks/useAlerts";

interface AlertHistoryProps {
  history: AlertHistoryType[];
  isLoading?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AlertHistory = ({ history, isLoading }: AlertHistoryProps) => {
  if (isLoading) {
    return (
      <AnimatedCard delay={150}>
        <div className="h-80 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800" />
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={150}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Alert History
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Recent triggered alerts
        </p>

        {history.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">
              No alerts triggered yet
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {item.market_symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.market_symbol}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {item.condition_met}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.forecast_value}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(item.triggered_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default AlertHistory;
