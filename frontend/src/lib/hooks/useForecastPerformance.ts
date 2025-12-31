// lib/hooks/useForecastPerformance.ts

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

export interface PerformanceDataPoint {
  index: number;
  timestamp: string;
  label: string;
  predicted: number;
  actual: number;
  error: number;
  errorPercent: number;
}

export interface PerformanceStats {
  avgError: number;
  directionAccuracy: number;
  totalPoints: number;
}

export interface ForecastPerformance {
  market: string;
  horizon: string;
  points: PerformanceDataPoint[];
  stats: PerformanceStats;
}

export const useForecastPerformance = (
  horizon: Horizon,
  market: string = "BTC-USD"
) => {
  const [data, setData] = useState<ForecastPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ForecastPerformance>(
        `/api/v1/forecasts/performance/?horizon=${horizon}&market=${market}`
      );
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch performance data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [horizon, market]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return { data, isLoading, error, refetch: fetchPerformance };
};
