"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import Toggle from "./ToggleRow";

interface DigestSettingsProps {
  enabled: boolean;
  frequency: string;
  time: string;
  onEnabledChange: (v: boolean) => void;
  onFrequencyChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}

const DigestSettings = ({
  enabled,
  frequency,
  time,
  onEnabledChange,
  onFrequencyChange,
  onTimeChange,
}: DigestSettingsProps) => {
  return (
    <AnimatedCard delay={200} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Email Digest
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Combine notifications
            </p>
          </div>
          <Toggle enabled={enabled} onChange={onEnabledChange} />
        </div>

        {enabled && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => onFrequencyChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {frequency !== "realtime" && (
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Delivery Time
                </label>
                <select
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="06:00">6:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default DigestSettings;
