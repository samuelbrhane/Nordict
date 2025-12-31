"use client";

import { useState, useRef } from "react";
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
    "24H": { points: 24, label: "Hours" },
    "30D": { points: 30, label: "Days" },
    "12W": { points: 12, label: "Weeks" },
    "12M": { points: 12, label: "Months" },
  };
  return configs[horizon];
};

const formatPrice = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(2)}`;
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

  // Handle market selection
  const handleMarketSelect = (market: { symbol: string; name: string }) => {
    setSelectedMarket(market);
  };

  // If loading or error, show states
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

  // If no data
  if (data.length === 0) {
    return (
      <AnimatedCard delay={400}>
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">
            No performance data available yet
          </p>
        </div>
      </AnimatedCard>
    );
  }

  // Calculate chart bounds
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

  // Generate paths
  const predictedPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.predicted)}`)
    .join(" ");

  const actualPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.actual)}`)
    .join(" ");

  // X-axis labels
  const getXLabels = () => {
    const step = horizon === "24H" ? 4 : horizon === "30D" ? 5 : 2;
    return data
      .filter((_, i) => i % step === 0 || i === data.length - 1)
      .map((d) => ({
        index: d.index,
        label: d.label,
      }));
  };

  const xLabels = getXLabels();

  // Y-axis labels
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
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;

    const chartLeft = 60;
    const chartWidth = containerWidth - chartLeft - 20;

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
            {/* Left - Market selector and title */}
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
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Prediction vs Actual
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Past {config.points} {config.label.toLowerCase()} performance
                </p>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Direction Accuracy */}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    stats.directionAccuracy >= 70
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : stats.directionAccuracy >= 50
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 ${
                      stats.directionAccuracy >= 70
                        ? "text-emerald-600 dark:text-emerald-400"
                        : stats.directionAccuracy >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
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
                </span>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Direction
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {stats.directionAccuracy}% accurate
                  </p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

              {/* Avg Error */}
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Avg Error
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  ±{stats.avgError}%
                </p>
              </div>

              <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

              {/* Data Points */}
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
                <div className="flex w-[60px] shrink-0 flex-col justify-between py-2 pr-2 text-right">
                  {yLabels.map(({ label }, i) => (
                    <span
                      key={i}
                      className="text-xs text-neutral-400 dark:text-neutral-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Chart */}
                <div
                  className="relative flex-1"
                  style={{ height: "clamp(250px, 35vh, 450px)" }}
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
                    {/* Predicted Line */}
                    <path
                      d={predictedPath}
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Actual Line */}
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
                      className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                        activeIndex === i
                          ? "h-3 w-3 ring-4 ring-[var(--brand)]/20"
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
                      className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                        activeIndex === i
                          ? "h-3 w-3 ring-4 ring-blue-500/20"
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
              <div className="mt-3 flex w-full">
                <div className="w-[60px] shrink-0" />
                <div className="flex flex-1 justify-between">
                  {xLabels.map(({ index, label }) => (
                    <span
                      key={index}
                      className="text-xs text-neutral-400 dark:text-neutral-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="pointer-events-none absolute z-20 min-w-[200px] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
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
                  <div className="mb-2 border-b border-neutral-100 pb-2 dark:border-neutral-700">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {tooltip.point.label}
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
                        {formatPrice(tooltip.point.predicted)}
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
                        {formatPrice(tooltip.point.actual)}
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
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Predicted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: "#3b82f6" }}
                  />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
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
