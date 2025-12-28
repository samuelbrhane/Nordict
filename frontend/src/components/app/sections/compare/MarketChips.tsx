"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface MarketChipsProps {
  selectedMarkets: string[];
  onRemoveMarket: (symbol: string) => void;
}

const MarketChips = ({ selectedMarkets, onRemoveMarket }: MarketChipsProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="flex flex-wrap gap-2">
        {selectedMarkets.map((symbol, index) => (
          <div
            key={symbol}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {symbol.slice(0, 2)}
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {symbol}
            </span>
            {selectedMarkets.length > 1 && (
              <button
                onClick={() => onRemoveMarket(symbol)}
                className="rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
              >
                <svg
                  className="h-3.5 w-3.5"
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
