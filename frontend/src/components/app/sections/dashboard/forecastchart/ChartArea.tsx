// components/app/sections/dashboard/forecastchart/ChartArea.tsx

"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { ForecastChart } from "@/lib/hooks/useForecastChart";

interface ChartAreaProps {
  forecast: ForecastChart;
  horizon: Horizon;
}

const ChartArea = ({ forecast, horizon }: ChartAreaProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const now = new Date();

  // Transform API data to chart format
  const chartData = forecast.points.map((point) => {
    const pointDate = new Date(point.timestamp);
    const isPast = pointDate < now;

    return {
      timestamp: point.timestamp,
      time: formatTimeShort(point.timestamp, horizon, isMobile),
      fullTime: formatTimeFull(point.timestamp, horizon),
      predicted: parseFloat(point.predicted_price),
      low: parseFloat(point.confidence_low),
      high: parseFloat(point.confidence_high),
      actual: point.actual_price ? parseFloat(point.actual_price) : null,
      isPast,
    };
  });

  const currentPrice = parseFloat(forecast.current_price);

  // Calculate Y axis domain with padding
  const allValues = chartData.flatMap((d) => [d.low, d.high, d.predicted]);
  allValues.push(currentPrice);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  // Calculate tick interval based on data length and screen size
  const getTickInterval = () => {
    const dataLength = chartData.length;
    if (isMobile) {
      // Show fewer ticks on mobile
      if (dataLength <= 12) return 2;
      if (dataLength <= 24) return 4;
      return 5;
    }
    // Desktop: original behavior - show more ticks
    return "preserveStartEnd";
  };

  // Responsive chart margins - Desktop unchanged, Mobile tighter
  const chartMargins = isMobile
    ? { top: 10, right: 10, left: -10, bottom: 10 }
    : { top: 20, right: 30, left: 20, bottom: 20 };

  return (
    <div className="h-[260px] w-full sm:h-[400px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={isMobile ? 260 : 400}
      >
        <AreaChart data={chartData} margin={chartMargins}>
          <defs>
            <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#04ec3a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#04ec3a" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="confidenceBandPast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="predictedLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#04ec3a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#04ec3a" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e5e5"
            className="dark:stroke-neutral-700"
            horizontal={true}
            vertical={!isMobile} // Hide vertical grid lines on mobile only
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={false}
            interval={getTickInterval()}
            className="text-neutral-500 dark:text-neutral-400"
          />

          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value, isMobile)}
            width={isMobile ? 45 : 60}
            className="text-neutral-500 dark:text-neutral-400"
          />

          <Tooltip content={<CustomTooltip isMobile={isMobile} />} />

          {/* Current price reference line - Hide label on mobile only */}
          <ReferenceLine
            y={currentPrice}
            stroke="#6b7280"
            strokeDasharray="5 5"
            label={
              isMobile
                ? undefined
                : {
                    value: `Current: ${formatPrice(currentPrice, false)}`,
                    position: "right",
                    fontSize: 10,
                    fill: "#6b7280",
                  }
            }
          />

          {/* Confidence band (low to high) */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="transparent"
            fill="url(#confidenceBand)"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="transparent"
            fill="var(--chart-bg, #ffffff)"
            fillOpacity={1}
            style={{ fill: "var(--chart-bg)" }}
            className="[--chart-bg:#ffffff] dark:[--chart-bg:#171717]"
          />

          {/* Predicted price line */}
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#04ec3a"
            strokeWidth={isMobile ? 1.5 : 2}
            fill="none"
            dot={(props: any) => {
              const { cx, cy, payload, index } = props;
              if (!cx || !cy) return null;

              // On mobile, show fewer dots to reduce clutter
              if (isMobile && index % 2 !== 0) return null;

              const dotSize = isMobile ? 3 : 4;
              const strokeWidth = isMobile ? 1 : 1.5;

              if (payload.isPast) {
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={dotSize}
                    fill="#9ca3af"
                    stroke="#fff"
                    strokeWidth={strokeWidth}
                  />
                );
              }
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={dotSize}
                  fill="#04ec3a"
                  stroke="#fff"
                  strokeWidth={strokeWidth}
                />
              );
            }}
            activeDot={{
              r: isMobile ? 5 : 6,
              fill: "#04ec3a",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />

          {/* Actual price line (if available) */}
          {chartData.some((d) => d.actual !== null) && (
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={isMobile ? 1.5 : 2}
              fill="none"
              dot={(props: any) => {
                const { cx, cy, payload, index } = props;
                if (!cx || !cy || payload.actual === null) return null;

                // On mobile, show fewer dots
                if (isMobile && index % 2 !== 0) return null;

                return (
                  <circle
                    key={`actual-dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isMobile ? 3 : 4}
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth={isMobile ? 1 : 1.5}
                  />
                );
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Format time for X-axis labels (short format)
const formatTimeShort = (
  timestamp: string,
  horizon: Horizon,
  isMobile: boolean
): string => {
  const date = new Date(timestamp);

  switch (horizon) {
    case "24H":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    case "30D":
      if (isMobile) {
        // Shorter format for mobile
        return date.toLocaleDateString("en-US", {
          day: "numeric",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "12W":
      if (isMobile) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "12M":
      if (isMobile) {
        return date.toLocaleDateString("en-US", {
          month: "short",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    default:
      return date.toLocaleDateString();
  }
};

// Format time for tooltip (full format like Binance) - UNCHANGED
const formatTimeFull = (timestamp: string, horizon: Horizon): string => {
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

// Format price for display - Desktop unchanged, Mobile more compact
const formatPrice = (value: number, isMobile: boolean = false): string => {
  if (value >= 10000) {
    return `$${(value / 1000).toFixed(isMobile ? 0 : 1)}k`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(isMobile ? 0 : 2)}`;
};

// Format price for tooltip (more precise) - UNCHANGED
const formatPriceFull = (value: number): string => {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Custom tooltip component - Desktop unchanged, Mobile smaller
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  isMobile?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  isMobile = false,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const now = new Date();
  const pointDate = new Date(data?.timestamp);
  const isPast = pointDate < now;

  // Desktop: original styling, Mobile: more compact
  if (!isMobile) {
    // DESKTOP - Original tooltip unchanged
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs font-medium text-neutral-900 dark:text-white">
            {data?.fullTime}
          </p>
          {isPast && (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              Past
            </span>
          )}
          {!isPast && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              Forecast
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPast ? "bg-neutral-400" : "bg-emerald-500"
                }`}
              />
              Predicted
            </span>
            <span
              className={`text-sm font-semibold ${
                isPast
                  ? "text-neutral-600 dark:text-neutral-300"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatPriceFull(data?.predicted)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Range
            </span>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {formatPriceFull(data?.low)} - {formatPriceFull(data?.high)}
            </span>
          </div>

          {data?.actual && (
            <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-1.5 dark:border-neutral-700">
              <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Actual
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {formatPriceFull(data?.actual)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MOBILE - Compact tooltip
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
      <div className="mb-1.5 flex items-center gap-1.5">
        <p className="text-[10px] font-medium text-neutral-900 dark:text-white">
          {data?.fullTime}
        </p>
        {isPast && (
          <span className="rounded bg-neutral-100 px-1 py-0.5 text-[8px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
            Past
          </span>
        )}
        {!isPast && (
          <span className="rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            Forecast
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPast ? "bg-neutral-400" : "bg-emerald-500"
              }`}
            />
            Predicted
          </span>
          <span
            className={`text-xs font-semibold ${
              isPast
                ? "text-neutral-600 dark:text-neutral-300"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatPriceFull(data?.predicted)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Range
          </span>
          <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
            {formatPriceFull(data?.low)} - {formatPriceFull(data?.high)}
          </span>
        </div>

        {data?.actual && (
          <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-1 dark:border-neutral-700">
            <span className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Actual
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {formatPriceFull(data?.actual)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartArea;
