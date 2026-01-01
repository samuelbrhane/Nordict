"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface MarketForecastData {
  symbol: string;
  name: string;
  forecasts: {
    horizon: Horizon;
    direction: "up" | "down" | "neutral";
    confidence_score: number | string;
    current_price: number | string;
    predicted_mid: number | string;
  }[];
}

interface CompareTableProps {
  markets: MarketForecastData[];
  isLoading?: boolean;
}

const HORIZONS: Horizon[] = ["24H", "30D", "12W", "12M"];

const toNumber = (val: number | string): number => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? 0 : num;
};

const CompareTable = ({ markets, isLoading }: CompareTableProps) => {
  if (isLoading) {
    return (
      <AnimatedCard delay={300}>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-500" />
        </div>
      </AnimatedCard>
    );
  }

  if (markets.length === 0) {
    return (
      <AnimatedCard delay={300}>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">
            No markets selected
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={300}>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-800 sm:p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Detailed Comparison
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            All horizons side by side
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="w-[25%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Market
                </th>
                {HORIZONS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {markets.map((market) => (
                <tr
                  key={market.symbol}
                  className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <Link
                      href={`/app/forecast/${market.symbol}`}
                      className="group flex items-center gap-3"
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black transition-transform group-hover:scale-110"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {market.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900 group-hover:text-[var(--brand)] dark:text-white">
                          {market.symbol}
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {market.name}
                        </p>
                      </div>
                    </Link>
                  </td>
                  {HORIZONS.map((h) => {
                    const forecast = market.forecasts.find(
                      (f) => f.horizon === h
                    );

                    if (!forecast) {
                      return (
                        <td
                          key={h}
                          className="whitespace-nowrap px-4 py-4 text-center sm:px-6"
                        >
                          <span className="text-neutral-400">N/A</span>
                        </td>
                      );
                    }

                    const currentPrice = toNumber(forecast.current_price);
                    const predictedMid = toNumber(forecast.predicted_mid);
                    const confidence =
                      toNumber(forecast.confidence_score) * 100;
                    const expectedChange =
                      currentPrice > 0
                        ? ((predictedMid - currentPrice) / currentPrice) * 100
                        : 0;

                    return (
                      <td
                        key={h}
                        className="whitespace-nowrap px-4 py-4 text-center sm:px-6"
                      >
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-semibold ${
                              forecast.direction === "up"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : forecast.direction === "down"
                                ? "text-red-600 dark:text-red-400"
                                : "text-neutral-500"
                            }`}
                          >
                            {expectedChange >= 0 ? "+" : ""}
                            {expectedChange.toFixed(2)}%
                          </span>
                          <span className="text-xs text-neutral-400">
                            {confidence.toFixed(0)}% conf
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CompareTable;
