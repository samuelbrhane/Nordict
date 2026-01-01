"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";
import MarketSelectorModal from "../dashboard/forecastchart/MarketSelectorModal";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface CompareHeaderProps {
  selectedMarkets: string[];
  onAddMarket: (market: { symbol: string; name: string }) => void;
  selectedHorizon: Horizon;
  onHorizonChange: (horizon: Horizon) => void;
}

const HORIZONS: Horizon[] = ["24H", "30D", "12W", "12M"];

const CompareHeader = ({
  selectedMarkets,
  onAddMarket,
  selectedHorizon,
  onHorizonChange,
}: CompareHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMarketSelect = (market: { symbol: string; name: string }) => {
    onAddMarket(market);
    setIsModalOpen(false);
  };

  return (
    <>
      <MarketSelectorModal
        selected={{ symbol: "", name: "" }}
        onSelect={handleMarketSelect}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AnimatedCard delay={50}>
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={selectedMarkets.length >= 5}
            className={`flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 ${
              selectedMarkets.length >= 5 ? "cursor-not-allowed opacity-50" : ""
            }`}
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
          </button>

          <div className="flex w-fit rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {HORIZONS.map((horizon) => (
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
      </AnimatedCard>
    </>
  );
};

export default CompareHeader;
