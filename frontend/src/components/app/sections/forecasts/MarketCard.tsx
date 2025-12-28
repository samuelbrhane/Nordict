"use client";

import Link from "next/link";
import { Market, Horizon } from "@/config/marketsData";
interface MarketCardProps {
  market: Market;
  horizon: Horizon;
  onToggleFavorite: (symbol: string) => void;
}

const MarketCard = ({ market, horizon, onToggleFavorite }: MarketCardProps) => {
  const horizonData = market.horizons[horizon];

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <Link
          href={`/app/forecasts/${market.symbol}`}
          className="flex items-center gap-3"
        >
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
        </Link>
        <button
          onClick={() => onToggleFavorite(market.symbol)}
          className="rounded-lg p-1.5 text-neutral-300 transition-colors hover:text-amber-400 dark:text-neutral-600 dark:hover:text-amber-400"
        >
          <svg
            className="h-5 w-5"
            fill={market.isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={market.isFavorite ? { color: "#FBBF24" } : {}}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      </div>
      <Link href={`/app/forecasts/${market.symbol}`}>
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
                horizonData.signal === "up"
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : horizonData.signal === "down"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-neutral-100 dark:bg-neutral-700"
              }`}
            >
              <svg
                className={`h-4 w-4 ${
                  horizonData.signal === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : horizonData.signal === "down"
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
                {horizon} Conf
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {horizonData.confidence}%
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MarketCard;
