// components/app/sections/dashboard/KpiTiles.tsx

"use client";

import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Percent,
  Clock,
} from "lucide-react";
import AnimatedCard from "./AnimatedCard";
import { DashboardKpi } from "@/lib/hooks/useDashboardKpi";

interface KpiTilesProps {
  kpi: DashboardKpi | null;
  isLoading: boolean;
  error: string | null;
  horizon: string; // Add horizon prop
}

const KpiTiles = ({ kpi, isLoading, error, horizon }: KpiTilesProps) => {
  const tiles = [
    {
      label: "Total Markets",
      value: isLoading ? "..." : kpi?.total_markets ?? 0,
      icon: <BarChart3 className="h-5 w-5" />,
      status: "healthy" as const,
    },
    {
      label: "Avg Confidence",
      value: isLoading ? "..." : `${kpi?.avg_confidence?.toFixed(1) ?? 0}%`,
      icon: <Percent className="h-5 w-5" />,
      status:
        kpi?.avg_confidence && kpi.avg_confidence >= 60
          ? ("healthy" as const)
          : kpi?.avg_confidence && kpi.avg_confidence >= 40
          ? ("warning" as const)
          : ("critical" as const),
    },
    {
      label: "Bullish",
      value: isLoading ? "..." : kpi?.up_count ?? 0,
      icon: <TrendingUp className="h-5 w-5" />,
      change: kpi?.total_markets
        ? `${((kpi.up_count / kpi.total_markets) * 100).toFixed(0)}%`
        : undefined,
      changeType: "positive" as const,
    },
    {
      label: "Bearish",
      value: isLoading ? "..." : kpi?.down_count ?? 0,
      icon: <TrendingDown className="h-5 w-5" />,
      change: kpi?.total_markets
        ? `${((kpi.down_count / kpi.total_markets) * 100).toFixed(0)}%`
        : undefined,
      changeType: "negative" as const,
    },
    {
      label: "Next Update",
      value: isLoading ? "..." : kpi?.next_update_in ?? "Unknown",
      icon: <Clock className="h-5 w-5" />,
      status: "healthy" as const,
    },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        Failed to load KPI data: {error}
      </div>
    );
  }

  return (
    <div
      key={horizon} // This forces re-mount when horizon changes
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
    >
      {tiles.map((tile, index) => (
        <AnimatedCard key={`${horizon}-${tile.label}`} delay={50 + index * 50}>
          <div className="group relative flex h-full min-h-[140px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
            {/* Hover gradient */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(4,236,58,0.03) 0%, transparent 50%)",
              }}
            />

            <div className="relative flex flex-1 flex-col">
              {/* Icon and Status */}
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
                >
                  <span style={{ color: "var(--brand)" }}>{tile.icon}</span>
                </div>
                {tile.status && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      tile.status === "healthy"
                        ? "bg-emerald-500"
                        : tile.status === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                )}
              </div>

              {/* Value and Label */}
              <div className="mt-auto pt-3">
                <p className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
                  {tile.value}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                    {tile.label}
                  </p>
                  {tile.change && (
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        tile.changeType === "positive"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : tile.changeType === "negative"
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {tile.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default KpiTiles;
