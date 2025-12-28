"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin", category: "Crypto" },
  { symbol: "ETH-USD", name: "Ethereum", category: "Crypto" },
  { symbol: "SOL-USD", name: "Solana", category: "Crypto" },
  { symbol: "AVAX-USD", name: "Avalanche", category: "Crypto" },
  { symbol: "MATIC-USD", name: "Polygon", category: "Crypto" },
  { symbol: "LINK-USD", name: "Chainlink", category: "Crypto" },
];

const HORIZONS = [
  { id: "1D", label: "1 Day" },
  { id: "7D", label: "7 Days" },
  { id: "30D", label: "30 Days" },
  { id: "90D", label: "90 Days" },
];

// Mock forecast data
const FORECAST_DATA: Record<
  string,
  Record<
    string,
    {
      direction: "up" | "down";
      predictedChange: string;
      confidence: number;
      probabilityUp: number;
      probabilityDown: number;
      rangeMin: string;
      rangeMax: string;
      currentPrice: string;
      lastUpdated: string;
    }
  >
> = {
  "BTC-USD": {
    "1D": {
      direction: "up",
      predictedChange: "+1.2%",
      confidence: 68,
      probabilityUp: 62,
      probabilityDown: 38,
      rangeMin: "$94,200",
      rangeMax: "$97,800",
      currentPrice: "$95,420",
      lastUpdated: "12 min ago",
    },
    "7D": {
      direction: "up",
      predictedChange: "+4.2%",
      confidence: 78,
      probabilityUp: 71,
      probabilityDown: 29,
      rangeMin: "$93,500",
      rangeMax: "$102,400",
      currentPrice: "$95,420",
      lastUpdated: "12 min ago",
    },
    "30D": {
      direction: "up",
      predictedChange: "+8.5%",
      confidence: 65,
      probabilityUp: 68,
      probabilityDown: 32,
      rangeMin: "$89,000",
      rangeMax: "$115,000",
      currentPrice: "$95,420",
      lastUpdated: "12 min ago",
    },
    "90D": {
      direction: "up",
      predictedChange: "+15.2%",
      confidence: 52,
      probabilityUp: 61,
      probabilityDown: 39,
      rangeMin: "$82,000",
      rangeMax: "$135,000",
      currentPrice: "$95,420",
      lastUpdated: "12 min ago",
    },
  },
  "ETH-USD": {
    "1D": {
      direction: "up",
      predictedChange: "+0.8%",
      confidence: 62,
      probabilityUp: 58,
      probabilityDown: 42,
      rangeMin: "$3,380",
      rangeMax: "$3,520",
      currentPrice: "$3,450",
      lastUpdated: "12 min ago",
    },
    "7D": {
      direction: "up",
      predictedChange: "+3.1%",
      confidence: 72,
      probabilityUp: 66,
      probabilityDown: 34,
      rangeMin: "$3,300",
      rangeMax: "$3,680",
      currentPrice: "$3,450",
      lastUpdated: "12 min ago",
    },
    "30D": {
      direction: "up",
      predictedChange: "+6.8%",
      confidence: 58,
      probabilityUp: 62,
      probabilityDown: 38,
      rangeMin: "$3,100",
      rangeMax: "$4,000",
      currentPrice: "$3,450",
      lastUpdated: "12 min ago",
    },
    "90D": {
      direction: "up",
      predictedChange: "+12.4%",
      confidence: 48,
      probabilityUp: 57,
      probabilityDown: 43,
      rangeMin: "$2,800",
      rangeMax: "$4,500",
      currentPrice: "$3,450",
      lastUpdated: "12 min ago",
    },
  },
};

// Default fallback for markets without data
const DEFAULT_FORECAST = {
  direction: "up" as const,
  predictedChange: "+2.5%",
  confidence: 60,
  probabilityUp: 58,
  probabilityDown: 42,
  rangeMin: "$0",
  rangeMax: "$0",
  currentPrice: "$0",
  lastUpdated: "12 min ago",
};

const ForecastsPage = () => {
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [selectedHorizon, setSelectedHorizon] = useState(HORIZONS[1]); // Default 7D
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);

  const forecast =
    FORECAST_DATA[selectedMarket.symbol]?.[selectedHorizon.id] ||
    DEFAULT_FORECAST;

  return (
    <AppLayout
      title="Forecasts"
      subtitle="Multi-horizon probabilistic predictions"
    >
      <div className="space-y-6">
        {/* Market selector + Horizon tabs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Market selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {selectedMarket.symbol.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {selectedMarket.symbol}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedMarket.name}
                  </p>
                </div>
                <svg
                  className={`ml-2 h-5 w-5 text-neutral-400 transition-transform ${
                    isMarketDropdownOpen ? "rotate-180" : ""
                  }`}
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
              </button>

              {/* Dropdown */}
              {isMarketDropdownOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {MARKETS.map((market) => (
                      <button
                        key={market.symbol}
                        onClick={() => {
                          setSelectedMarket(market);
                          setIsMarketDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          selectedMarket.symbol === market.symbol
                            ? "bg-[rgba(4,236,58,0.1)]"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                            selectedMarket.symbol === market.symbol
                              ? "text-black"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                          }`}
                          style={
                            selectedMarket.symbol === market.symbol
                              ? { backgroundColor: "var(--brand)" }
                              : {}
                          }
                        >
                          {market.symbol.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              selectedMarket.symbol === market.symbol
                                ? "text-neutral-900 dark:text-white"
                                : "text-neutral-700 dark:text-neutral-200"
                            }`}
                          >
                            {market.symbol}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {market.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Details link */}
            <Link
              href={`/app/forecasts/${selectedMarket.symbol}`}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm font-medium text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
            >
              <span>View Details</span>
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </Link>
          </div>

          {/* Horizon tabs */}
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {HORIZONS.map((horizon) => (
              <button
                key={horizon.id}
                onClick={() => setSelectedHorizon(horizon)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedHorizon.id === horizon.id
                    ? "text-black shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                style={
                  selectedHorizon.id === horizon.id
                    ? { backgroundColor: "var(--brand)" }
                    : {}
                }
              >
                {horizon.id}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Direction */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Direction
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  forecast.direction === "up"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    forecast.direction === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "rotate-180 text-red-600 dark:text-red-400"
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
              <span
                className={`text-2xl font-semibold ${
                  forecast.direction === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {forecast.predictedChange}
              </span>
            </div>
          </div>

          {/* Confidence */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Confidence
            </p>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {forecast.confidence}%
              </span>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${forecast.confidence}%`,
                    backgroundColor: "var(--brand)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Probability */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Probability
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-emerald-500"
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
                <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {forecast.probabilityUp}%
                </span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 rotate-180 text-red-500"
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
                <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {forecast.probabilityDown}%
                </span>
              </div>
            </div>
          </div>

          {/* Predicted Range */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Predicted Range
            </p>
            <div className="mt-2">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {forecast.rangeMin} – {forecast.rangeMax}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Current: {forecast.currentPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Forecast Chart
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Price vs predicted band · {selectedHorizon.label} horizon
              </p>
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Updated {forecast.lastUpdated}
            </p>
          </div>

          {/* Chart placeholder */}
          <div className="mt-6 flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <div className="text-center">
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
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Interactive chart coming soon
              </p>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Will show price, predicted range, and confidence bands
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Drivers / Features */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Key Drivers
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Top factors influencing this forecast
            </p>

            <div className="mt-6 space-y-3">
              {[
                { factor: "Momentum (7D)", impact: "positive", weight: 85 },
                { factor: "Volume Trend", impact: "positive", weight: 72 },
                { factor: "Market Sentiment", impact: "positive", weight: 68 },
                { factor: "Volatility Index", impact: "neutral", weight: 45 },
                { factor: "Correlation (SPX)", impact: "negative", weight: 32 },
              ].map((driver) => (
                <div
                  key={driver.factor}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        driver.impact === "positive"
                          ? "bg-emerald-500"
                          : driver.impact === "negative"
                          ? "bg-red-500"
                          : "bg-neutral-400"
                      }`}
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {driver.factor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className={`h-full rounded-full ${
                          driver.impact === "positive"
                            ? "bg-emerald-500"
                            : driver.impact === "negative"
                            ? "bg-red-500"
                            : "bg-neutral-400"
                        }`}
                        style={{ width: `${driver.weight}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-neutral-500 dark:text-neutral-400">
                      {driver.weight}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation notes */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              How to Interpret
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Understanding uncertainty in forecasts
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Confidence Score
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      Reflects model certainty. Higher confidence means the
                      model has seen similar patterns before with consistent
                      outcomes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Predicted Range
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      The 80% prediction interval. There's roughly an 80% chance
                      the actual price will fall within this range.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Forecasts are probabilistic and should inform, not replace, your
                own analysis and risk management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ForecastsPage;
