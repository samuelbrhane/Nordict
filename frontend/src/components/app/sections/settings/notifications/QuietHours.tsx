"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import Toggle from "./Toggle";

interface QuietHoursProps {
  enabled: boolean;
  start: string;
  end: string;
  onEnabledChange: (v: boolean) => void;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

const QuietHours = ({
  enabled,
  start,
  end,
  onEnabledChange,
  onStartChange,
  onEndChange,
}: QuietHoursProps) => {
  return (
    <AnimatedCard delay={250} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Quiet Hours
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Pause during set hours
            </p>
          </div>
          <Toggle enabled={enabled} onChange={onEnabledChange} />
        </div>

        {enabled && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Start
              </label>
              <select
                value={start}
                onChange={(e) => onStartChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
                <option value="22:00">10:00 PM</option>
                <option value="23:00">11:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                End
              </label>
              <select
                value={end}
                onChange={(e) => onEndChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="06:00">6:00 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default QuietHours;
