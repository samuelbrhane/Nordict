// components/app/sections/dashboard/forecastchart/ChartArea.tsx

"use client";

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
  const now = new Date();

  // Transform API data to chart format
  const chartData = forecast.points.map((point) => {
    const pointDate = new Date(point.timestamp);
    const isPast = pointDate < now;

    return {
      timestamp: point.timestamp,
      time: formatTimeShort(point.timestamp, horizon),
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

  // Find the index where past meets future for visual split
  const pastFutureIndex = chartData.findIndex((d) => !d.isPast);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
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
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-neutral-500 dark:text-neutral-400"
          />

          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value)}
            className="text-neutral-500 dark:text-neutral-400"
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Current price reference line */}
          <ReferenceLine
            y={currentPrice}
            stroke="#6b7280"
            strokeDasharray="5 5"
            label={{
              value: `Current: ${formatPrice(currentPrice)}`,
              position: "right",
              fontSize: 10,
              fill: "#6b7280",
            }}
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
            strokeWidth={2}
            fill="none"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (!cx || !cy) return null;

              // Different dot style for past vs future predictions
              if (payload.isPast) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#9ca3af"
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                );
              }
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#04ec3a"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              );
            }}
            activeDot={{
              r: 6,
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
              strokeWidth={2}
              fill="none"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy || payload.actual === null) return null;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth={1.5}
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
const formatTimeShort = (timestamp: string, horizon: Horizon): string => {
  const date = new Date(timestamp);

  switch (horizon) {
    case "24H":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
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

// Format time for tooltip (full format like Binance)
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

// Format price for display
const formatPrice = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(2)}`;
};

// Format price for tooltip (more precise)
const formatPriceFull = (value: number): string => {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const now = new Date();
  const pointDate = new Date(data?.timestamp);
  const isPast = pointDate < now;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
      {/* Full timestamp */}
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
};

export default ChartArea;
