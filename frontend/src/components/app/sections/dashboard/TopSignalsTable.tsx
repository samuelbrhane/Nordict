"use client";

import Link from "next/link";
import AnimatedCard from "./AnimatedCard";

interface Signal {
  symbol: string;
  name: string;
  horizon: string;
  signal: "up" | "down" | "neutral";
  confidence: number;
  expectedMove: string;
  updatedAt: string;
}

interface TopSignalsTableProps {
  horizon: "1D" | "7D" | "30D";
}

const getSignalsData = (horizon: "1D" | "7D" | "30D"): Signal[] => {
  const baseSignals: Signal[] = [
    {
      symbol: "BTC-USD",
      name: "Bitcoin",
      horizon,
      signal: "up",
      confidence: 78,
      expectedMove: "+4.2%",
      updatedAt: "2m ago",
    },
    {
      symbol: "ETH-USD",
      name: "Ethereum",
      horizon,
      signal: "up",
      confidence: 72,
      expectedMove: "+3.1%",
      updatedAt: "2m ago",
    },
    {
      symbol: "SOL-USD",
      name: "Solana",
      horizon,
      signal: "down",
      confidence: 68,
      expectedMove: "-2.8%",
      updatedAt: "2m ago",
    },
    {
      symbol: "AVAX-USD",
      name: "Avalanche",
      horizon,
      signal: "up",
      confidence: 65,
      expectedMove: "+1.9%",
      updatedAt: "2m ago",
    },
    {
      symbol: "LINK-USD",
      name: "Chainlink",
      horizon,
      signal: "neutral",
      confidence: 52,
      expectedMove: "+0.3%",
      updatedAt: "2m ago",
    },
  ];

  return baseSignals.map((s) => ({
    ...s,
    confidence:
      horizon === "1D"
        ? s.confidence
        : horizon === "7D"
        ? s.confidence - 5
        : s.confidence - 12,
  }));
};

const TopSignalsTable = ({ horizon }: TopSignalsTableProps) => {
  const signals = getSignalsData(horizon);

  return (
    <AnimatedCard delay={450}>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Top Forecast Signals
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Markets ranked by signal strength and confidence
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="w-[25%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Market
                </th>
                <th className="w-[12%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Horizon
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Signal
                </th>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Confidence
                </th>
                <th className="w-[13%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Expected
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 sm:px-6">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {signals.map((signal) => (
                <tr
                  key={signal.symbol}
                  className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <Link
                      href={`/app/forecasts/${signal.symbol}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: "rgba(4,236,58,0.1)",
                          color: "var(--brand)",
                        }}
                      >
                        {signal.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 group-hover:text-[var(--brand)] dark:text-white">
                          {signal.symbol}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {signal.name}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {signal.horizon}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md ${
                          signal.signal === "up"
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : signal.signal === "down"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-neutral-100 dark:bg-neutral-700"
                        }`}
                      >
                        <svg
                          className={`h-3.5 w-3.5 ${
                            signal.signal === "up"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : signal.signal === "down"
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
                        className={`text-sm font-medium capitalize ${
                          signal.signal === "up"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : signal.signal === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {signal.signal}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${signal.confidence}%`,
                            backgroundColor: "var(--brand)",
                          }}
                        />
                      </div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {signal.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <span
                      className={`text-sm font-medium ${
                        signal.expectedMove.startsWith("+")
                          ? "text-emerald-600 dark:text-emerald-400"
                          : signal.expectedMove.startsWith("-")
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500"
                      }`}
                    >
                      {signal.expectedMove}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {signal.updatedAt}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default TopSignalsTable;
