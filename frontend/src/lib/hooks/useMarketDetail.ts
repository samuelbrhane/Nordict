import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface MarketForecast {
  horizon: string;
  direction: "up" | "down" | "neutral";
  confidence_score: number;
  current_price: number;
  predicted_low: number;
  predicted_mid: number;
  predicted_high: number;
  generated_at: string;
  valid_until: string;
}

interface MarketDetail {
  symbol: string;
  name: string;
  category: string;
  current_price: number;
  forecasts: MarketForecast[];
}

export const useMarketDetail = (symbol: string) => {
  const [data, setData] = useState<MarketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all horizon forecasts for this market
        const forecasts = await api.get<MarketForecast[]>(
          `/api/v1/forecasts/by_market/?market=${symbol}`
        );

        if (forecasts.length === 0) {
          setError(`No forecasts found for ${symbol}`);
          return;
        }

        // Get market info from first forecast
        const firstForecast = forecasts[0];

        // Fetch market details
        const market = await api.get<{
          symbol: string;
          name: string;
          category: string;
        }>(`/api/v1/markets/${symbol}/`);

        setData({
          symbol: market.symbol,
          name: market.name,
          category: market.category,
          current_price: firstForecast.current_price,
          forecasts: forecasts,
        });
      } catch (err) {
        console.error("Failed to fetch market detail:", err);
        setError("Failed to load market data");
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  return { data, isLoading, error };
};
