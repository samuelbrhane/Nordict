"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Alert } from "@/config/alertsData";

interface AlertsListProps {
  alerts: Alert[];
  onToggleStatus: (alertId: number) => void;
  onDelete: (alertId: number) => void;
}

const AlertsList = ({ alerts, onToggleStatus, onDelete }: AlertsListProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {alerts.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      alert.status === "active"
                        ? "bg-emerald-500"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/app/forecasts/${alert.market}`}
                        className="font-semibold text-neutral-900 hover:underline dark:text-white"
                      >
                        {alert.market}
                      </Link>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {alert.horizon}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {alert.condition}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        {alert.channel}
                      </span>
                      <span>Last: {alert.lastTriggered}</span>
                      <span>Triggered {alert.triggerCount}x</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(alert.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      alert.status === "active"
                        ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        : "text-black"
                    }`}
                    style={
                      alert.status === "paused"
                        ? { backgroundColor: "var(--brand)" }
                        : {}
                    }
                  >
                    {alert.status === "active" ? "Pause" : "Resume"}
                  </button>
                  <button
                    onClick={() => onDelete(alert.id)}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
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
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              No alerts found
            </p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Create your first alert to get started
            </p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default AlertsList;
