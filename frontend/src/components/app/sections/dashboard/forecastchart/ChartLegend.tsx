// components/app/sections/dashboard/forecastchart/ChartLegend.tsx

"use client";

interface ChartLegendProps {
  showPastLegend?: boolean;
}

const ChartLegend = ({ showPastLegend = false }: ChartLegendProps) => {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div
          className="h-1 w-6 rounded-full"
          style={{ backgroundColor: "var(--brand)" }}
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Future Forecast
        </span>
      </div>

      {showPastLegend && (
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-6 rounded-full"
            style={{ backgroundColor: "#9ca3af" }}
          />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Past (awaiting actual)
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className="h-1 w-6 rounded-full opacity-40"
          style={{ backgroundColor: "var(--brand)" }}
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Upper / Lower Bound
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="h-4 w-6 rounded"
          style={{ backgroundColor: "rgba(4,236,58,0.12)" }}
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Confidence Band
        </span>
      </div>
    </div>
  );
};

export default ChartLegend;
