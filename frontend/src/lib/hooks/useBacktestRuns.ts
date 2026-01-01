import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

interface BacktestRun {
  id: number;
  market: string;
  horizon: string;
  model_version: string;
  test_start: string;
  test_end: string;
  mae: number;
  rmse: number;
  mape: number;
  directional_accuracy: number;
  total_predictions: number;
  correct_directions: number;
  run_at: string;
}

interface BacktestResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: BacktestRun[];
}

export const useBacktestRuns = (
  horizon: Horizon,
  page: number = 1,
  pageSize: number = 10
) => {
  const [data, setData] = useState<BacktestRun[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<BacktestResponse>(
          `/api/v1/forecasts/backtest_runs/?horizon=${horizon}&page=${page}&page_size=${pageSize}`
        );
        setData(response.results);
        setTotal(response.total);
        setTotalPages(response.total_pages);
      } catch (err) {
        console.error("Failed to fetch backtest runs:", err);
        setError("Failed to load backtest runs");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [horizon, page, pageSize]);

  return { data, total, totalPages, isLoading, error };
};
