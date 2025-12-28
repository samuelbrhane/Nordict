"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface Market {
  symbol: string;
  name: string;
}

interface CompareHeaderProps {
  availableMarkets: Market[];
  selectedMarkets: string[];
  onToggleMarket: (symbol: string) => void;
  selectedHorizon: string;
  onHorizonChange: (horizon: string) => void;
  horizons: string[];
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
}

const CompareHeader = ({
  availableMarkets,
  selectedMarkets,
  onToggleMarket,
  selectedHorizon,
  onHorizonChange,
  horizons,
  isDropdownOpen,
  onToggleDropdown,
}: CompareHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isDropdownOpen]);

  const dropdownContent = isDropdownOpen && mounted && (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onToggleDropdown} />
      <div
        className="fixed z-[9999] w-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          maxHeight: "380px",
        }}
      >
        <div className="p-2">
          {availableMarkets.map((market) => {
            const isSelected = selectedMarkets.includes(market.symbol);
            const isDisabled = !isSelected && selectedMarkets.length >= 5;
            return (
              <button
                key={market.symbol}
                onClick={() => !isDisabled && onToggleMarket(market.symbol)}
                disabled={isDisabled}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed opacity-50"
                    : isSelected
                    ? "bg-[rgba(4,236,58,0.1)]"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
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
                {isSelected && (
                  <svg
                    className="h-5 w-5"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          ref={buttonRef}
          onClick={onToggleDropdown}
          className="flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
        >
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Add Market ({selectedMarkets.length}/5)
          </span>
          <svg
            className={`h-4 w-4 text-neutral-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
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

        <div className="flex w-fit rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
          {horizons.map((horizon) => (
            <button
              key={horizon}
              onClick={() => onHorizonChange(horizon)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedHorizon === horizon
                  ? "text-black shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
              style={
                selectedHorizon === horizon
                  ? { backgroundColor: "var(--brand)" }
                  : {}
              }
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {mounted && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default CompareHeader;
