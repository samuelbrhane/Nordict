// components/app/sections/dashboard/forecastchart/MarketSelectorModal.tsx

"use client";

import { useEffect } from "react";
import { Market } from "./utils";

interface MarketSelectorModalProps {
  markets: Market[];
  selected: Market;
  onSelect: (market: Market) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MarketSelectorModal = ({
  markets,
  selected,
  onSelect,
  isOpen,
  onClose,
}: MarketSelectorModalProps) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Select Market
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Choose a market to view forecast
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <svg
              className="h-5 w-5"
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
        </div>

        {/* Market Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {markets.map((market) => {
            const isSelected = selected.symbol === market.symbol;
            return (
              <button
                key={market.symbol}
                onClick={() => {
                  onSelect(market);
                  onClose();
                }}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-[var(--brand)] bg-[rgba(4,236,58,0.08)]"
                    : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-2 top-2">
                    <svg
                      className="h-5 w-5 text-[var(--brand)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold transition-transform group-hover:scale-110 ${
                    isSelected
                      ? "bg-[var(--brand)] text-white"
                      : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                  }`}
                  style={isSelected ? { backgroundColor: "var(--brand)" } : {}}
                >
                  {market.symbol.slice(0, 2)}
                </div>

                {/* Name */}
                <div className="text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isSelected
                        ? "text-[var(--brand)]"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {market.symbol.replace("-USD", "")}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {market.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-neutral-800">
            ESC
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </div>
  );
};

export default MarketSelectorModal;
