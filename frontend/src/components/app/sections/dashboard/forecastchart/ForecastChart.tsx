// components/app/sections/dashboard/forecastchart/ForecastChart.tsx

"use client";

import { useState, useMemo } from "react";
import AnimatedCard from "../AnimatedCard";
import MarketSelectorModal from "./MarketSelectorModal";
import ChartArea from "./ChartArea";
import {
  Horizon,
  markets,
  getHorizonConfig,
  generateForecastData,
  getSummaryData,
} from "./utils";

interface ForecastChartProps {
  horizon: Horizon;
}

const ForecastChart = ({ horizon }: ForecastChartProps) => {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = useMemo(
    () => generateForecastData(horizon, selectedMarket.symbol),
    [horizon, selectedMarket.symbol]
  );

  const summary = useMemo(
    () => getSummaryData(horizon, selectedMarket.symbol),
    [horizon, selectedMarket.symbol]
  );

  const config = getHorizonConfig(horizon);

  return (
    <>
      {/* Market Selector Modal */}
      <MarketSelectorModal
        markets={markets}
        selected={selectedMarket}
        onSelect={setSelectedMarket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AnimatedCard delay={350}>
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {/* Header - Above Chart */}
          <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {/* Left - Market selector button and title */}
            <div className="flex items-center gap-4">
              {/* Market Selector Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {selectedMarket.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedMarket.symbol}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedMarket.name}
                  </p>
                </div>
                <svg
                  className="ml-1 h-4 w-4 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </button>

              {/* Title */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Price Forecast
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Next {config.points} {config.label.toLowerCase()} with
                  confidence bands
                </p>
              </div>
            </div>

            {/* Right - Summary stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Direction */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    summary.direction === "Bullish"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : summary.direction === "Bearish"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-neutral-100 dark:bg-neutral-700"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 ${
                      summary.direction === "Bullish"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : summary.direction === "Bearish"
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
                </span>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Direction
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      summary.direction === "Bullish"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : summary.direction === "Bearish"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {summary.direction}
                  </p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

              {/* Range */}
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Range
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {summary.range}
                </p>
              </div>

              <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />
            </div>
          </div>

          {/* Chart Area - Full Width */}
          <div className="p-4 sm:p-6">
            <ChartArea data={data} horizon={horizon} />
          </div>
        </div>
      </AnimatedCard>
    </>
  );
};

export default ForecastChart;
