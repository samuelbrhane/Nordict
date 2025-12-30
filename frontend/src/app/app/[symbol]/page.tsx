"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";
import { AnimatedCard } from "@/components/app/sections/dashboard";
import {
  MarketHeader,
  ForecastSummary,
  MarketForecastChart,
  HorizonTable,
  HistoricalAccuracy,
  RelatedAlerts,
} from "@/components/app/sections/forecasts";

const MARKETS: Record<
  string,
  {
    name: string;
    category: string;
    currentPrice: string;
    change24h: string;
    changeDirection: "up" | "down";
  }
> = {
  "BTC-USD": {
    name: "Bitcoin",
    category: "Crypto",
    currentPrice: "$95,420",
    change24h: "+2.4%",
    changeDirection: "up",
  },
  "ETH-USD": {
    name: "Ethereum",
    category: "Crypto",
    currentPrice: "$3,450",
    change24h: "+1.8%",
    changeDirection: "up",
  },
  "SOL-USD": {
    name: "Solana",
    category: "Crypto",
    currentPrice: "$142.30",
    change24h: "-0.6%",
    changeDirection: "down",
  },
  "AVAX-USD": {
    name: "Avalanche",
    category: "Crypto",
    currentPrice: "$38.50",
    change24h: "+3.1%",
    changeDirection: "up",
  },
  "LINK-USD": {
    name: "Chainlink",
    category: "Crypto",
    currentPrice: "$14.20",
    change24h: "-1.2%",
    changeDirection: "down",
  },
  "DOT-USD": {
    name: "Polkadot",
    category: "Crypto",
    currentPrice: "$7.85",
    change24h: "+0.9%",
    changeDirection: "up",
  },
  "MATIC-USD": {
    name: "Polygon",
    category: "Crypto",
    currentPrice: "$0.89",
    change24h: "+0.4%",
    changeDirection: "up",
  },
  "UNI-USD": {
    name: "Uniswap",
    category: "Crypto",
    currentPrice: "$12.40",
    change24h: "+2.1%",
    changeDirection: "up",
  },
  "EUR-USD": {
    name: "Euro / US Dollar",
    category: "Forex",
    currentPrice: "$1.0892",
    change24h: "+0.12%",
    changeDirection: "up",
  },
  "GBP-USD": {
    name: "British Pound",
    category: "Forex",
    currentPrice: "$1.2534",
    change24h: "-0.08%",
    changeDirection: "down",
  },
  "GOLD-USD": {
    name: "Gold",
    category: "Commodities",
    currentPrice: "$2,065.40",
    change24h: "+0.35%",
    changeDirection: "up",
  },
  "OIL-USD": {
    name: "Crude Oil",
    category: "Commodities",
    currentPrice: "$71.82",
    change24h: "-1.45%",
    changeDirection: "down",
  },
};

const HORIZON_FORECASTS = [
  {
    horizon: "1D",
    direction: "up" as const,
    change: "+1.2%",
    confidence: 68,
    range: "$94,200 – $97,800",
  },
  {
    horizon: "7D",
    direction: "up" as const,
    change: "+4.2%",
    confidence: 78,
    range: "$93,500 – $102,400",
  },
  {
    horizon: "30D",
    direction: "up" as const,
    change: "+8.5%",
    confidence: 65,
    range: "$89,000 – $115,000",
  },
  {
    horizon: "90D",
    direction: "up" as const,
    change: "+15.2%",
    confidence: 52,
    range: "$82,000 – $135,000",
  },
];

const HISTORICAL_RECORDS = [
  {
    date: "Dec 20",
    predicted: "+3.2%",
    actual: "+2.8%",
    accuracy: "hit" as const,
    confidence: 72,
  },
  {
    date: "Dec 13",
    predicted: "+1.5%",
    actual: "+1.9%",
    accuracy: "hit" as const,
    confidence: 68,
  },
  {
    date: "Dec 6",
    predicted: "-2.1%",
    actual: "-1.4%",
    accuracy: "hit" as const,
    confidence: 65,
  },
  {
    date: "Nov 29",
    predicted: "+4.0%",
    actual: "+5.2%",
    accuracy: "hit" as const,
    confidence: 71,
  },
  {
    date: "Nov 22",
    predicted: "+2.5%",
    actual: "-0.8%",
    accuracy: "miss" as const,
    confidence: 58,
  },
];

const RELATED_ALERTS = [
  {
    id: 1,
    condition: "Confidence > 75%",
    horizon: "7D",
    status: "active" as const,
    lastTriggered: "2 days ago",
  },
  {
    id: 2,
    condition: "Price exits range",
    horizon: "1D",
    status: "active" as const,
    lastTriggered: "Never",
  },
];

const MarketDetailPage = ({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) => {
  const { symbol } = use(params);
  const [selectedHorizon, setSelectedHorizon] = useState("7D");

  const market = MARKETS[symbol] || {
    name: symbol,
    category: "Unknown",
    currentPrice: "N/A",
    change24h: "N/A",
    changeDirection: "up" as const,
  };
  const currentForecast =
    HORIZON_FORECASTS.find((f) => f.horizon === selectedHorizon) ||
    HORIZON_FORECASTS[1];

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
              {symbol}
            </span>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {symbol}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {market.name} · {market.category}
            </p>
          </div>
        </AnimatedCard>

        <MarketHeader
          symbol={symbol}
          name={market.name}
          category={market.category}
          currentPrice={market.currentPrice}
          change24h={market.change24h}
          changeDirection={market.changeDirection}
          lastUpdated="2 min ago"
        />

        <ForecastSummary
          direction={currentForecast.direction}
          expectedRange={currentForecast.range}
          confidence={currentForecast.confidence}
          expectedChange={currentForecast.change}
        />

        <HorizonTable
          forecasts={HORIZON_FORECASTS}
          currentHorizon={selectedHorizon}
          onHorizonChange={setSelectedHorizon}
        />

        <MarketForecastChart
          symbol={symbol}
          horizon={selectedHorizon as "1D" | "7D" | "30D"}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <HistoricalAccuracy
            records={HISTORICAL_RECORDS}
            overallAccuracy={80}
          />
          <RelatedAlerts alerts={RELATED_ALERTS} symbol={symbol} />
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketDetailPage;
