"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const AVAILABLE_MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "MATIC-USD", name: "Polygon" },
  { symbol: "LINK-USD", name: "Chainlink" },
];

// Mock comparison data
const COMPARISON_DATA: Record<
  string,
  {
    currentPrice: string;
    forecasts: Record<
      string,
      { direction: "up" | "down"; change: string; confidence: number }
    >;
  }
> = {
  "BTC-USD": {
    currentPrice: "$95,420",
    forecasts: {
      "1D": { direction: "up", change: "+1.2%", confidence: 68 },
      "7D": { direction: "up", change: "+4.2%", confidence: 78 },
      "30D": { direction: "up", change: "+8.5%", confidence: 65 },
    },
  },
  "ETH-USD": {
    currentPrice: "$3,450",
    forecasts: {
      "1D": { direction: "up", change: "+0.8%", confidence: 62 },
      "7D": { direction: "up", change: "+3.1%", confidence: 72 },
      "30D": { direction: "up", change: "+6.8%", confidence: 58 },
    },
  },
  "SOL-USD": {
    currentPrice: "$142.30",
    forecasts: {
      "1D": { direction: "down", change: "-0.5%", confidence: 55 },
      "7D": { direction: "down", change: "-2.8%", confidence: 68 },
      "30D": { direction: "up", change: "+5.2%", confidence: 52 },
    },
  },
  "AVAX-USD": {
    currentPrice: "$38.50",
    forecasts: {
      "1D": { direction: "up", change: "+1.8%", confidence: 61 },
      "7D": { direction: "up", change: "+5.5%", confidence: 70 },
      "30D": { direction: "up", change: "+12.1%", confidence: 55 },
    },
  },
  "MATIC-USD": {
    currentPrice: "$0.89",
    forecasts: {
      "1D": { direction: "up", change: "+0.3%", confidence: 52 },
      "7D": { direction: "up", change: "+2.1%", confidence: 58 },
      "30D": { direction: "up", change: "+4.5%", confidence: 48 },
    },
  },
  "LINK-USD": {
    currentPrice: "$14.20",
    forecasts: {
      "1D": { direction: "down", change: "-0.8%", confidence: 58 },
      "7D": { direction: "up", change: "+1.9%", confidence: 62 },
      "30D": { direction: "up", change: "+7.3%", confidence: 54 },
    },
  },
};

const HORIZONS = ["1D", "7D", "30D"];

const ForecastsComparePage = () => {
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    "BTC-USD",
    "ETH-USD",
  ]);
  const [selectedHorizon, setSelectedHorizon] = useState("7D");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMarket = (symbol: string) => {
    if (selectedMarkets.includes(symbol)) {
      if (selectedMarkets.length > 1) {
        setSelectedMarkets(selectedMarkets.filter((m) => m !== symbol));
      }
    } else if (selectedMarkets.length < 5) {
      setSelectedMarkets([...selectedMarkets, symbol]);
    }
  };

  const removeMarket = (symbol: string) => {
    if (selectedMarkets.length > 1) {
      setSelectedMarkets(selectedMarkets.filter((m) => m !== symbol));
    }
  };

  return (
    <AppLayout
      title="Compare Forecasts"
      subtitle="Side-by-side market comparison"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Market selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <svg
                className="h-5 w-5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Add Market ({selectedMarkets.length}/5)
              </span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
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

            {isDropdownOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="p-2">
                  {AVAILABLE_MARKETS.map((market) => {
                    const isSelected = selectedMarkets.includes(market.symbol);
                    const isDisabled =
                      !isSelected && selectedMarkets.length >= 5;

                    return (
                      <button
                        key={market.symbol}
                        onClick={() => {
                          if (!isDisabled) toggleMarket(market.symbol);
                        }}
                        disabled={isDisabled}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isDisabled
                            ? "cursor-not-allowed opacity-50"
                            : isSelected
                            ? "bg-[rgba(4,236,58,0.1)]"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {market.symbol}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {market.name}
                          </p>
                        </div>
                        {isSelected && (
                          <svg
                            className="h-5 w-5"
                            style={{ color: "var(--brand)" }}
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
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Horizon tabs */}
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {HORIZONS.map((horizon) => (
              <button
                key={horizon}
                onClick={() => setSelectedHorizon(horizon)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedHorizon === horizon
                    ? "text-black shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                style={
                  selectedHorizon === horizon
                    ? { backgroundColor: "var(--brand)" }
                    : {}
                }
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>

        {/* Selected markets chips */}
        <div className="flex flex-wrap gap-2">
          {selectedMarkets.map((symbol) => (
            <div
              key={symbol}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {symbol}
              </span>
              {selectedMarkets.length > 1 && (
                <button
                  onClick={() => removeMarket(symbol)}
                  className="rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
                >
                  <svg
                    className="h-3.5 w-3.5"
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
              )}
            </div>
          ))}
        </div>

        {/* Comparison cards */}
        <div
          className={`grid gap-4 ${
            selectedMarkets.length === 1
              ? "lg:grid-cols-1"
              : selectedMarkets.length === 2
              ? "lg:grid-cols-2"
              : selectedMarkets.length === 3
              ? "lg:grid-cols-3"
              : selectedMarkets.length === 4
              ? "lg:grid-cols-2 xl:grid-cols-4"
              : "lg:grid-cols-3 xl:grid-cols-5"
          }`}
        >
          {selectedMarkets.map((symbol) => {
            const data = COMPARISON_DATA[symbol];
            const forecast = data?.forecasts[selectedHorizon];
            const market = AVAILABLE_MARKETS.find((m) => m.symbol === symbol);

            return (
              <div
                key={symbol}
                className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      {symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {symbol}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {market?.name}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/app/forecasts/${symbol}`}
                    className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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
                </div>

                {/* Current price */}
                <div className="mt-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Current Price
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {data?.currentPrice || "N/A"}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-neutral-200 dark:bg-neutral-700" />

                {/* Forecast for selected horizon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedHorizon} Forecast
                    </span>
                    <div
                      className={`flex items-center gap-1 ${
                        forecast?.direction === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <svg
                        className={`h-4 w-4 ${
                          forecast?.direction === "down" ? "rotate-180" : ""
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
                      <span className="font-semibold">
                        {forecast?.change || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Confidence
                      </span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {forecast?.confidence || 0}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${forecast?.confidence || 0}%`,
                          backgroundColor: "var(--brand)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Detailed Comparison
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            All horizons side by side
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Market
                  </th>
                  {HORIZONS.map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {selectedMarkets.map((symbol) => {
                  const data = COMPARISON_DATA[symbol];
                  return (
                    <tr key={symbol}>
                      <td className="py-4">
                        <Link
                          href={`/app/forecasts/${symbol}`}
                          className="font-medium text-neutral-900 hover:underline dark:text-white"
                        >
                          {symbol}
                        </Link>
                      </td>
                      {HORIZONS.map((h) => {
                        const forecast = data?.forecasts[h];
                        return (
                          <td key={h} className="py-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`font-semibold ${
                                  forecast?.direction === "up"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {forecast?.change || "N/A"}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {forecast?.confidence || 0}% conf
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regime notes placeholder */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Correlation & Regime Notes
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Market relationship insights
          </p>

          <div className="mt-4 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
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
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Correlation analysis coming soon
            </p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Will show how selected markets move together and current regime
              classification
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ForecastsComparePage;
