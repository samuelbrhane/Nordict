"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { Market } from "@/config/alertsData";

interface AlertsHeaderProps {
  markets: Market[];
  filterMarket: string | null;
  onFilterMarketChange: (market: string | null) => void;
  filterStatus: "all" | "active" | "paused";
  onFilterStatusChange: (status: "all" | "active" | "paused") => void;
  onCreateClick: () => void;
}

const AlertsHeader = ({
  markets,
  filterMarket,
  onFilterMarketChange,
  filterStatus,
  onFilterStatusChange,
  onCreateClick,
}: AlertsHeaderProps) => {
  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Alerts
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Configure forecast-based notifications
              </p>
            </div>
            <button
              onClick={onCreateClick}
              className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create Alert
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterMarket || ""}
              onChange={(e) => onFilterMarketChange(e.target.value || null)}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <option value="">All markets</option>
              {markets.map((market) => (
                <option key={market.symbol} value={market.symbol}>
                  {market.symbol}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {(["all", "active", "paused"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onFilterStatusChange(status)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    filterStatus === status
                      ? "text-black shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  style={
                    filterStatus === status
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AlertsHeader;
