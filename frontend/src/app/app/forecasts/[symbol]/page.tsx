"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

// Mock market data
const MARKETS: Record<
  string,
  {
    name: string;
    category: string;
    currentPrice: string;
    change24h: string;
    changeDirection: "up" | "down";
  }
> = {
  "BTC-USD": {
    name: "Bitcoin",
    category: "Crypto",
    currentPrice: "$95,420",
    change24h: "+2.4%",
    changeDirection: "up",
  },
  "ETH-USD": {
    name: "Ethereum",
    category: "Crypto",
    currentPrice: "$3,450",
    change24h: "+1.8%",
    changeDirection: "up",
  },
  "SOL-USD": {
    name: "Solana",
    category: "Crypto",
    currentPrice: "$142.30",
    change24h: "-0.6%",
    changeDirection: "down",
  },
  "AVAX-USD": {
    name: "Avalanche",
    category: "Crypto",
    currentPrice: "$38.50",
    change24h: "+3.1%",
    changeDirection: "up",
  },
  "MATIC-USD": {
    name: "Polygon",
    category: "Crypto",
    currentPrice: "$0.89",
    change24h: "+0.4%",
    changeDirection: "up",
  },
  "LINK-USD": {
    name: "Chainlink",
    category: "Crypto",
    currentPrice: "$14.20",
    change24h: "-1.2%",
    changeDirection: "down",
  },
};

// Mock forecast data for all horizons
const HORIZON_FORECASTS = [
  {
    horizon: "1D",
    direction: "up",
    change: "+1.2%",
    confidence: 68,
    range: "$94,200 – $97,800",
  },
  {
    horizon: "7D",
    direction: "up",
    change: "+4.2%",
    confidence: 78,
    range: "$93,500 – $102,400",
  },
  {
    horizon: "30D",
    direction: "up",
    change: "+8.5%",
    confidence: 65,
    range: "$89,000 – $115,000",
  },
  {
    horizon: "90D",
    direction: "up",
    change: "+15.2%",
    confidence: 52,
    range: "$82,000 – $135,000",
  },
];

// Mock historical forecasts
const HISTORICAL_FORECASTS = [
  {
    date: "Dec 20",
    predicted: "+3.2%",
    actual: "+2.8%",
    accuracy: "hit",
    confidence: 72,
  },
  {
    date: "Dec 13",
    predicted: "+1.5%",
    actual: "+1.9%",
    accuracy: "hit",
    confidence: 68,
  },
  {
    date: "Dec 6",
    predicted: "-2.1%",
    actual: "-1.4%",
    accuracy: "hit",
    confidence: 65,
  },
  {
    date: "Nov 29",
    predicted: "+4.0%",
    actual: "+5.2%",
    accuracy: "hit",
    confidence: 71,
  },
  {
    date: "Nov 22",
    predicted: "+2.5%",
    actual: "-0.8%",
    accuracy: "miss",
    confidence: 58,
  },
];

// Mock related alerts
const RELATED_ALERTS = [
  {
    id: 1,
    condition: "Confidence > 75%",
    horizon: "7D",
    status: "active",
    lastTriggered: "2 days ago",
  },
  {
    id: 2,
    condition: "Price exits range",
    horizon: "1D",
    status: "active",
    lastTriggered: "Never",
  },
];

const MarketDetailPage = ({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) => {
  const { symbol } = use(params);
  const [confidenceView, setConfidenceView] = useState<"chart" | "table">(
    "table"
  );

  const market = MARKETS[symbol] || {
    name: symbol,
    category: "Unknown",
    currentPrice: "N/A",
    change24h: "N/A",
    changeDirection: "up" as const,
  };

  return (
    <AppLayout
      title={`${symbol}`}
      subtitle={`${market.name} · ${market.category}`}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/app/forecasts"
            className="text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Forecasts
          </Link>
          <svg
            className="h-4 w-4 text-neutral-300 dark:text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium text-neutral-900 dark:text-white">
            {symbol}
          </span>
        </div>

        {/* Market header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {symbol.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {market.currentPrice}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-sm font-medium ${
                    market.changeDirection === "up"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {market.change24h}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Last updated 12 min ago
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/app/alerts"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
            >
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
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              Create Alert
            </Link>
            <Link
              href={`/app/forecasts/compare?markets=${symbol}`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
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
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              Compare
            </Link>
          </div>
        </div>

        {/* Multi-horizon comparison */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Multi-Horizon Forecast
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Compare predictions across all time horizons
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Horizon
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Direction
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Predicted Change
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Confidence
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {HORIZON_FORECASTS.map((forecast) => (
                  <tr key={forecast.horizon}>
                    <td className="py-4">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {forecast.horizon}
                      </span>
                    </td>
                    <td className="py-4">
                      <div
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
                          forecast.direction === "up"
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        <svg
                          className={`h-4 w-4 ${
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
                    </td>
                    <td className="py-4">
                      <span
                        className={`font-semibold ${
                          forecast.direction === "up"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {forecast.change}
                      </span>
                    </td>
                    <td className="py-4">
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
                    <td className="py-4">
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Historical forecast track */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Historical Accuracy
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Past 7D forecasts vs actual outcomes
            </p>

            <div className="mt-6 space-y-3">
              {HISTORICAL_FORECASTS.map((record, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
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
                        {record.confidence}% confidence
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="text-neutral-400">Pred:</span>{" "}
                      {record.predicted}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="text-neutral-400">Actual:</span>{" "}
                      {record.actual}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[rgba(4,236,58,0.1)] p-3">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">
                Directional accuracy (30D)
              </span>
              <span className="font-semibold" style={{ color: "var(--brand)" }}>
                80%
              </span>
            </div>
          </div>

          {/* Confidence behavior + Related alerts */}
          <div className="space-y-6">
            {/* Confidence trend */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Confidence Trend
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Model certainty over recent forecasts
              </p>

              {/* Placeholder chart */}
              <div className="mt-4 flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
                <p className="text-xs text-neutral-400">
                  Confidence chart coming soon
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    72%
                  </p>
                  <p className="text-xs text-neutral-500">Current</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    68%
                  </p>
                  <p className="text-xs text-neutral-500">30D Avg</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    +4%
                  </p>
                  <p className="text-xs text-neutral-500">vs Avg</p>
                </div>
              </div>
            </div>

            {/* Related alerts */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Related Alerts
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Alerts for this market
                  </p>
                </div>
                <Link
                  href="/app/alerts"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--brand)" }}
                >
                  View all
                </Link>
              </div>

              {RELATED_ALERTS.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {RELATED_ALERTS.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {alert.condition}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {alert.horizon} · Last: {alert.lastTriggered}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          alert.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border-2 border-dashed border-neutral-200 p-6 text-center dark:border-neutral-700">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No alerts set for this market
                  </p>
                  <Link
                    href="/app/alerts"
                    className="mt-2 inline-block text-sm font-medium"
                    style={{ color: "var(--brand)" }}
                  >
                    Create one →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketDetailPage;
