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

interface CompareTableProps {
  selectedMarkets: string[];
  marketData: Record<string, MarketData>;
  horizons: string[];
}

const CompareTable = ({
  selectedMarkets,
  marketData,
  horizons,
}: CompareTableProps) => {
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
                {horizons.map((h) => (
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
              {selectedMarkets.map((symbol) => {
                const data = marketData[symbol];
                return (
                  <tr
                    key={symbol}
                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <Link
                        href={`/app/forecasts/${symbol}`}
                        className="flex items-center gap-3 group"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black transition-transform group-hover:scale-110"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          {symbol.slice(0, 2)}
                        </div>
                        <span className="font-medium text-neutral-900 group-hover:text-[var(--brand)] dark:text-white">
                          {symbol}
                        </span>
                      </Link>
                    </td>
                    {horizons.map((h) => {
                      const forecast = data?.forecasts[h];
                      return (
                        <td
                          key={h}
                          className="whitespace-nowrap px-4 py-4 text-center sm:px-6"
                        >
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`font-semibold ${
                                forecast?.direction === "up"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : forecast?.direction === "down"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-neutral-500"
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
    </AnimatedCard>
  );
};

export default CompareTable;
