"use client";

import { useState, useRef, useEffect } from "react";
import AnimatedCard from "../AnimatedCard";
import MarketSelectorModal from "./MarketSelectorModal";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import {
  useForecastPerformance,
  PerformanceDataPoint,
} from "@/lib/hooks/useForecastPerformance";

interface PerformanceChartProps {
  horizon: Horizon;
}

interface TooltipData {
  x: number;
  point: PerformanceDataPoint;
}

const getHorizonConfig = (horizon: Horizon) => {
  const configs = {
    "24H": { points: 48, label: "Hours", periodLabel: "Past 48 hours" },
    "30D": { points: 30, label: "Days", periodLabel: "Past 30 days" },
    "12W": { points: 12, label: "Weeks", periodLabel: "Past 12 weeks" },
    "12M": { points: 12, label: "Months", periodLabel: "Past 12 months" },
  };
  return configs[horizon];
};

const formatPrice = (value: number): string => {
  if (value >= 10000) {
    return `$${(value / 1000).toFixed(2)}k`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(3)}k`;
  }
  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }
  return `$${value.toFixed(3)}`;
};

const formatPriceFull = (value: number): string => {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format timestamp for tooltip (full format like Binance)
const formatTimestampFull = (timestamp: string, horizon: Horizon): string => {
  const date = new Date(timestamp);

  switch (horizon) {
    case "24H":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    case "30D":
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "12W":
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "12M":
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    default:
      return date.toLocaleDateString();
  }
};

// Format timestamp for X-axis labels (shorter but with date context)
const formatTimestampShort = (timestamp: string, horizon: Horizon): string => {
  const date = new Date(timestamp);

  switch (horizon) {
    case "24H":
      // Show "Jan 2, 2AM" format for clarity
      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          hour12: true,
        })
        .replace(",", "");
    case "30D":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "12W":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "12M":
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    default:
      return date.toLocaleDateString();
  }
};

const PerformanceChart = ({ horizon }: PerformanceChartProps) => {
  const [selectedMarket, setSelectedMarket] = useState({
    symbol: "BTC-USD",
    name: "Bitcoin",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: performance,
    isLoading,
    error,
  } = useForecastPerformance(horizon, selectedMarket.symbol);

  const config = getHorizonConfig(horizon);

  const handleMarketSelect = (market: { symbol: string; name: string }) => {
    setSelectedMarket(market);
  };

  if (isLoading) {
    return (
      <AnimatedCard delay={400}>
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-500" />
        </div>
      </AnimatedCard>
    );
  }

  if (error) {
    return (
      <AnimatedCard delay={400}>
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </AnimatedCard>
    );
  }

  const data = performance?.points || [];
  const stats = performance?.stats || {
    avgError: 0,
    directionAccuracy: 0,
    totalPoints: 0,
  };

  if (data.length === 0) {
    return (
      <>
        <MarketSelectorModal
          selected={selectedMarket}
          onSelect={handleMarketSelect}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <AnimatedCard delay={400}>
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-4 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:p-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  {selectedMarket.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedMarket.symbol}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedMarket.name}
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
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Prediction vs Actual
              </p>
            </div>

            <div className="flex h-[300px] items-center justify-center">
              <p className="text-neutral-500 dark:text-neutral-400">
                No performance data available yet for {selectedMarket.symbol} (
                {horizon})
              </p>
            </div>
          </div>
        </AnimatedCard>
      </>
    );
  }

  const allValues = data.flatMap((d) => [d.predicted, d.actual]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;
  const padding = range * 0.15;

  const paddedMax = maxValue + padding;
  const paddedMin = minValue - padding;
  const paddedRange = paddedMax - paddedMin;

  const getY = (value: number) => {
    return 100 - ((value - paddedMin) / paddedRange) * 100;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * 100;
  };

  const predictedPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.predicted)}`)
    .join(" ");

  const actualPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.actual)}`)
    .join(" ");

  // X-axis labels - use actual timestamps, show fewer labels
  const getXLabels = () => {
    const totalPoints = data.length;
    let step: number;

    // Show 5-6 labels max for readability
    if (totalPoints <= 12) {
      step = 2;
    } else if (totalPoints <= 24) {
      step = 4;
    } else if (totalPoints <= 30) {
      step = 6;
    } else {
      step = Math.ceil(totalPoints / 5);
    }

    const labels: { index: number; label: string; x: number }[] = [];

    // Always include first point
    labels.push({
      index: 0,
      label: formatTimestampShort(data[0].timestamp, horizon),
      x: 0,
    });

    // Add intermediate points
    for (let i = step; i < totalPoints - 1; i += step) {
      labels.push({
        index: i,
        label: formatTimestampShort(data[i].timestamp, horizon),
        x: getX(i),
      });
    }

    // Always include last point
    if (totalPoints > 1) {
      labels.push({
        index: totalPoints - 1,
        label: formatTimestampShort(data[totalPoints - 1].timestamp, horizon),
        x: 100,
      });
    }

    return labels;
  };

  const xLabels = getXLabels();

  const yLabels = [
    { value: paddedMax, label: formatPrice(paddedMax) },
    {
      value: paddedMin + paddedRange * 0.75,
      label: formatPrice(paddedMin + paddedRange * 0.75),
    },
    {
      value: paddedMin + paddedRange * 0.5,
      label: formatPrice(paddedMin + paddedRange * 0.5),
    },
    {
      value: paddedMin + paddedRange * 0.25,
      label: formatPrice(paddedMin + paddedRange * 0.25),
    },
    { value: paddedMin, label: formatPrice(paddedMin) },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || data.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;

    const chartLeft = 60;
    const chartRight = 20;
    const chartWidth = containerWidth - chartLeft - chartRight;

    if (x >= chartLeft && x <= chartLeft + chartWidth) {
      const normalizedX = (x - chartLeft) / chartWidth;
      const index = Math.round(normalizedX * (data.length - 1));
      const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex);
        setTooltip({
          x: chartLeft + (clampedIndex / (data.length - 1)) * chartWidth,
          point: data[clampedIndex],
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    setTooltip(null);
  };

  // Get date range for subtitle
  const getDateRange = () => {
    if (data.length === 0) return "";
    const firstDate = new Date(data[0].timestamp);
    const lastDate = new Date(data[data.length - 1].timestamp);

    const formatDate = (d: Date) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    return `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
  };

  return (
    <>
      <MarketSelectorModal
        selected={selectedMarket}
        onSelect={handleMarketSelect}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AnimatedCard delay={400}>
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  {selectedMarket.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedMarket.symbol}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedMarket.name}
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

              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Prediction vs Actual
                  </p>
                  <span className="text-xs text-neutral-400">•</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {config.periodLabel}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {getDateRange()} • {stats.totalPoints} data points
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Avg Error
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  ±{stats.avgError}%
                </p>
              </div>

              <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Data Points
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {stats.totalPoints}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile info */}
          <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-800 sm:hidden">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {getDateRange()} • {stats.totalPoints} data points
            </p>
          </div>

          {/* Chart Area */}
          <div className="p-4 sm:p-6">
            <div
              ref={containerRef}
              className="relative w-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex w-full">
                {/* Y-Axis Labels */}
                <div className="flex w-[50px] shrink-0 flex-col justify-between py-2 pr-2 text-right sm:w-[60px]">
                  {yLabels.map(({ label }, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-neutral-400 dark:text-neutral-500 sm:text-xs"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Chart */}
                <div
                  className="relative flex-1"
                  style={{ height: "clamp(200px, 35vh, 450px)" }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-t border-neutral-100 dark:border-neutral-800"
                        style={{ top: `${i * 25}%` }}
                      />
                    ))}
                  </div>

                  {/* SVG Chart */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                  >
                    <path
                      d={predictedPath}
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={actualPath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Data Points - Predicted */}
                  {data.map((d, i) => (
                    <div
                      key={`predicted-${i}`}
                      className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 sm:h-2 sm:w-2 ${
                        activeIndex === i
                          ? "!h-3 !w-3 ring-4 ring-[var(--brand)]/20"
                          : ""
                      }`}
                      style={{
                        left: `${getX(i)}%`,
                        top: `${getY(d.predicted)}%`,
                        backgroundColor: "var(--brand)",
                      }}
                    />
                  ))}

                  {/* Data Points - Actual */}
                  {data.map((d, i) => (
                    <div
                      key={`actual-${i}`}
                      className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 sm:h-2 sm:w-2 ${
                        activeIndex === i
                          ? "!h-3 !w-3 ring-4 ring-blue-500/20"
                          : ""
                      }`}
                      style={{
                        left: `${getX(i)}%`,
                        top: `${getY(d.actual)}%`,
                        backgroundColor: "#3b82f6",
                      }}
                    />
                  ))}

                  {/* Hover Line */}
                  {activeIndex !== null && (
                    <div
                      className="absolute top-0 h-full w-px bg-neutral-300 dark:bg-neutral-600"
                      style={{ left: `${getX(activeIndex)}%` }}
                    />
                  )}
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="relative ml-[50px] mt-2 sm:ml-[60px] sm:mt-3">
                <div className="relative h-4">
                  {xLabels.map(({ index, label, x }) => (
                    <span
                      key={index}
                      className="absolute text-[9px] text-neutral-400 dark:text-neutral-500 sm:text-[10px]"
                      style={{
                        left: `${x}%`,
                        transform:
                          x === 0
                            ? "translateX(0)"
                            : x === 100
                            ? "translateX(-100%)"
                            : "translateX(-50%)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-20 min-w-[200px] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-800 sm:min-w-[220px]"
                  style={{
                    left: tooltip.x,
                    top: "20px",
                    transform:
                      tooltip.x > (containerRef.current?.offsetWidth || 0) * 0.7
                        ? "translateX(-100%)"
                        : tooltip.x <
                          (containerRef.current?.offsetWidth || 0) * 0.3
                        ? "translateX(0)"
                        : "translateX(-50%)",
                  }}
                >
                  {/* Full timestamp header */}
                  <div className="mb-2 border-b border-neutral-100 pb-2 dark:border-neutral-700">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatTimestampFull(tooltip.point.timestamp, horizon)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Predicted
                        </span>
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatPriceFull(tooltip.point.predicted)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Actual
                        </span>
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatPriceFull(tooltip.point.actual)}
                      </span>
                    </div>

                    <div className="border-t border-neutral-100 pt-2 dark:border-neutral-700">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          Error
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            Math.abs(tooltip.point.errorPercent) <= 2
                              ? "text-emerald-500"
                              : Math.abs(tooltip.point.errorPercent) <= 5
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          {tooltip.point.errorPercent > 0 ? "+" : ""}
                          {tooltip.point.errorPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:mt-6 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-4 rounded-full sm:w-6"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 sm:text-xs">
                    Predicted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-4 rounded-full sm:w-6"
                    style={{ backgroundColor: "#3b82f6" }}
                  />
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 sm:text-xs">
                    Actual
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </>
  );
};

export default PerformanceChart;
