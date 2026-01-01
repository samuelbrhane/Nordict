"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";
import MarketSelectorModal from "../dashboard/forecastchart/MarketSelectorModal";

interface AlertsHeaderProps {
  filterMarket: { symbol: string; name: string } | null;
  onFilterMarketChange: (
    market: { symbol: string; name: string } | null
  ) => void;
  filterStatus: "all" | "active" | "paused";
  onFilterStatusChange: (status: "all" | "active" | "paused") => void;
  onCreateClick: () => void;
  alertCount: number;
}

const AlertsHeader = ({
  filterMarket,
  onFilterMarketChange,
  filterStatus,
  onFilterStatusChange,
  onCreateClick,
  alertCount,
}: AlertsHeaderProps) => {
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);

  return (
    <>
      <MarketSelectorModal
        selected={filterMarket || { symbol: "", name: "" }}
        onSelect={(market) => {
          onFilterMarketChange(market);
          setIsMarketModalOpen(false);
        }}
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
      />

      <AnimatedCard delay={0}>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Alerts
                </h1>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {alertCount} alert{alertCount !== 1 ? "s" : ""} configured
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

            <div className="flex flex-wrap items-center gap-3">
              {/* Market Filter */}
              <button
                onClick={() => setIsMarketModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                {filterMarket ? (
                  <>
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      {filterMarket.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {filterMarket.symbol}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFilterMarketChange(null);
                      }}
                      className="ml-1 rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    >
                      <svg
                        className="h-3 w-3 text-neutral-500"
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
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      All Markets
                    </span>
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Status Filter */}
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
    </>
  );
};

export default AlertsHeader;
