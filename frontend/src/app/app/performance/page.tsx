"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";

const MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
];

const MODEL_VERSIONS = [
  { id: "v0.3", label: "v0.3 (Current)", date: "Dec 2024" },
  { id: "v0.2", label: "v0.2", date: "Oct 2024" },
  { id: "v0.1", label: "v0.1", date: "Aug 2024" },
];

const TIME_WINDOWS = [
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "180d", label: "180 Days" },
  { id: "1y", label: "1 Year" },
  { id: "all", label: "All Time" },
];

// Mock metrics data
const METRICS_DATA = {
  mae: { value: "2.34%", change: "-0.12%", trend: "down" },
  rmse: { value: "3.21%", change: "-0.08%", trend: "down" },
  mape: { value: "4.56%", change: "-0.15%", trend: "down" },
  directionalAccuracy: { value: "72.4%", change: "+1.2%", trend: "up" },
  calibrationScore: { value: "0.89", change: "+0.02", trend: "up" },
  sharpeRatio: { value: "1.45", change: "+0.08", trend: "up" },
};

// Mock backtest runs
const BACKTEST_RUNS = [
  {
    date: "Dec 20, 2024",
    window: "30D",
    version: "v0.3",
    mae: "2.12%",
    directional: "74.2%",
    calibration: "0.91",
  },
  {
    date: "Dec 13, 2024",
    window: "30D",
    version: "v0.3",
    mae: "2.45%",
    directional: "71.8%",
    calibration: "0.88",
  },
  {
    date: "Dec 6, 2024",
    window: "30D",
    version: "v0.3",
    mae: "2.38%",
    directional: "72.1%",
    calibration: "0.89",
  },
  {
    date: "Nov 29, 2024",
    window: "30D",
    version: "v0.3",
    mae: "2.51%",
    directional: "70.5%",
    calibration: "0.87",
  },
  {
    date: "Nov 22, 2024",
    window: "30D",
    version: "v0.2",
    mae: "2.68%",
    directional: "69.2%",
    calibration: "0.85",
  },
];

// Mock regime data
const REGIME_BREAKDOWN = [
  {
    regime: "Bull Market",
    periods: 45,
    mae: "1.98%",
    directional: "78.2%",
    status: "strong",
  },
  {
    regime: "Bear Market",
    periods: 28,
    mae: "2.89%",
    directional: "68.4%",
    status: "moderate",
  },
  {
    regime: "High Volatility",
    periods: 32,
    mae: "3.45%",
    directional: "65.1%",
    status: "weak",
  },
  {
    regime: "Low Volatility",
    periods: 51,
    mae: "1.76%",
    directional: "76.8%",
    status: "strong",
  },
];

const PerformanceBacktestingPage = () => {
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [selectedVersion, setSelectedVersion] = useState(MODEL_VERSIONS[0]);
  const [selectedWindow, setSelectedWindow] = useState(TIME_WINDOWS[2]);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  return (
    <AppLayout title="Backtesting" subtitle="Walk-forward validation results">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Market selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsMarketDropdownOpen(!isMarketDropdownOpen);
                setIsVersionDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="font-medium text-neutral-900 dark:text-white">
                {selectedMarket.symbol}
              </span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
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

            {isMarketDropdownOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="p-2">
                  {MARKETS.map((market) => (
                    <button
                      key={market.symbol}
                      onClick={() => {
                        setSelectedMarket(market);
                        setIsMarketDropdownOpen(false);
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedMarket.symbol === market.symbol
                          ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {market.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Version selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsVersionDropdownOpen(!isVersionDropdownOpen);
                setIsMarketDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="font-medium text-neutral-900 dark:text-white">
                {selectedVersion.label}
              </span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  isVersionDropdownOpen ? "rotate-180" : ""
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

            {isVersionDropdownOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="p-2">
                  {MODEL_VERSIONS.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => {
                        setSelectedVersion(version);
                        setIsVersionDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedVersion.id === version.id
                          ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      }`}
                    >
                      <span>{version.label}</span>
                      <span className="text-xs text-neutral-400">
                        {version.date}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time window tabs */}
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {TIME_WINDOWS.map((window) => (
              <button
                key={window.id}
                onClick={() => setSelectedWindow(window)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedWindow.id === window.id
                    ? "text-black shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                style={
                  selectedWindow.id === window.id
                    ? { backgroundColor: "var(--brand)" }
                    : {}
                }
              >
                {window.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            {
              label: "MAE",
              ...METRICS_DATA.mae,
              tooltip: "Mean Absolute Error",
            },
            {
              label: "RMSE",
              ...METRICS_DATA.rmse,
              tooltip: "Root Mean Square Error",
            },
            {
              label: "MAPE",
              ...METRICS_DATA.mape,
              tooltip: "Mean Absolute Percentage Error",
            },
            {
              label: "Directional",
              ...METRICS_DATA.directionalAccuracy,
              tooltip: "Directional Accuracy",
            },
            {
              label: "Calibration",
              ...METRICS_DATA.calibrationScore,
              tooltip: "Calibration Score",
            },
            {
              label: "Sharpe",
              ...METRICS_DATA.sharpeRatio,
              tooltip: "Sharpe Ratio",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {metric.label}
                </p>
                <div className="group relative">
                  <svg
                    className="h-3.5 w-3.5 cursor-help text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-neutral-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-neutral-700">
                    {metric.tooltip}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {metric.value}
                </p>
                <span
                  className={`text-xs font-medium ${
                    metric.trend === "up"
                      ? metric.label === "Directional" ||
                        metric.label === "Calibration" ||
                        metric.label === "Sharpe"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                      : metric.label === "Directional" ||
                        metric.label === "Calibration" ||
                        metric.label === "Sharpe"
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Walk-Forward Validation Explanation */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Walk-Forward Validation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                All metrics are computed using strict walk-forward validation:
                the model is trained only on past data and tested on future data
                it has never seen. This prevents look-ahead bias and ensures
                metrics reflect real-world performance. Each backtest run uses a
                rolling window approach where the model is retrained
                periodically with the latest available data.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Over Time Chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Performance Over Time
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Metric trends across evaluation periods
          </p>

          {/* Chart placeholder */}
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Performance chart coming soon
              </p>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Will show MAE, directional accuracy, and calibration over time
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Regime Breakdown */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Performance by Regime
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              How the model performs in different market conditions
            </p>

            <div className="mt-6 space-y-3">
              {REGIME_BREAKDOWN.map((regime) => (
                <div
                  key={regime.regime}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        regime.status === "strong"
                          ? "bg-emerald-500"
                          : regime.status === "moderate"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {regime.regime}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {regime.periods} periods
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {regime.directional} dir.
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {regime.mae} MAE
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Backtest Runs */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Backtest Runs
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Individual evaluation runs
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Date
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      MAE
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Dir.
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Cal.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {BACKTEST_RUNS.map((run, i) => (
                    <tr key={i}>
                      <td className="py-3">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {run.date}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {run.version}
                        </p>
                      </td>
                      <td className="py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {run.mae}
                      </td>
                      <td className="py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {run.directional}
                      </td>
                      <td className="py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {run.calibration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Transparency note */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium text-neutral-900 dark:text-white">
                Transparency commitment:
              </span>{" "}
              All performance metrics shown here are computed using the same
              methodology, with no cherry-picking of favorable periods.
              Historical data is immutable once recorded.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PerformanceBacktestingPage;
