"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" },
  { id: "commodities", label: "Commodities" },
];

// Mock markets data
const MARKETS_DATA = [
  {
    symbol: "BTC-USD",
    name: "Bitcoin",
    category: "crypto",
    currentPrice: "$95,420",
    change24h: "+2.4%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D", "30D", "90D"],
    dataHealth: "healthy" as const,
    lastUpdate: "2 min ago",
    modelVersion: "v0.3",
    hasAlerts: true,
  },
  {
    symbol: "ETH-USD",
    name: "Ethereum",
    category: "crypto",
    currentPrice: "$3,450",
    change24h: "+1.8%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D", "30D", "90D"],
    dataHealth: "healthy" as const,
    lastUpdate: "2 min ago",
    modelVersion: "v0.3",
    hasAlerts: true,
  },
  {
    symbol: "SOL-USD",
    name: "Solana",
    category: "crypto",
    currentPrice: "$142.30",
    change24h: "-0.6%",
    changeDirection: "down" as const,
    coverage: ["1D", "7D", "30D"],
    dataHealth: "healthy" as const,
    lastUpdate: "2 min ago",
    modelVersion: "v0.3",
    hasAlerts: false,
  },
  {
    symbol: "AVAX-USD",
    name: "Avalanche",
    category: "crypto",
    currentPrice: "$38.50",
    change24h: "+3.1%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D", "30D"],
    dataHealth: "degraded" as const,
    lastUpdate: "15 min ago",
    modelVersion: "v0.3",
    hasAlerts: false,
  },
  {
    symbol: "MATIC-USD",
    name: "Polygon",
    category: "crypto",
    currentPrice: "$0.89",
    change24h: "+0.4%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D"],
    dataHealth: "healthy" as const,
    lastUpdate: "2 min ago",
    modelVersion: "v0.2",
    hasAlerts: false,
  },
  {
    symbol: "LINK-USD",
    name: "Chainlink",
    category: "crypto",
    currentPrice: "$14.20",
    change24h: "-1.2%",
    changeDirection: "down" as const,
    coverage: ["1D", "7D"],
    dataHealth: "healthy" as const,
    lastUpdate: "2 min ago",
    modelVersion: "v0.2",
    hasAlerts: false,
  },
  {
    symbol: "EUR-USD",
    name: "Euro / US Dollar",
    category: "forex",
    currentPrice: "$1.0892",
    change24h: "+0.12%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D"],
    dataHealth: "healthy" as const,
    lastUpdate: "5 min ago",
    modelVersion: "v0.1",
    hasAlerts: false,
  },
  {
    symbol: "GBP-USD",
    name: "British Pound / US Dollar",
    category: "forex",
    currentPrice: "$1.2534",
    change24h: "-0.08%",
    changeDirection: "down" as const,
    coverage: ["1D", "7D"],
    dataHealth: "healthy" as const,
    lastUpdate: "5 min ago",
    modelVersion: "v0.1",
    hasAlerts: false,
  },
  {
    symbol: "GOLD-USD",
    name: "Gold",
    category: "commodities",
    currentPrice: "$2,065.40",
    change24h: "+0.35%",
    changeDirection: "up" as const,
    coverage: ["1D", "7D"],
    dataHealth: "healthy" as const,
    lastUpdate: "10 min ago",
    modelVersion: "v0.1",
    hasAlerts: false,
  },
  {
    symbol: "OIL-USD",
    name: "Crude Oil (WTI)",
    category: "commodities",
    currentPrice: "$71.82",
    change24h: "-1.45%",
    changeDirection: "down" as const,
    coverage: ["1D"],
    dataHealth: "degraded" as const,
    lastUpdate: "30 min ago",
    modelVersion: "v0.1",
    hasAlerts: false,
  },
];

const MarketsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredMarkets = MARKETS_DATA.filter((market) => {
    if (selectedCategory !== "all" && market.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !market.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const healthyCount = MARKETS_DATA.filter(
    (m) => m.dataHealth === "healthy"
  ).length;
  const degradedCount = MARKETS_DATA.filter(
    (m) => m.dataHealth === "degraded"
  ).length;

  return (
    <AppLayout title="Markets" subtitle="Available markets and data coverage">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Total Markets
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
              {MARKETS_DATA.length}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Healthy
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {healthyCount}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Degraded
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {degradedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Full Coverage (90D)
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
              {MARKETS_DATA.filter((m) => m.coverage.includes("90D")).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
              />
            </div>

            {/* Category tabs */}
            <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "text-black"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  style={
                    selectedCategory === cat.id
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-all ${
                viewMode === "grid"
                  ? "text-black"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              }`}
              style={
                viewMode === "grid" ? { backgroundColor: "var(--brand)" } : {}
              }
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-2 transition-all ${
                viewMode === "table"
                  ? "text-black"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              }`}
              style={
                viewMode === "table" ? { backgroundColor: "var(--brand)" } : {}
              }
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Markets Grid View */}
        {viewMode === "grid" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((market) => (
              <Link
                key={market.symbol}
                href={`/app/forecasts/${market.symbol}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      {market.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {market.symbol}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {market.name}
                      </p>
                    </div>
                  </div>

                  {/* Health indicator */}
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      market.dataHealth === "healthy"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                    title={
                      market.dataHealth === "healthy" ? "Healthy" : "Degraded"
                    }
                  />
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {market.currentPrice}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      market.changeDirection === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {market.change24h}
                  </span>
                </div>

                {/* Coverage */}
                <div className="mt-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Horizons
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    {["1D", "7D", "30D", "90D"].map((h) => (
                      <span
                        key={h}
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          market.coverage.includes(h)
                            ? "bg-[rgba(4,236,58,0.15)] text-[var(--brand)]"
                            : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600"
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{market.modelVersion}</span>
                    <span>·</span>
                    <span>{market.lastUpdate}</span>
                  </div>
                  {market.hasAlerts && (
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <svg
                        className="h-3.5 w-3.5"
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
                      Alerts
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Markets Table View */}
        {viewMode === "table" && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Market
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Price
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      24h
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Coverage
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Health
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Model
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Updated
                    </th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredMarkets.map((market) => (
                    <tr
                      key={market.symbol}
                      className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black"
                            style={{ backgroundColor: "var(--brand)" }}
                          >
                            {market.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {market.symbol}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {market.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {market.currentPrice}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-medium ${
                            market.changeDirection === "up"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {market.change24h}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          {market.coverage.map((h) => (
                            <span
                              key={h}
                              className="rounded bg-[rgba(4,236,58,0.15)] px-1.5 py-0.5 text-xs font-medium text-[var(--brand)]"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                            market.dataHealth === "healthy"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              market.dataHealth === "healthy"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {market.dataHealth === "healthy"
                            ? "Healthy"
                            : "Degraded"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {market.modelVersion}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {market.lastUpdate}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/app/forecasts/${market.symbol}`}
                          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredMarkets.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              No markets found
            </p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Data Sources Info */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Data Sources
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Where our market data comes from
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Crypto",
                sources: ["Binance", "Coinbase", "Kraken"],
                updateFreq: "Every 1 min",
                status: "operational",
              },
              {
                name: "Forex",
                sources: ["OANDA", "FXCM"],
                updateFreq: "Every 5 min",
                status: "operational",
              },
              {
                name: "Commodities",
                sources: ["CME", "ICE"],
                updateFreq: "Every 10 min",
                status: "degraded",
              },
            ].map((source) => (
              <div
                key={source.name}
                className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {source.name}
                  </p>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      source.status === "operational"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {source.sources.join(", ")}
                </p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                  {source.updateFreq}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketsPage;
