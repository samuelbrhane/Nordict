"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
];

// Mock live metrics
const LIVE_METRICS = {
  sinceDeployment: {
    mae: "2.41%",
    directionalAccuracy: "71.8%",
    calibration: "0.87",
    totalForecasts: 156,
    deployedDate: "Dec 1, 2024",
  },
  last30Days: {
    mae: "2.28%",
    directionalAccuracy: "73.2%",
    calibration: "0.89",
    totalForecasts: 42,
  },
  last7Days: {
    mae: "2.15%",
    directionalAccuracy: "75.0%",
    calibration: "0.91",
    totalForecasts: 10,
  },
};

// Mock recent forecast outcomes
const RECENT_OUTCOMES = [
  {
    id: 1,
    market: "BTC-USD",
    horizon: "7D",
    forecastDate: "Dec 21",
    predictedChange: "+3.2%",
    actualChange: "+2.9%",
    confidence: 72,
    status: "hit",
    withinRange: true,
  },
  {
    id: 2,
    market: "ETH-USD",
    horizon: "7D",
    forecastDate: "Dec 21",
    predictedChange: "+2.1%",
    actualChange: "+2.4%",
    confidence: 68,
    status: "hit",
    withinRange: true,
  },
  {
    id: 3,
    market: "BTC-USD",
    horizon: "1D",
    forecastDate: "Dec 27",
    predictedChange: "+0.8%",
    actualChange: "-0.3%",
    confidence: 58,
    status: "miss",
    withinRange: true,
  },
  {
    id: 4,
    market: "SOL-USD",
    horizon: "7D",
    forecastDate: "Dec 14",
    predictedChange: "-1.5%",
    actualChange: "-2.1%",
    confidence: 65,
    status: "hit",
    withinRange: true,
  },
  {
    id: 5,
    market: "ETH-USD",
    horizon: "1D",
    forecastDate: "Dec 26",
    predictedChange: "+1.2%",
    actualChange: "+0.9%",
    confidence: 62,
    status: "hit",
    withinRange: true,
  },
  {
    id: 6,
    market: "AVAX-USD",
    horizon: "7D",
    forecastDate: "Dec 14",
    predictedChange: "+4.5%",
    actualChange: "+1.2%",
    confidence: 54,
    status: "miss",
    withinRange: false,
  },
];

// Mock anomalies / degradations
const ANOMALIES = [
  {
    id: 1,
    type: "performance_drop",
    severity: "warning",
    message: "AVAX-USD 7D accuracy dropped 12% vs 30D average",
    date: "Dec 20, 2024",
    resolved: false,
  },
  {
    id: 2,
    type: "calibration_drift",
    severity: "info",
    message: "SOL-USD calibration slightly below target (0.82 vs 0.85)",
    date: "Dec 18, 2024",
    resolved: true,
  },
];

const PerformanceLivePage = () => {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  const filteredOutcomes = selectedMarket
    ? RECENT_OUTCOMES.filter((o) => o.market === selectedMarket)
    : RECENT_OUTCOMES;

  return (
    <AppLayout
      title="Live Tracking"
      subtitle="Real-time forecast performance monitoring"
    >
      <div className="space-y-6">
        {/* Live vs Backtest Warning Banner */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Live results are separate from backtesting
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                This page shows only real forecasts made after model deployment.
                These results may differ from historical backtests due to market
                regime changes and model behavior in production.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Since Deployment */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Since Deployment
              </p>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {LIVE_METRICS.sinceDeployment.deployedDate}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {LIVE_METRICS.sinceDeployment.directionalAccuracy}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Directional
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {LIVE_METRICS.sinceDeployment.mae}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  MAE
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {LIVE_METRICS.sinceDeployment.totalForecasts} forecasts evaluated
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Last 30 Days
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {LIVE_METRICS.last30Days.directionalAccuracy}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Directional
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {LIVE_METRICS.last30Days.mae}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  MAE
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {LIVE_METRICS.last30Days.totalForecasts} forecasts evaluated
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Last 7 Days
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  {LIVE_METRICS.last7Days.directionalAccuracy}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Directional
                </p>
              </div>
              <div>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  {LIVE_METRICS.last7Days.mae}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  MAE
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {LIVE_METRICS.last7Days.totalForecasts} forecasts evaluated
            </div>
          </div>
        </div>

        {/* Anomalies / Degradations */}
        {ANOMALIES.filter((a) => !a.resolved).length > 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Active Alerts
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Performance anomalies requiring attention
            </p>

            <div className="mt-4 space-y-3">
              {ANOMALIES.filter((a) => !a.resolved).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`flex items-start gap-3 rounded-xl p-4 ${
                    anomaly.severity === "warning"
                      ? "border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
                      : "border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
                  }`}
                >
                  <svg
                    className={`h-5 w-5 shrink-0 ${
                      anomaly.severity === "warning"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {anomaly.message}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Detected {anomaly.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Forecast Outcomes */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Recent Forecast Outcomes
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Completed forecasts with actual results
              </p>
            </div>

            {/* Market filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMarket(null)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  selectedMarket === null
                    ? "text-black"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
                style={
                  selectedMarket === null
                    ? { backgroundColor: "var(--brand)" }
                    : {}
                }
              >
                All
              </button>
              {MARKETS.map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => setSelectedMarket(market.symbol)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedMarket === market.symbol
                      ? "text-black"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                  style={
                    selectedMarket === market.symbol
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {market.symbol.split("-")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Market
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Horizon
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Predicted
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Actual
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Confidence
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredOutcomes.map((outcome) => (
                  <tr key={outcome.id}>
                    <td className="py-4">
                      <Link
                        href={`/app/forecasts/${outcome.market}`}
                        className="font-medium text-neutral-900 hover:underline dark:text-white"
                      >
                        {outcome.market}
                      </Link>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {outcome.forecastDate}
                      </p>
                    </td>
                    <td className="py-4 text-sm text-neutral-600 dark:text-neutral-300">
                      {outcome.horizon}
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-sm font-medium ${
                          outcome.predictedChange.startsWith("+")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {outcome.predictedChange}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-sm font-medium ${
                          outcome.actualChange.startsWith("+")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {outcome.actualChange}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${outcome.confidence}%`,
                              backgroundColor: "var(--brand)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {outcome.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            outcome.status === "hit"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {outcome.status === "hit" ? (
                            <svg
                              className="h-3 w-3"
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
                              className="h-3 w-3"
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
                          {outcome.status === "hit" ? "Hit" : "Miss"}
                        </span>
                        {!outcome.withinRange && (
                          <span className="text-xs text-neutral-400">
                            (out of range)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOutcomes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No forecast outcomes for selected market
              </p>
            </div>
          )}
        </div>

        {/* Compare with Backtest */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Live vs Backtest Comparison
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            How live performance compares to historical backtests
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                metric: "Directional Accuracy",
                live: "71.8%",
                backtest: "72.4%",
                diff: "-0.6%",
              },
              {
                metric: "MAE",
                live: "2.41%",
                backtest: "2.34%",
                diff: "+0.07%",
              },
              {
                metric: "Calibration",
                live: "0.87",
                backtest: "0.89",
                diff: "-0.02",
              },
            ].map((item) => (
              <div
                key={item.metric}
                className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {item.metric}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Live
                    </p>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {item.live}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Backtest
                    </p>
                    <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                      {item.backtest}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Diff
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        item.diff.startsWith("-") && item.metric !== "MAE"
                          ? "text-red-600 dark:text-red-400"
                          : item.diff.startsWith("+") && item.metric === "MAE"
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {item.diff}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/app/performance"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand)" }}
            >
              View full backtest results
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PerformanceLivePage;
