"use client";

import { useState, useEffect } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";
import { api } from "@/lib/api";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

interface MarketForecastChartProps {
  symbol: string;
  horizon: Horizon;
}

interface ChartPoint {
  step: number;
  timestamp: string;
  predicted_price: number | string;
  confidence_low: number | string;
  confidence_high: number | string;
  confidence_score: number | string;
}

interface ChartData {
  market: string;
  horizon: string;
  current_price: number | string;
  direction: string;
  confidence_score: number | string;
  predicted_low: number | string;
  predicted_mid: number | string;
  predicted_high: number | string;
  points: ChartPoint[];
}

const toNumber = (val: number | string): number => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(num) ? 0 : num;
};

const formatValue = (val: number | string): string => {
  const num = toNumber(val);

  if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
  if (num >= 1) return `$${num.toFixed(2)}`;
  return `$${num.toFixed(4)}`;
};

const MarketForecastChart = ({ symbol, horizon }: MarketForecastChartProps) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ChartData>(
          `/api/v1/forecasts/chart/?market=${symbol}&horizon=${horizon}`
        );
        setData(response);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setError("Failed to load chart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, horizon]);

  if (isLoading) {
    return (
      <AnimatedCard delay={200}>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-500" />
        </div>
      </AnimatedCard>
    );
  }

  if (error || !data || data.points.length === 0) {
    return (
      <AnimatedCard delay={200}>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">
            {error || "No chart data available"}
          </p>
        </div>
      </AnimatedCard>
    );
  }

  const points = data.points;
  const currentPrice = toNumber(data.current_price);

  // Calculate chart bounds - convert all to numbers
  const allValues = points.flatMap((p) => [
    toNumber(p.predicted_price),
    toNumber(p.confidence_high),
    toNumber(p.confidence_low),
  ]);
  const maxValue = Math.max(...allValues, currentPrice);
  const minValue = Math.min(...allValues, currentPrice);
  const range = maxValue - minValue;
  const padding = range * 0.1;
  const paddedMax = maxValue + padding;
  const paddedMin = minValue - padding;
  const paddedRange = paddedMax - paddedMin;

  const getY = (value: number | string): number => {
    const num = toNumber(value);
    return 180 - ((num - paddedMin) / paddedRange) * 160;
  };

  const getX = (index: number): number => {
    return (index / (points.length - 1)) * 100;
  };

  // Generate paths
  const forecastPath = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${getX(i)}% ${getY(p.predicted_price)}`
    )
    .join(" ");

  const bandPath =
    points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${getX(i)}% ${getY(p.confidence_high)}`
      )
      .join(" ") +
    " " +
    [...points]
      .reverse()
      .map(
        (p, i) => `L ${getX(points.length - 1 - i)}% ${getY(p.confidence_low)}`
      )
      .join(" ") +
    " Z";

  // Current price line
  const currentPriceY = getY(currentPrice);

  const getHorizonLabel = (): string => {
    switch (horizon) {
      case "24H":
        return "24 hour";
      case "30D":
        return "30 day";
      case "12W":
        return "12 week";
      case "12M":
        return "12 month";
      default:
        return horizon;
    }
  };

  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Price Forecast
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {getHorizonLabel()} forecast with confidence band
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full bg-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400">
                Current
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="text-neutral-500 dark:text-neutral-400">
                Forecast
              </span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <span
                className="h-3 w-4 rounded-sm opacity-30"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="text-neutral-500 dark:text-neutral-400">
                Confidence
              </span>
            </div>
          </div>
        </div>
        <div className="relative h-48 w-full sm:h-64">
          <svg
            viewBox="0 0 100 200"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0%"
                y1={20 + i * 40}
                x2="100%"
                y2={20 + i * 40}
                stroke="currentColor"
                strokeOpacity={0.1}
                className="text-neutral-300 dark:text-neutral-700"
              />
            ))}

            {/* Confidence band */}
            <path d={bandPath} fill="var(--brand)" fillOpacity={0.1} />

            {/* Current price line */}
            <line
              x1="0%"
              y1={currentPriceY}
              x2="100%"
              y2={currentPriceY}
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="2,2"
              className="text-neutral-400 dark:text-neutral-500"
            />

            {/* Forecast line */}
            <path
              d={forecastPath}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-[10px] text-neutral-400">
            <span>{formatValue(paddedMax)}</span>
            <span>{formatValue((paddedMax + paddedMin) / 2)}</span>
            <span>{formatValue(paddedMin)}</span>
          </div>

          {/* Current price label */}
          <div
            className="absolute right-0 text-[10px] text-neutral-500 dark:text-neutral-400"
            style={{
              top: `${(currentPriceY / 200) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            Current: {formatValue(currentPrice)}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
          <span>Now</span>
          <span>
            +
            {horizon === "24H"
              ? "24h"
              : horizon === "30D"
              ? "30d"
              : horizon === "12W"
              ? "12w"
              : "12m"}
          </span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default MarketForecastChart;
