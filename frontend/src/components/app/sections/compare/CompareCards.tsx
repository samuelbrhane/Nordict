"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface MarketForecast {
  symbol: string;
  name: string;
  current_price: number | string;
  direction: "up" | "down" | "neutral";
  confidence_score: number | string;
  predicted_mid: number | string;
}

interface CompareCardsProps {
  markets: MarketForecast[];
  selectedHorizon: Horizon;
  isLoading?: boolean;
}

const toNumber = (val: number | string): number => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? 0 : num;
};

const formatPrice = (price: number | string): string => {
  const num = toNumber(price);
  if (num >= 1000) {
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (num >= 1) {
    return `$${num.toFixed(2)}`;
  }
  return `$${num.toFixed(4)}`;
};

const CompareCards = ({
  markets,
  selectedHorizon,
  isLoading,
}: CompareCardsProps) => {
  const gridCols =
    markets.length === 1
      ? "lg:grid-cols-1"
      : markets.length === 2
      ? "lg:grid-cols-2"
      : markets.length === 3
      ? "lg:grid-cols-3"
      : markets.length === 4
      ? "lg:grid-cols-2 xl:grid-cols-4"
      : "lg:grid-cols-3 xl:grid-cols-5";

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${gridCols}`}>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-neutral-500 dark:text-neutral-400">
          No markets selected
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {markets.map((market, index) => {
        const currentPrice = toNumber(market.current_price);
        const predictedMid = toNumber(market.predicted_mid);
        const confidence = toNumber(market.confidence_score) * 100;
        const expectedChange =
          currentPrice > 0
            ? ((predictedMid - currentPrice) / currentPrice) * 100
            : 0;

        return (
          <AnimatedCard key={market.symbol} delay={100 + index * 50}>
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
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
                <Link
                  href={`/app/forecast/${market.symbol}`}
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
                  Price at forecast
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatPrice(currentPrice)}
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
                      market.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : market.direction === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-500"
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 ${
                        market.direction === "down"
                          ? "rotate-180"
                          : market.direction === "neutral"
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
                      {expectedChange >= 0 ? "+" : ""}
                      {expectedChange.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Confidence
                    </span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {confidence.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${confidence}%`,
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
