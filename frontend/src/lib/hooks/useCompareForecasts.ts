import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

interface ForecastByHorizon {
  horizon: Horizon;
  direction: "up" | "down" | "neutral";
  confidence_score: number | string;
  current_price: number | string;
  predicted_mid: number | string;
  predicted_low: number | string;
  predicted_high: number | string;
}

interface MarketForecast {
  symbol: string;
  name: string;
  current_price: number | string;
  direction: "up" | "down" | "neutral";
  confidence_score: number | string;
  predicted_mid: number | string;
  predicted_low: number | string;
  predicted_high: number | string;
}

interface MarketAllForecasts {
  symbol: string;
  name: string;
  forecasts: ForecastByHorizon[];
}

export const useCompareForecasts = (symbols: string[], horizon: Horizon) => {
  const [data, setData] = useState<MarketForecast[]>([]);
  const [allHorizonsData, setAllHorizonsData] = useState<MarketAllForecasts[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (symbols.length === 0) {
        setData([]);
        setAllHorizonsData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch forecast for each symbol
        const promises = symbols.map((symbol) =>
          api.get<any[]>(`/api/v1/forecasts/by_market/?market=${symbol}`)
        );

        const results = await Promise.all(promises);

        const forecasts: MarketForecast[] = [];
        const allForecasts: MarketAllForecasts[] = [];

        results.forEach((marketForecasts, index) => {
          const symbol = symbols[index];

          // Get name from first forecast
          const name =
            marketForecasts[0]?.market_name || symbol.replace("-USD", "");

          // Store all horizons data
          allForecasts.push({
            symbol,
            name,
            forecasts: marketForecasts.map((f: any) => ({
              horizon: f.horizon as Horizon,
              direction: f.direction,
              confidence_score: f.confidence_score,
              current_price: f.current_price,
              predicted_mid: f.predicted_mid,
              predicted_low: f.predicted_low,
              predicted_high: f.predicted_high,
            })),
          });

          // Find the forecast for the selected horizon
          const forecast = marketForecasts.find(
            (f: any) => f.horizon === horizon
          );

          if (forecast) {
            forecasts.push({
              symbol,
              name,
              current_price: forecast.current_price,
              direction: forecast.direction,
              confidence_score: forecast.confidence_score,
              predicted_mid: forecast.predicted_mid,
              predicted_low: forecast.predicted_low,
              predicted_high: forecast.predicted_high,
            });
          }
        });

        setData(forecasts);
        setAllHorizonsData(allForecasts);
      } catch (err) {
        console.error("Failed to fetch compare data:", err);
        setError("Failed to load comparison data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbols.join(","), horizon]);

  return { data, allHorizonsData, isLoading, error };
};
