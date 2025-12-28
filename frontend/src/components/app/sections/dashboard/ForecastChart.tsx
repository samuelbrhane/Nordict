"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedCard from "./AnimatedCard";

interface ForecastChartProps {
  horizon: "1D" | "7D" | "30D";
}

const markets = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "LINK-USD", name: "Chainlink" },
];

const generateChartData = (horizon: "1D" | "7D" | "30D", symbol: string) => {
  const points = horizon === "1D" ? 24 : horizon === "7D" ? 7 : 30;
  const data = [];
  const basePrice =
    symbol === "BTC-USD"
      ? 42000
      : symbol === "ETH-USD"
      ? 2200
      : symbol === "SOL-USD"
      ? 95
      : symbol === "AVAX-USD"
      ? 35
      : 14;
  let price = basePrice;
  let forecast = basePrice;
  let actual = basePrice;

  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * (basePrice * 0.02);
    forecast += (Math.random() - 0.45) * (basePrice * 0.015);
    actual += (Math.random() - 0.47) * (basePrice * 0.018);
    data.push({
      price: Math.round(price * 100) / 100,
      forecast: Math.round(forecast * 100) / 100,
      actual: Math.round(actual * 100) / 100,
      upper:
        Math.round(
          (forecast + basePrice * 0.03 + Math.random() * basePrice * 0.01) * 100
        ) / 100,
      lower:
        Math.round(
          (forecast - basePrice * 0.03 - Math.random() * basePrice * 0.01) * 100
        ) / 100,
    });
  }
  return data;
};

const getSummaryData = (horizon: "1D" | "7D" | "30D", symbol: string) => {
  const summaries: Record<
    string,
    Record<string, { direction: string; range: string; confidence: number }>
  > = {
    "BTC-USD": {
      "1D": {
        direction: "Bullish",
        range: "$41,800 - $43,200",
        confidence: 74,
      },
      "7D": {
        direction: "Bullish",
        range: "$40,500 - $45,800",
        confidence: 68,
      },
      "30D": {
        direction: "Neutral",
        range: "$38,000 - $48,500",
        confidence: 61,
      },
    },
    "ETH-USD": {
      "1D": { direction: "Bullish", range: "$2,150 - $2,280", confidence: 72 },
      "7D": { direction: "Bullish", range: "$2,100 - $2,400", confidence: 65 },
      "30D": { direction: "Bullish", range: "$2,000 - $2,600", confidence: 58 },
    },
    "SOL-USD": {
      "1D": { direction: "Bearish", range: "$92 - $98", confidence: 68 },
      "7D": { direction: "Neutral", range: "$88 - $105", confidence: 62 },
      "30D": { direction: "Bullish", range: "$85 - $120", confidence: 55 },
    },
    "AVAX-USD": {
      "1D": { direction: "Bullish", range: "$34 - $37", confidence: 65 },
      "7D": { direction: "Bullish", range: "$32 - $40", confidence: 60 },
      "30D": { direction: "Neutral", range: "$30 - $45", confidence: 52 },
    },
    "LINK-USD": {
      "1D": { direction: "Neutral", range: "$13.5 - $14.5", confidence: 52 },
      "7D": { direction: "Bullish", range: "$13 - $16", confidence: 58 },
      "30D": { direction: "Bullish", range: "$12 - $18", confidence: 50 },
    },
  };
  return summaries[symbol]?.[horizon] || summaries["BTC-USD"][horizon];
};

const ForecastChart = ({ horizon }: ForecastChartProps) => {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showActual, setShowActual] = useState(true);

  const data = generateChartData(horizon, selectedMarket.symbol);
  const summary = getSummaryData(horizon, selectedMarket.symbol);

  const maxValue = Math.max(...data.map((d) => Math.max(d.upper, d.actual)));
  const minValue = Math.min(...data.map((d) => Math.min(d.lower, d.actual)));
  const range = maxValue - minValue;

  const getY = (value: number) => 180 - ((value - minValue) / range) * 160;

  const pricePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
          d.price
        )}`
    )
    .join(" ");
  const forecastPath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
          d.forecast
        )}`
    )
    .join(" ");
  const actualPath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
          d.actual
        )}`
    )
    .join(" ");
  const bandPath =
    data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
            d.upper
          )}`
      )
      .join(" ") +
    " " +
    [...data]
      .reverse()
      .map(
        (d, i) =>
          `L ${((data.length - 1 - i) / (data.length - 1)) * 100}% ${getY(
            d.lower
          )}`
      )
      .join(" ") +
    " Z";

  const formatValue = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <AnimatedCard delay={350}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(4,236,58,0.1)",
                        color: "var(--brand)",
                      }}
                    >
                      {selectedMarket.symbol.slice(0, 2)}
                    </span>
                    <span className="text-neutral-900 dark:text-white">
                      {selectedMarket.symbol}
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
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                        {markets.map((market) => (
                          <button
                            key={market.symbol}
                            onClick={() => {
                              setSelectedMarket(market);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                              selectedMarket.symbol === market.symbol
                                ? "bg-neutral-50 dark:bg-neutral-700"
                                : ""
                            }`}
                          >
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                              style={{
                                backgroundColor: "rgba(4,236,58,0.1)",
                                color: "var(--brand)",
                              }}
                            >
                              {market.symbol.slice(0, 2)}
                            </span>
                            <div className="text-left">
                              <p className="font-medium text-neutral-900 dark:text-white">
                                {market.symbol}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {market.name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Price vs Forecast ({horizon})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={showActual}
                    onChange={(e) => setShowActual(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-neutral-300 accent-[var(--brand)]"
                  />
                  Show Actual
                </label>
                <div className="hidden items-center gap-3 text-xs sm:flex">
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded-full bg-neutral-400" />
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Price
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-0.5 w-4 rounded-full"
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Forecast
                    </span>
                  </div>
                  {showActual && (
                    <div className="flex items-center gap-1.5">
                      <span className="h-0.5 w-4 rounded-full bg-blue-500" />
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Actual
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative h-48 w-full sm:h-56">
              <svg
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0%"
                    y1={20 + i * 40}
                    x2="100%"
                    y2={20 + i * 40}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                    className="text-neutral-300 dark:text-neutral-700"
                  />
                ))}
                <path d={bandPath} fill="var(--brand)" fillOpacity={0.1} />
                <path
                  d={pricePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-400 dark:text-neutral-500"
                />
                <path
                  d={forecastPath}
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {showActual && (
                  <path
                    d={actualPath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2,1"
                  />
                )}
              </svg>
              <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-[10px] text-neutral-400">
                <span>{formatValue(maxValue)}</span>
                <span>{formatValue((maxValue + minValue) / 2)}</span>
                <span>{formatValue(minValue)}</span>
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 xl:w-52">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
              Summary
            </h3>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Direction
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md ${
                      summary.direction === "Bullish"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : summary.direction === "Bearish"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-neutral-100 dark:bg-neutral-700"
                    }`}
                  >
                    <svg
                      className={`h-3 w-3 ${
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
                  <span
                    className={`text-sm font-medium ${
                      summary.direction === "Bullish"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : summary.direction === "Bearish"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {summary.direction}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Range
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                  {summary.range}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Confidence
                </p>
                <div className="mt-1">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    {summary.confidence}%
                  </span>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${summary.confidence}%`,
                        backgroundColor: "var(--brand)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={`/app/forecasts/${selectedMarket.symbol}`}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
            >
              View Details
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ForecastChart;
