import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

export interface ForecastPoint {
  step: number;
  timestamp: string;
  predicted_price: string;
  confidence_low: string;
  confidence_high: string;
  confidence_score: number;
  actual_price: string | null;
}

export interface ForecastChart {
  id: number;
  market_symbol: string;
  market_name: string;
  horizon: string;
  direction: "up" | "down" | "neutral";
  confidence_score: number;
  current_price: string;
  predicted_low: string;
  predicted_mid: string;
  predicted_high: string;
  price_range: string;
  change_percent: number;
  generated_at: string;
  valid_from: string;
  valid_until: string;
  points: ForecastPoint[];
}

export const useForecastChart = (
  horizon: Horizon,
  market: string = "BTC-USD"
) => {
  const [data, setData] = useState<ForecastChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<ForecastChart>(
        `/api/v1/forecasts/chart/?horizon=${horizon}&market=${market}`
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch forecast");
    } finally {
      setIsLoading(false);
    }
  }, [horizon, market]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return { data, isLoading, error, refetch: fetchForecast };
};
