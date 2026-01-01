"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";

interface MarketForecast {
  direction: "up" | "down" | "neutral";
  change: string;
  confidence: number;
}

interface MarketData {
  currentPrice: string;
  forecasts: Record<string, MarketForecast>;
}

interface CompareCardsProps {
  selectedMarkets: string[];
  marketData: Record<string, MarketData>;
  marketNames: Record<string, string>;
  selectedHorizon: string;
}

const CompareCards = ({
  selectedMarkets,
  marketData,
  marketNames,
  selectedHorizon,
}: CompareCardsProps) => {
  const gridCols =
    selectedMarkets.length === 1
      ? "lg:grid-cols-1"
      : selectedMarkets.length === 2
      ? "lg:grid-cols-2"
      : selectedMarkets.length === 3
      ? "lg:grid-cols-3"
      : selectedMarkets.length === 4
      ? "lg:grid-cols-2 xl:grid-cols-4"
      : "lg:grid-cols-3 xl:grid-cols-5";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {selectedMarkets.map((symbol, index) => {
        const data = marketData[symbol];
        const forecast = data?.forecasts[selectedHorizon];

        return (
          <AnimatedCard key={symbol} delay={100 + index * 50}>
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {marketNames[symbol]}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/app/forecast/${symbol}`}
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

              <div className="mt-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Current Price
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {data?.currentPrice || "N/A"}
                </p>
              </div>

              <div className="my-4 h-px bg-neutral-200 dark:bg-neutral-700" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedHorizon} Forecast
                  </span>
                  <div
                    className={`flex items-center gap-1 ${
                      forecast?.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : forecast?.direction === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-500"
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 ${
                        forecast?.direction === "down"
                          ? "rotate-180"
                          : forecast?.direction === "neutral"
                          ? "rotate-90"
                          : ""
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
          </AnimatedCard>
        );
      })}
    </div>
  );
};

export default CompareCards;
