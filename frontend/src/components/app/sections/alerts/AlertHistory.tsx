"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { AlertHistoryItem } from "@/config/alertsData";

interface AlertHistoryProps {
  history: AlertHistoryItem[];
}

const AlertHistory = ({ history }: AlertHistoryProps) => {
  return (
    <AnimatedCard delay={100} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Recent Triggers
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          When alerts were triggered
        </p>

        <div className="mt-4 space-y-2">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {item.market}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.condition}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {item.value}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.triggeredAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AlertHistory;
