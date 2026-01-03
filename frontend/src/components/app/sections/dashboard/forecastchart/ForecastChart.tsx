"use client";

import { useState, useEffect } from "react";
import AnimatedCard from "../AnimatedCard";
import MarketSelectorModal from "./MarketSelectorModal";
import ChartArea from "./ChartArea";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { useForecastChart } from "@/lib/hooks/useForecastChart";

interface ForecastChartProps {
  horizon: Horizon;
  fixedMarket?: { symbol: string; name: string }; // Optional: if provided, hide selector
}

const getHorizonConfig = (horizon: Horizon) => {
  const configs = {
    "24H": { points: 24, label: "Hours" },
    "30D": { points: 30, label: "Days" },
    "12W": { points: 12, label: "Weeks" },
    "12M": { points: 12, label: "Months" },
  };
  return configs[horizon];
};

const ForecastChart = ({ horizon, fixedMarket }: ForecastChartProps) => {
  const [selectedMarket, setSelectedMarket] = useState({
    symbol: "BTC-USD",
    name: "Bitcoin",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Use fixed market if provided, otherwise use selected
  const market = fixedMarket || selectedMarket;

  const {
    data: forecast,
    isLoading,
    error,
  } = useForecastChart(horizon, market.symbol);

  const config = getHorizonConfig(horizon);

  // Handle market selection from modal
  const handleMarketSelect = (market: { symbol: string; name: string }) => {
    setSelectedMarket(market);
    setIsModalOpen(false);
  };

  // Format direction for display
  const getDirectionDisplay = (direction?: string) => {
    if (!direction) return "Neutral";
    return direction.charAt(0).toUpperCase() + direction.slice(1);
  };

  // Get direction styling
  const getDirectionStyle = (direction?: string) => {
    switch (direction) {
      case "up":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-600 dark:text-emerald-400",
          rotate: "",
        };
      case "down":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400",
          rotate: "rotate-180",
        };
      default:
        return {
          bg: "bg-neutral-100 dark:bg-neutral-700",
          text: "text-neutral-500",
          rotate: "rotate-90",
        };
    }
  };

  // Format current time
  const formatCurrentTime = () => {
    return currentTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format forecast generated time
  const formatGeneratedTime = (timestamp?: string) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const directionStyle = getDirectionStyle(forecast?.direction);

  return (
    <>
      {/* Market Selector Modal - only show if no fixedMarket */}
      {!fixedMarket && (
        <MarketSelectorModal
          selected={selectedMarket}
          onSelect={handleMarketSelect}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <AnimatedCard delay={350}>
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            {/* Left - Market selector/display and title */}
            <div className="flex items-center gap-4">
              {/* Market Selector Button or Fixed Display */}
              {fixedMarket ? (
                // Fixed market display (no button)
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-800">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {market.symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {market.name}
                    </p>
                  </div>
                </div>
              ) : (
                // Clickable market selector
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {market.symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {market.name}
                    </p>
                  </div>
                  <svg
                    className="ml-1 h-4 w-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </button>
              )}

              {/* Title and Time Info */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Price Forecast
                  </p>
                  <span className="text-xs text-neutral-400">•</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatCurrentTime()}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Next {config.points} {config.label.toLowerCase()} with
                  confidence bands
                  {forecast?.generated_at && (
                    <span className="ml-1">
                      • Updated {formatGeneratedTime(forecast.generated_at)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right - Summary stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              ) : error ? (
                <span className="text-sm text-red-500">Error loading data</span>
              ) : (
                <>
                  {/* Direction */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${directionStyle.bg}`}
                    >
                      <svg
                        className={`h-4 w-4 ${directionStyle.text} ${directionStyle.rotate}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Direction
                      </p>
                      <p
                        className={`text-sm font-semibold ${directionStyle.text}`}
                      >
                        {getDirectionDisplay(forecast?.direction)}
                      </p>
                    </div>
                  </div>

                  <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

                  {/* Confidence */}
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Confidence
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {forecast?.confidence_score
                        ? `${(forecast.confidence_score * 100).toFixed(0)}%`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

                  {/* Range */}
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Range
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {forecast?.price_range || "N/A"}
                    </p>
                  </div>

                  <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

                  {/* Change */}
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Predicted Change
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        (forecast?.change_percent || 0) > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : (forecast?.change_percent || 0) < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      {forecast?.change_percent
                        ? `${
                            forecast.change_percent > 0 ? "+" : ""
                          }${forecast.change_percent.toFixed(2)}%`
                        : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile time info */}
          <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-800 sm:hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Current: {formatCurrentTime()}
              </p>
              {forecast?.generated_at && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Updated: {formatGeneratedTime(forecast.generated_at)}
                </p>
              )}
            </div>
          </div>

          {/* Chart Area */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-500" />
              </div>
            ) : error ? (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-red-500">Failed to load chart: {error}</p>
              </div>
            ) : forecast ? (
              <ChartArea forecast={forecast} horizon={horizon} />
            ) : (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-neutral-500">No forecast data available</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Predicted (Future)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Predicted (Past)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Actual Price
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-4 border-b-2 border-dashed border-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Current Price
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </>
  );
};

export default ForecastChart;
