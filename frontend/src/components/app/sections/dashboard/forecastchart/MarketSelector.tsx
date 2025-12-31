// components/app/sections/dashboard/forecastchart/MarketSelector.tsx

"use client";

import { Market } from "./utils";

interface MarketSelectorProps {
  markets: Market[];
  selected: Market;
  onSelect: (market: Market) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MarketSelector = ({
  markets,
  selected,
  onSelect,
  isOpen,
  onToggle,
  onClose,
}: MarketSelectorProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
          style={{
            backgroundColor: "rgba(4,236,58,0.1)",
            color: "var(--brand)",
          }}
        >
          {selected.symbol.slice(0, 2)}
        </span>
        <span className="text-neutral-900 dark:text-white">
          {selected.symbol}
        </span>
        <svg
          className={`h-4 w-4 text-neutral-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            {markets.map((market) => (
              <button
                key={market.symbol}
                onClick={() => {
                  onSelect(market);
                  onClose();
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                  selected.symbol === market.symbol
                    ? "bg-neutral-50 dark:bg-neutral-700"
                    : ""
                }`}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(4,236,58,0.1)",
                    color: "var(--brand)",
                  }}
                >
                  {market.symbol.slice(0, 2)}
                </span>
                <div className="text-left">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {market.symbol}
                  </p>
                  <p className="text-xs text-neutral-500">{market.name}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketSelector;
