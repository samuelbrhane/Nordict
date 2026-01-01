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
  // Transform API data to chart format
  const chartData = forecast.points.map((point) => ({
    timestamp: point.timestamp,
    time: formatTime(point.timestamp, horizon),
    predicted: parseFloat(point.predicted_price),
    low: parseFloat(point.confidence_low),
    high: parseFloat(point.confidence_high),
    actual: point.actual_price ? parseFloat(point.actual_price) : null,
  }));

  const currentPrice = parseFloat(forecast.current_price);

  // Calculate Y axis domain with padding
  const allValues = chartData.flatMap((d) => [d.low, d.high, d.predicted]);
  allValues.push(currentPrice);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#04ec3a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#04ec3a" stopOpacity={0.05} />
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
            dot={false}
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
              strokeDasharray="5 5"
              fill="none"
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Format time based on horizon
const formatTime = (timestamp: string, horizon: Horizon): string => {
  const date = new Date(timestamp);

  switch (horizon) {
    case "24H":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
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

// Format price for display
const formatPrice = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(2)}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
      <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            Predicted:{" "}
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ${data?.predicted?.toLocaleString()}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            Range:{" "}
          </span>
          <span className="font-medium text-neutral-900 dark:text-white">
            ${data?.low?.toLocaleString()} - ${data?.high?.toLocaleString()}
          </span>
        </p>
        {data?.actual && (
          <p className="text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">
              Actual:{" "}
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              ${data?.actual?.toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartArea;
