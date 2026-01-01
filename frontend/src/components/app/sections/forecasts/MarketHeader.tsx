"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";

interface MarketHeaderProps {
  symbol: string;
  name: string;
  category: string;
  currentPrice: number;
  lastUpdatedAgo: string;
}

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "$0.00";

  if (numPrice >= 1000) {
    return `$${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (numPrice >= 1) {
    return `$${numPrice.toFixed(2)}`;
  }
  return `$${numPrice.toFixed(4)}`;
};

const MarketHeader = ({
  symbol,
  name,
  category,
  currentPrice,
  lastUpdatedAgo,
}: MarketHeaderProps) => {
  return (
    <AnimatedCard delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-black sm:h-14 sm:w-14 sm:text-2xl"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
                {formatPrice(currentPrice)}
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Price at forecast
              </span>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Updated {lastUpdatedAgo}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/app/alerts"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
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
            href={`/app/forecast/compare?markets=${symbol}`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90"
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
    </AnimatedCard>
  );
};

export default MarketHeader;
