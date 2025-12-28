"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface HistoricalRecord {
  date: string;
  predicted: string;
  actual: string;
  accuracy: "hit" | "miss";
  confidence: number;
}

interface HistoricalAccuracyProps {
  records: HistoricalRecord[];
  overallAccuracy: number;
}

const HistoricalAccuracy = ({
  records,
  overallAccuracy,
}: HistoricalAccuracyProps) => {
  return (
    <AnimatedCard delay={400}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Historical Accuracy
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Past forecasts vs actual outcomes
        </p>
        <div className="mt-4 space-y-2">
          {records.map((record, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    record.accuracy === "hit"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {record.accuracy === "hit" ? (
                    <svg
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-red-600 dark:text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {record.date}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {record.confidence}% conf
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-neutral-600 dark:text-neutral-300">
                  <span className="text-neutral-400">P:</span>{" "}
                  {record.predicted}
                </p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  <span className="text-neutral-400">A:</span> {record.actual}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex items-center justify-between rounded-xl p-3"
          style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
        >
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            Directional accuracy (30D)
          </span>
          <span className="font-semibold" style={{ color: "var(--brand)" }}>
            {overallAccuracy}%
          </span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default HistoricalAccuracy;
