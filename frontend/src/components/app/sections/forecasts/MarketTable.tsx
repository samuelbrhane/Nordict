"use client";

import Link from "next/link";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Market, Horizon } from "@/config/marketsData";

interface MarketTableProps {
  markets: Market[];
  horizon: Horizon;
  onToggleFavorite: (symbol: string) => void;
}

const MarketTable = ({
  markets,
  horizon,
  onToggleFavorite,
}: MarketTableProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="space-y-3 sm:hidden">
        {markets.map((market) => {
          const horizonData = market.horizons[horizon];
          return (
            <div
              key={market.symbol}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between">
                <Link
                  href={`/app/${market.symbol}`}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {market.symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {market.name}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => onToggleFavorite(market.symbol)}
                  className="p-1"
                >
                  <svg
                    className="h-5 w-5"
                    fill={market.isFavorite ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={
                      market.isFavorite
                        ? { color: "#FBBF24" }
                        : { color: "#9CA3AF" }
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Price
                  </p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {market.price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    24h
                  </p>
                  <p
                    className={`font-medium ${
                      market.changeDirection === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {market.change24h}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {horizon} Conf
                  </p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {horizonData.confidence}%
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                    horizonData.signal === "up"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : horizonData.signal === "down"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  <svg
                    className={`h-3 w-3 ${
                      horizonData.signal === "down"
                        ? "rotate-180"
                        : horizonData.signal === "neutral"
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
                  {horizonData.signal}
                </div>
                <Link
                  href={`/app/forecasts/${market.symbol}`}
                  className="text-sm font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  View →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Market
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                24h
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {horizon} Signal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {horizon} Conf
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Fav
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {markets.map((market) => {
              const horizonData = market.horizons[horizon];
              return (
                <tr
                  key={market.symbol}
                  className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {market.symbol.slice(0, 2)}
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
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900 dark:text-white">
                    {market.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
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
                  <td className="whitespace-nowrap px-4 py-3">
                    <div
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${
                        horizonData.signal === "up"
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : horizonData.signal === "down"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-neutral-100 dark:bg-neutral-700"
                      }`}
                    >
                      <svg
                        className={`h-3.5 w-3.5 ${
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
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${horizonData.confidence}%`,
                            backgroundColor: "var(--brand)",
                          }}
                        />
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {horizonData.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleFavorite(market.symbol)}
                      className="rounded-lg p-1 text-neutral-300 transition-colors hover:text-amber-400 dark:text-neutral-600 dark:hover:text-amber-400"
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
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
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
              );
            })}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  );
};

export default MarketTable;
