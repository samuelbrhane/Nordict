"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface HorizonForecast {
  horizon: string;
  direction: "up" | "down" | "neutral";
  change: string;
  confidence: number;
  range: string;
}

interface HorizonTableProps {
  forecasts: HorizonForecast[];
  currentHorizon?: string;
  onHorizonChange?: (horizon: string) => void;
}

const HorizonTable = ({
  forecasts,
  currentHorizon,
  onHorizonChange,
}: HorizonTableProps) => {
  return (
    <AnimatedCard delay={300}>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Multi-Horizon Forecast
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Compare predictions across all time horizons
          </p>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="space-y-3 p-4 sm:hidden">
          {forecasts.map((forecast) => (
            <div
              key={forecast.horizon}
              onClick={() => onHorizonChange?.(forecast.horizon)}
              className={`rounded-xl border p-4 transition-all ${
                onHorizonChange ? "cursor-pointer" : ""
              } ${
                currentHorizon === forecast.horizon
                  ? "border-[var(--brand)] bg-[rgba(4,236,58,0.05)]"
                  : "border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-semibold ${
                    currentHorizon === forecast.horizon
                      ? "text-[var(--brand)]"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {forecast.horizon}
                </span>
                <div
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                    forecast.direction === "up"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : forecast.direction === "down"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-neutral-100 dark:bg-neutral-700"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 ${
                      forecast.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : forecast.direction === "down"
                        ? "rotate-180 text-red-600 dark:text-red-400"
                        : "rotate-90 text-neutral-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Change
                  </p>
                  <p
                    className={`font-semibold ${
                      forecast.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : forecast.direction === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {forecast.change}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Confidence
                  </p>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {forecast.confidence}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Range
                  </p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {forecast.range}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${forecast.confidence}%`,
                      backgroundColor: "var(--brand)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Horizon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Direction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {forecasts.map((forecast) => (
                <tr
                  key={forecast.horizon}
                  onClick={() => onHorizonChange?.(forecast.horizon)}
                  className={`transition-colors ${
                    onHorizonChange
                      ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      : ""
                  } ${
                    currentHorizon === forecast.horizon
                      ? "bg-[rgba(4,236,58,0.05)]"
                      : ""
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`font-medium ${
                        currentHorizon === forecast.horizon
                          ? "text-[var(--brand)]"
                          : "text-neutral-900 dark:text-white"
                      }`}
                    >
                      {forecast.horizon}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
                        forecast.direction === "up"
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : forecast.direction === "down"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-neutral-100 dark:bg-neutral-700"
                      }`}
                    >
                      <svg
                        className={`h-4 w-4 ${
                          forecast.direction === "up"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : forecast.direction === "down"
                            ? "rotate-180 text-red-600 dark:text-red-400"
                            : "rotate-90 text-neutral-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`font-semibold ${
                        forecast.direction === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : forecast.direction === "down"
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {forecast.change}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${forecast.confidence}%`,
                            backgroundColor: "var(--brand)",
                          }}
                        />
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {forecast.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {forecast.range}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default HorizonTable;
