import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

interface Market {
  symbol: string;
  name: string;
}

interface ModelVersion {
  id: number;
  name: string;
  version: string;
  horizon: string;
  status: string;
  metrics: {
    rmse?: number;
    mae?: number;
    direction_accuracy?: number;
  } | null;
  created_at: string;
}

export const usePerformanceMarkets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await api.get<{ results: any[] }>(
          "/api/v1/markets/?page_size=100"
        );
        const marketList = response.results.map((m: any) => ({
          symbol: m.symbol,
          name: m.name,
        }));
        setMarkets(marketList);
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return { markets, isLoading };
};

export const useModelVersions = (horizon: Horizon) => {
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        // Fetch models for this horizon
        const response = await api.get<ModelVersion[]>(
          `/api/v1/forecasts/models/?horizon=${horizon}`
        );
        setVersions(response);
      } catch (err) {
        console.error("Failed to fetch model versions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, [horizon]);

  return { versions, isLoading };
};
