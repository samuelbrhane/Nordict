"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface MarketChipsProps {
  selectedMarkets: { symbol: string; name: string }[];
  onRemoveMarket: (symbol: string) => void;
}

const MarketChips = ({ selectedMarkets, onRemoveMarket }: MarketChipsProps) => {
  return (
    <AnimatedCard delay={100}>
      <div className="flex flex-wrap gap-2">
        {selectedMarkets.map((market) => (
          <div
            key={market.symbol}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {market.symbol.slice(0, 2)}
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {market.symbol}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {market.name}
            </span>
            {selectedMarkets.length > 1 && (
              <button
                onClick={() => onRemoveMarket(market.symbol)}
                className="ml-1 rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </AnimatedCard>
  );
};

export default MarketChips;
