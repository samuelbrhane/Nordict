// components/app/sections/dashboard/forecastchart/ChartArea.tsx

"use client";

import { useState, useRef, useMemo } from "react";
import { ForecastDataPoint, Horizon, formatPrice } from "./utils";
import { ChartTooltip, ChartLegend, ChartSVG } from ".";

interface ChartAreaProps {
  data: ForecastDataPoint[];
  horizon: Horizon;
}

const ChartArea = ({ data, horizon }: ChartAreaProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if any data points are in the past
  const hasPastData = useMemo(() => {
    return data.some((d) => d.timestamp < new Date());
  }, [data]);

  // Calculate chart bounds
  const { paddedMax, paddedMin, paddedRange } = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.upper));
    const minValue = Math.min(...data.map((d) => d.lower));
    const range = maxValue - minValue;
    const padding = range * 0.15;

    return {
      paddedMax: maxValue + padding,
      paddedMin: minValue - padding,
      paddedRange: maxValue - minValue + padding * 2,
    };
  }, [data]);

  const getY = (value: number) => {
    return 100 - ((value - paddedMin) / paddedRange) * 100;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * 100;
  };

  // X-axis labels
  const xLabels = useMemo(() => {
    if (horizon === "24H") {
      return data
        .filter((_, i) => i % 4 === 0 || i === data.length - 1)
        .map((d) => ({
          index: d.index,
          label: d.label,
        }));
    } else if (horizon === "30D") {
      return data
        .filter((_, i) => i % 5 === 0 || i === data.length - 1)
        .map((d) => ({
          index: d.index,
          label: d.label,
        }));
    } else if (horizon === "12W") {
      return data
        .filter((_, i) => i % 2 === 0 || i === data.length - 1)
        .map((d) => ({
          index: d.index,
          label: d.label,
        }));
    } else {
      return data
        .filter((_, i) => i % 2 === 0 || i === data.length - 1)
        .map((d) => ({
          index: d.index,
          label: d.label,
        }));
    }
  }, [data, horizon]);

  // Y-axis labels
  const yLabels = useMemo(
    () => [
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
    ],
    [paddedMax, paddedMin, paddedRange]
  );

  // Mouse handlers
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
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Tooltip position
  const tooltipX =
    activeIndex !== null
      ? 60 +
        (activeIndex / (data.length - 1)) *
          ((containerRef.current?.offsetWidth || 0) - 80)
      : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Chart Container */}
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

        {/* Chart Area */}
        <div
          className="relative flex-1"
          style={{ height: "clamp(200px, 40vh, 400px)" }}
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

          {/* SVG Chart and Data Points */}
          <ChartSVG
            data={data}
            getX={getX}
            getY={getY}
            activeIndex={activeIndex}
          />
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
      {activeIndex !== null && (
        <ChartTooltip
          point={data[activeIndex]}
          x={tooltipX}
          containerWidth={containerRef.current?.offsetWidth || 0}
          isPast={data[activeIndex].timestamp < new Date()}
        />
      )}

      {/* Legend */}
      <ChartLegend showPastLegend={hasPastData} />
    </div>
  );
};

export default ChartArea;
