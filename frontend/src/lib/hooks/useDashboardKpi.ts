import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export type Horizon = "24H" | "30D" | "12W" | "12M";

export interface DashboardKpi {
  total_markets: number;
  avg_confidence: number;
  up_count: number;
  down_count: number;
  neutral_count: number;
  last_updated: string | null;
  last_updated_ago: string;
  next_update: string | null;
  next_update_in: string;
}

export const useDashboardKpi = (horizon: Horizon) => {
  const [data, setData] = useState<DashboardKpi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpi = useCallback(async () => {
    console.log("Fetching KPI for horizon:", horizon);
    setIsLoading(true);
    setError(null);

    try {
      const url = `/api/v1/forecasts/dashboard_kpi/?horizon=${horizon}`;
      console.log("API URL:", url);

      const response = await api.get<DashboardKpi>(url);
      console.log("API Response:", response);

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch KPI data");
    } finally {
      setIsLoading(false);
    }
  }, [horizon]);

  useEffect(() => {
    fetchKpi();
  }, [fetchKpi]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(fetchKpi, 300000);
    return () => clearInterval(interval);
  }, [fetchKpi]);

  return { data, isLoading, error, refetch: fetchKpi };
};
