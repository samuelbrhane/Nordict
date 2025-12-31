// lib/hooks/useTopSignals.ts

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

export interface Signal {
  symbol: string;
  name: string;
  horizon: string;
  signal: "up" | "down" | "neutral";
  confidence: number;
  expected_move: string;
  expected_move_value: number;
  updated_at: string;
  updated_ago: string;
}

export interface TopSignalsResponse {
  horizon: string;
  signals: Signal[];
}

export const useTopSignals = (horizon: Horizon, limit: number = 5) => {
  const [data, setData] = useState<TopSignalsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<TopSignalsResponse>(
        `/api/v1/forecasts/top_signals/?horizon=${horizon}&limit=${limit}`
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signals");
    } finally {
      setIsLoading(false);
    }
  }, [horizon, limit]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return { data, isLoading, error, refetch: fetchSignals };
};
