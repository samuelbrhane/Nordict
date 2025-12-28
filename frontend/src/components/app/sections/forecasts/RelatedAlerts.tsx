"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";

interface Alert {
  id: number;
  condition: string;
  horizon: string;
  status: "active" | "paused";
  lastTriggered: string;
}

interface RelatedAlertsProps {
  alerts: Alert[];
  symbol: string;
}

const RelatedAlerts = ({ alerts, symbol }: RelatedAlertsProps) => {
  return (
    <AnimatedCard delay={450}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Related Alerts
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Alerts for this market
            </p>
          </div>
          <Link
            href="/app/alerts"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--brand)" }}
          >
            View all
          </Link>
        </div>
        {alerts.length > 0 ? (
          <div className="mt-4 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {alert.condition}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {alert.horizon} · Last: {alert.lastTriggered}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    alert.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border-2 border-dashed border-neutral-200 p-6 text-center dark:border-neutral-700">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No alerts set for this market
            </p>
            <Link
              href="/app/alerts"
              className="mt-2 inline-block text-sm font-medium"
              style={{ color: "var(--brand)" }}
            >
              Create one →
            </Link>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default RelatedAlerts;
