"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";

interface Market {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  changeDirection: "up" | "down";
  signal: "up" | "down" | "neutral";
  confidence: number;
  isFavorite?: boolean;
}

interface MarketGridProps {
  markets: Market[];
  filter: "all" | "favorites";
}

const MarketGrid = ({ markets, filter }: MarketGridProps) => {
  const filteredMarkets =
    filter === "favorites" ? markets.filter((m) => m.isFavorite) : markets;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredMarkets.map((market, index) => (
        <AnimatedCard key={market.symbol} delay={50 + index * 30}>
          <Link
            href={`/app/forecasts/${market.symbol}`}
            className="group block"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 group-hover:text-[var(--brand)] dark:text-white">
                      {market.symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {market.name}
                    </p>
                  </div>
                </div>
                {market.isFavorite && (
                  <svg
                    className="h-4 w-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {market.price}
                  </p>
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
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      market.signal === "up"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : market.signal === "down"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-neutral-100 dark:bg-neutral-700"
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 ${
                        market.signal === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : market.signal === "down"
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
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Confidence
                    </p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {market.confidence}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default MarketGrid;
