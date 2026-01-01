"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/app";
import { AnimatedCard } from "@/components/app/sections/dashboard";
import {
  CompareHeader,
  MarketChips,
  CompareCards,
  CompareTable,
} from "@/components/app/sections/compare";

const AVAILABLE_MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "LINK-USD", name: "Chainlink" },
  { symbol: "DOT-USD", name: "Polkadot" },
  { symbol: "MATIC-USD", name: "Polygon" },
  { symbol: "UNI-USD", name: "Uniswap" },
];

const MARKET_NAMES: Record<string, string> = {
  "BTC-USD": "Bitcoin",
  "ETH-USD": "Ethereum",
  "SOL-USD": "Solana",
  "AVAX-USD": "Avalanche",
  "LINK-USD": "Chainlink",
  "DOT-USD": "Polkadot",
  "MATIC-USD": "Polygon",
  "UNI-USD": "Uniswap",
};

const MARKET_DATA: Record<
  string,
  {
    currentPrice: string;
    forecasts: Record<
      string,
      {
        direction: "up" | "down" | "neutral";
        change: string;
        confidence: number;
      }
    >;
  }
> = {
  "BTC-USD": {
    currentPrice: "$95,420",
    forecasts: {
      "1D": { direction: "up", change: "+1.2%", confidence: 68 },
      "7D": { direction: "up", change: "+4.2%", confidence: 78 },
      "30D": { direction: "up", change: "+8.5%", confidence: 65 },
    },
  },
  "ETH-USD": {
    currentPrice: "$3,450",
    forecasts: {
      "1D": { direction: "up", change: "+0.8%", confidence: 62 },
      "7D": { direction: "up", change: "+3.1%", confidence: 72 },
      "30D": { direction: "up", change: "+6.8%", confidence: 58 },
    },
  },
  "SOL-USD": {
    currentPrice: "$142.30",
    forecasts: {
      "1D": { direction: "down", change: "-0.5%", confidence: 55 },
      "7D": { direction: "down", change: "-2.8%", confidence: 68 },
      "30D": { direction: "up", change: "+5.2%", confidence: 52 },
    },
  },
  "AVAX-USD": {
    currentPrice: "$38.50",
    forecasts: {
      "1D": { direction: "up", change: "+1.8%", confidence: 61 },
      "7D": { direction: "up", change: "+5.5%", confidence: 70 },
      "30D": { direction: "up", change: "+12.1%", confidence: 55 },
    },
  },
  "LINK-USD": {
    currentPrice: "$14.20",
    forecasts: {
      "1D": { direction: "down", change: "-0.8%", confidence: 58 },
      "7D": { direction: "up", change: "+1.9%", confidence: 62 },
      "30D": { direction: "up", change: "+7.3%", confidence: 54 },
    },
  },
  "DOT-USD": {
    currentPrice: "$7.85",
    forecasts: {
      "1D": { direction: "up", change: "+0.6%", confidence: 54 },
      "7D": { direction: "up", change: "+2.4%", confidence: 61 },
      "30D": { direction: "up", change: "+9.1%", confidence: 48 },
    },
  },
  "MATIC-USD": {
    currentPrice: "$0.89",
    forecasts: {
      "1D": { direction: "up", change: "+0.3%", confidence: 52 },
      "7D": { direction: "up", change: "+2.1%", confidence: 58 },
      "30D": { direction: "up", change: "+4.5%", confidence: 48 },
    },
  },
  "UNI-USD": {
    currentPrice: "$12.40",
    forecasts: {
      "1D": { direction: "up", change: "+1.1%", confidence: 56 },
      "7D": { direction: "up", change: "+3.8%", confidence: 63 },
      "30D": { direction: "up", change: "+8.2%", confidence: 51 },
    },
  },
};

const HORIZONS = ["1D", "7D", "30D"];

const ForecastsComparePage = () => {
  const searchParams = useSearchParams();
  const marketsParam = searchParams.get("markets");

  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([
    "BTC-USD",
    "ETH-USD",
  ]);
  const [selectedHorizon, setSelectedHorizon] = useState("7D");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (marketsParam) {
      const markets = marketsParam.split(",").filter((m) => MARKET_DATA[m]);
      if (markets.length > 0) {
        const uniqueMarkets = [...new Set(markets)].slice(0, 5);
        if (uniqueMarkets.length === 1) {
          const otherMarket =
            uniqueMarkets[0] === "BTC-USD" ? "ETH-USD" : "BTC-USD";
          setSelectedMarkets([uniqueMarkets[0], otherMarket]);
        } else {
          setSelectedMarkets(uniqueMarkets);
        }
      }
    }
  }, [marketsParam]);

  const toggleMarket = (symbol: string) => {
    if (selectedMarkets.includes(symbol)) {
      if (selectedMarkets.length > 1) {
        setSelectedMarkets(selectedMarkets.filter((m) => m !== symbol));
      }
    } else if (selectedMarkets.length < 5) {
      setSelectedMarkets([...selectedMarkets, symbol]);
    }
    setIsDropdownOpen(false);
  };

  const removeMarket = (symbol: string) => {
    if (selectedMarkets.length > 1) {
      setSelectedMarkets(selectedMarkets.filter((m) => m !== symbol));
    }
  };

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
          availableMarkets={AVAILABLE_MARKETS}
          selectedMarkets={selectedMarkets}
          onToggleMarket={toggleMarket}
          selectedHorizon={selectedHorizon}
          onHorizonChange={setSelectedHorizon}
          horizons={HORIZONS}
          isDropdownOpen={isDropdownOpen}
          onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        <MarketChips
          selectedMarkets={selectedMarkets}
          onRemoveMarket={removeMarket}
        />

        <CompareCards
          selectedMarkets={selectedMarkets}
          marketData={MARKET_DATA}
          marketNames={MARKET_NAMES}
          selectedHorizon={selectedHorizon}
        />

        <CompareTable
          selectedMarkets={selectedMarkets}
          marketData={MARKET_DATA}
          horizons={HORIZONS}
        />
      </div>
    </AppLayout>
  );
};

export default ForecastsComparePage;
