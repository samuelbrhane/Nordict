"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AppLayout, LoadingSpinner } from "@/components/app";
import { AnimatedCard } from "@/components/app/sections/dashboard";
import {
  MarketHeader,
  ForecastSummary,
  HorizonTable,
  RelatedAlerts,
} from "@/components/app/sections/forecasts";
import { useMarketDetail } from "@/lib/hooks/useMarketDetail";
import { useMarketAlerts } from "@/lib/hooks/useAlerts";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { ForecastChart } from "@/components/app/sections/dashboard/forecastchart";

const MarketDetailPage = ({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) => {
  const { symbol } = use(params);
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>("24H");

  const { data, isLoading, error } = useMarketDetail(symbol);
  const { data: alerts, isLoading: alertsLoading } = useMarketAlerts(symbol);

  // Get current forecast for selected horizon
  const currentForecast = data?.forecasts.find(
    (f) => f.horizon === selectedHorizon
  );

  // Calculate expected change for selected horizon
  const expectedChange = currentForecast
    ? (
        ((currentForecast.predicted_mid - currentForecast.current_price) /
          currentForecast.current_price) *
        100
      ).toFixed(2)
    : "0";

  // Format last updated
  const getLastUpdatedAgo = () => {
    if (!currentForecast) return "N/A";
    const generated = new Date(currentForecast.generated_at);
    const now = new Date();
    const diffMs = now.getTime() - generated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <LoadingSpinner text="Loading market..." />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout title="" subtitle="">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error || "Market not found"}
        </div>
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
              {symbol}
            </span>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {symbol}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {data.name} · {data.category}
            </p>
          </div>
        </AnimatedCard>

        <MarketHeader
          symbol={symbol}
          name={data.name}
          category={data.category}
          currentPrice={data.current_price}
          lastUpdatedAgo={getLastUpdatedAgo()}
        />

        {currentForecast && (
          <ForecastSummary
            direction={currentForecast.direction}
            expectedRange={`$${Number(
              currentForecast.predicted_low
            ).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} – $${Number(currentForecast.predicted_high).toLocaleString(
              undefined,
              { maximumFractionDigits: 2 }
            )}`}
            confidence={Math.round(currentForecast.confidence_score * 100)}
            expectedChange={`${
              parseFloat(expectedChange) >= 0 ? "+" : ""
            }${expectedChange}%`}
          />
        )}

        <HorizonTable
          forecasts={data.forecasts.map((f) => ({
            horizon: f.horizon,
            direction: f.direction,
            change: `${
              ((f.predicted_mid - f.current_price) / f.current_price) * 100 >= 0
                ? "+"
                : ""
            }${(
              ((f.predicted_mid - f.current_price) / f.current_price) *
              100
            ).toFixed(2)}%`,
            confidence: Math.round(f.confidence_score * 100),
            range: `$${Number(f.predicted_low).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} – $${Number(f.predicted_high).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`,
          }))}
          currentHorizon={selectedHorizon}
          onHorizonChange={(h) => setSelectedHorizon(h as Horizon)}
        />

        <ForecastChart
          horizon={selectedHorizon}
          fixedMarket={{ symbol: symbol, name: data.name }}
        />

        <RelatedAlerts
          alerts={alerts}
          symbol={symbol}
          isLoading={alertsLoading}
        />
      </div>
    </AppLayout>
  );
};

export default MarketDetailPage;
