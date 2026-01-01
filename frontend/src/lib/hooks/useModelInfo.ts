import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Horizon } from "./useDashboardKpi";

interface ModelInfo {
  id: number;
  name: string;
  version: string;
  horizon: string;
  status: string;
  mae: number | null;
  rmse: number | null;
  mape: number | null;
  r2: number | null;
  median_ae: number | null;
  max_error: number | null;
  bias: number | null;
  correlation: number | null;
  directional_accuracy: number | null;
  training_data_start: string | null;
  training_data_end: string | null;
  created_at: string;
  artifact_path: string;
}

export const useModelInfo = (horizon: Horizon) => {
  const [data, setData] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ModelInfo>(
          `/api/v1/forecasts/model_info/?horizon=${horizon}`
        );
        setData(response);
      } catch (err) {
        console.error("Failed to fetch model info:", err);
        setError("Failed to load model info");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [horizon]);

  return { data, isLoading, error };
};
