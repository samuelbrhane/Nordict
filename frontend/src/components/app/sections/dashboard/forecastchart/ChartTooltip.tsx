// components/app/sections/dashboard/forecastchart/ChartTooltip.tsx

"use client";

import { ForecastDataPoint, formatPrice } from "./utils";

interface ChartTooltipProps {
  point: ForecastDataPoint;
  x: number;
  containerWidth: number;
  isPast: boolean;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 70) return "#10b981";
  if (confidence >= 50) return "#f59e0b";
  return "#ef4444";
};

const ChartTooltip = ({
  point,
  x,
  containerWidth,
  isPast,
}: ChartTooltipProps) => {
  const getTransform = () => {
    if (x > containerWidth * 0.7) return "translateX(-100%)";
    if (x < containerWidth * 0.3) return "translateX(0)";
    return "translateX(-50%)";
  };

  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[180px] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
      style={{
        left: x,
        top: "20px",
        transform: getTransform(),
      }}
    >
      {/* Header */}
      <div className="mb-2 border-b border-neutral-100 pb-2 dark:border-neutral-700">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            {point.label}
          </p>
          {isPast && (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              PAST
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Forecast
          </span>
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {formatPrice(point.forecast)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Range
          </span>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
            {formatPrice(point.lower)} – {formatPrice(point.upper)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Confidence
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${point.confidence}%`,
                  backgroundColor: getConfidenceColor(point.confidence),
                }}
              />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: getConfidenceColor(point.confidence) }}
            >
              {point.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTooltip;
