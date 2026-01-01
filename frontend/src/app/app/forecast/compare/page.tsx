"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppLayout, LoadingSpinner } from "@/components/app";
import { AnimatedCard } from "@/components/app/sections/dashboard";
import {
  CompareHeader,
  MarketChips,
  CompareCards,
  CompareTable,
} from "@/components/app/sections/compare";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { useCompareForecasts } from "@/lib/hooks/useCompareForecasts";

const ForecastsComparePage = () => {
  const searchParams = useSearchParams();
  const marketsParam = searchParams.get("markets");

  const [selectedMarkets, setSelectedMarkets] = useState<
    { symbol: string; name: string }[]
  >([
    { symbol: "BTC-USD", name: "Bitcoin" },
    { symbol: "ETH-USD", name: "Ethereum" },
  ]);
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>("24H");

  // Fetch compare data
  const {
    data: compareData,
    allHorizonsData,
    isLoading,
  } = useCompareForecasts(
    selectedMarkets.map((m) => m.symbol),
    selectedHorizon
  );

  // Handle URL params
  useEffect(() => {
    if (marketsParam) {
      const symbols = marketsParam.split(",");
      if (symbols.length > 0) {
        const markets = symbols.slice(0, 5).map((symbol) => ({
          symbol,
          name: symbol.replace("-USD", ""),
        }));
        setSelectedMarkets(markets);
      }
    }
  }, [marketsParam]);

  const handleAddMarket = (market: { symbol: string; name: string }) => {
    if (
      selectedMarkets.length < 5 &&
      !selectedMarkets.some((m) => m.symbol === market.symbol)
    ) {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const handleRemoveMarket = (symbol: string) => {
    if (selectedMarkets.length > 1) {
      setSelectedMarkets(selectedMarkets.filter((m) => m.symbol !== symbol));
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <LoadingSpinner text="Loading comparison..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        {/* Breadcrumb & Title */}
        <AnimatedCard delay={0}>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/app/forecasts"
              className="text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Forecasts
            </Link>
            <svg
              className="h-4 w-4 text-neutral-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-medium text-neutral-900 dark:text-white">
              Compare
            </span>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Compare Forecasts
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Side-by-side market comparison
            </p>
          </div>
        </AnimatedCard>

        <CompareHeader
          selectedMarkets={selectedMarkets.map((m) => m.symbol)}
          onAddMarket={handleAddMarket}
          selectedHorizon={selectedHorizon}
          onHorizonChange={setSelectedHorizon}
        />

        <MarketChips
          selectedMarkets={selectedMarkets}
          onRemoveMarket={handleRemoveMarket}
        />

        <CompareCards
          markets={compareData}
          selectedHorizon={selectedHorizon}
          isLoading={false}
        />

        <CompareTable markets={allHorizonsData} isLoading={false} />
      </div>
    </AppLayout>
  );
};

export default ForecastsComparePage;
