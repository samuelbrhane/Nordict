// lib/hooks/useMarketsWithForecasts.ts

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

export interface MarketForecast {
  symbol: string;
  name: string;
  is_featured: boolean;
  is_favorite: boolean;
  current_price: number;
  price_formatted: string;
  change_24h: number;
  change_direction: "up" | "down";
  forecast: {
    direction: "up" | "down" | "neutral";
    confidence: number;
    predicted_low: number;
    predicted_mid: number;
    predicted_high: number;
  };
}

export interface MarketsWithForecastsResponse {
  results: MarketForecast[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

interface UseMarketsWithForecastsParams {
  horizon: Horizon;
  search?: string;
  category?: "all" | "favorites";
  direction?: "up" | "down" | "neutral" | "";
  page?: number;
  pageSize?: number;
}

export const useMarketsWithForecasts = ({
  horizon,
  search = "",
  category = "all",
  direction = "",
  page = 1,
  pageSize = 12,
}: UseMarketsWithForecastsParams) => {
  const [data, setData] = useState<MarketsWithForecastsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        horizon,
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);
      if (direction) params.append("direction", direction);

      const response = await api.get<MarketsWithForecastsResponse>(
        `/api/v1/forecasts/markets/?${params.toString()}`
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch markets");
    } finally {
      setIsLoading(false);
    }
  }, [horizon, search, category, direction, page, pageSize]);

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        fetchMarkets();
      },
      search ? 300 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [fetchMarkets, search]);

  return { data, isLoading, error, refetch: fetchMarkets };
};

// Hook for toggling favorites
export const useToggleFavorite = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (symbol: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<{ symbol: string; is_favorite: boolean }>(
        "/api/v1/forecasts/toggle_favorite/",
        { symbol }
      );
      return response.is_favorite;
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleFavorite, isLoading };
};
