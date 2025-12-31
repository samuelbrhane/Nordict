// components/app/sections/dashboard/forecastchart/ChartSVG.tsx

"use client";

import { ForecastDataPoint } from "./utils";

interface ChartSVGProps {
  data: ForecastDataPoint[];
  getX: (index: number) => number;
  getY: (value: number) => number;
  activeIndex: number | null;
}

const ChartSVG = ({ data, getX, getY, activeIndex }: ChartSVGProps) => {
  const isPast = (timestamp: Date): boolean => {
    return timestamp < new Date();
  };

  // Split data into past and future
  const pastData = data.filter((d) => isPast(d.timestamp));
  const futureData = data.filter((d) => !isPast(d.timestamp));
  const transitionIndex = pastData.length;

  // Generate paths
  const createPath = (
    points: ForecastDataPoint[],
    getValue: (d: ForecastDataPoint) => number,
    startIndex: number = 0
  ) => {
    return points
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${getX(startIndex + i)} ${getY(getValue(d))}`
      )
      .join(" ");
  };

  // Past paths
  const pastForecastPath =
    pastData.length > 0 ? createPath(pastData, (d) => d.forecast) : "";

  // Future paths
  const futureForecastPath =
    futureData.length > 0
      ? createPath(futureData, (d) => d.forecast, transitionIndex)
      : "";
  const futureUpperPath =
    futureData.length > 0
      ? createPath(futureData, (d) => d.upper, transitionIndex)
      : "";
  const futureLowerPath =
    futureData.length > 0
      ? createPath(futureData, (d) => d.lower, transitionIndex)
      : "";

  // Connection path between past and future
  const connectPath =
    pastData.length > 0 && futureData.length > 0
      ? `M ${getX(transitionIndex - 1)} ${getY(
          pastData[pastData.length - 1].forecast
        )} L ${getX(transitionIndex)} ${getY(futureData[0].forecast)}`
      : "";

  // Confidence band for future only
  const futureBandPath =
    futureData.length > 0
      ? futureData
          .map(
            (d, i) =>
              `${i === 0 ? "M" : "L"} ${getX(transitionIndex + i)} ${getY(
                d.upper
              )}`
          )
          .join(" ") +
        " " +
        [...futureData]
          .reverse()
          .map(
            (d, i) =>
              `L ${getX(transitionIndex + futureData.length - 1 - i)} ${getY(
                d.lower
              )}`
          )
          .join(" ") +
        " Z"
      : "";

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Future Confidence Band */}
        {futureBandPath && (
          <path d={futureBandPath} fill="var(--brand)" fillOpacity={0.1} />
        )}

        {/* Future Upper Bound */}
        {futureUpperPath && (
          <path
            d={futureUpperPath}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="0.3"
            strokeOpacity={0.4}
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Future Lower Bound */}
        {futureLowerPath && (
          <path
            d={futureLowerPath}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="0.3"
            strokeOpacity={0.4}
            strokeDasharray="2,2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Past Forecast Line - grayed, dashed */}
        {pastForecastPath && (
          <path
            d={pastForecastPath}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="0.5"
            strokeDasharray="3,2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Connection Line */}
        {connectPath && (
          <path
            d={connectPath}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="0.5"
            strokeDasharray="3,2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Future Forecast Line - solid */}
        {futureForecastPath && (
          <path
            d={futureForecastPath}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {/* Data Points */}
      {data.map((d, i) => {
        const past = isPast(d.timestamp);
        const isActive = activeIndex === i;

        return (
          <div
            key={i}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
              isActive ? "h-3 w-3 ring-4" : "h-2 w-2"
            } ${past ? "opacity-50" : ""}`}
            style={{
              left: `${getX(i)}%`,
              top: `${getY(d.forecast)}%`,
              backgroundColor: past ? "#9ca3af" : "var(--brand)",
              boxShadow: isActive
                ? `0 0 0 4px ${
                    past ? "rgba(156,163,175,0.2)" : "rgba(4,236,58,0.2)"
                  }`
                : "none",
            }}
          />
        );
      })}

      {/* Hover Line */}
      {activeIndex !== null && (
        <div
          className="absolute top-0 h-full w-px"
          style={{
            left: `${getX(activeIndex)}%`,
            backgroundColor: isPast(data[activeIndex].timestamp)
              ? "rgba(156,163,175,0.3)"
              : "rgba(4,236,58,0.3)",
          }}
        />
      )}
    </>
  );
};

export default ChartSVG;
