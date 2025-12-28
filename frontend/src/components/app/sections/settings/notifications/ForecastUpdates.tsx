"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import Toggle from "./Toggle";

interface ForecastUpdatesProps {
  daily: boolean;
  weekly: boolean;
  significant: boolean;
  onDailyChange: (v: boolean) => void;
  onWeeklyChange: (v: boolean) => void;
  onSignificantChange: (v: boolean) => void;
}

const ForecastUpdates = ({
  daily,
  weekly,
  significant,
  onDailyChange,
  onWeeklyChange,
  onSignificantChange,
}: ForecastUpdatesProps) => {
  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Forecast Updates
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Regular forecast summaries
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Daily Summary
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Overview each morning
              </p>
            </div>
            <Toggle enabled={daily} onChange={onDailyChange} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Weekly Report
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Performance every Monday
              </p>
            </div>
            <Toggle enabled={weekly} onChange={onWeeklyChange} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Significant Changes
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Direction or confidence spikes
              </p>
            </div>
            <Toggle enabled={significant} onChange={onSignificantChange} />
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ForecastUpdates;
