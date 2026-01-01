import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Alert {
  id: number;
  market: number;
  market_symbol: string;
  market_name: string;
  horizon: string;
  condition_type: string;
  condition_value: number | null;
  status: "active" | "paused";
  is_recurring: boolean;
  last_triggered_at: string | null;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  market: number;
  horizon: string;
  condition_type: string;
  condition_value?: number;
  is_recurring?: boolean;
}

export interface AlertHistory {
  id: number;
  alert: number;
  alert_name: string;
  market_symbol: string;
  triggered_at: string;
  condition_met: string;
  forecast_value: string;
  email_sent: boolean;
  push_sent: boolean;
}

export const useAlerts = (filters?: {
  market?: string;
  status?: string;
  horizon?: string;
}) => {
  const [data, setData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let url = "/api/v1/alerts/";
      const params = new URLSearchParams();

      if (filters?.market) params.append("market", filters.market);
      if (filters?.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters?.horizon) params.append("horizon", filters.horizon);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get<Alert[]>(url);
      setData(response);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.market, filters?.status, filters?.horizon]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (alertData: CreateAlertData): Promise<Alert> => {
    const response = await api.post<Alert>("/api/v1/alerts/", alertData);
    setData((prev) => [response, ...prev]);
    return response;
  };

  const toggleAlert = async (alertId: number): Promise<void> => {
    const response = await api.post<Alert>(`/api/v1/alerts/${alertId}/toggle/`);
    setData((prev) =>
      prev.map((alert) => (alert.id === alertId ? response : alert))
    );
  };

  const deleteAlert = async (alertId: number): Promise<void> => {
    await api.delete(`/api/v1/alerts/${alertId}/`);
    setData((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const updateAlert = async (
    alertId: number,
    alertData: Partial<CreateAlertData>
  ): Promise<void> => {
    const response = await api.patch<Alert>(
      `/api/v1/alerts/${alertId}/`,
      alertData
    );
    setData((prev) =>
      prev.map((alert) => (alert.id === alertId ? response : alert))
    );
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchAlerts,
    createAlert,
    toggleAlert,
    deleteAlert,
    updateAlert,
  };
};

export const useAlertHistory = (alertId?: number, limit: number = 20) => {
  const [data, setData] = useState<AlertHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url = `/api/v1/alerts/history/?limit=${limit}`;
        if (alertId) url += `&alert=${alertId}`;

        const response = await api.get<AlertHistory[]>(url);
        setData(response);
      } catch (err) {
        console.error("Failed to fetch alert history:", err);
        setError("Failed to load alert history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [alertId, limit]);

  return { data, isLoading, error };
};

export const useMarketAlerts = (marketSymbol: string) => {
  const [data, setData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!marketSymbol) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<Alert[]>(
          `/api/v1/alerts/?market=${marketSymbol}`
        );
        setData(response);
      } catch (err) {
        console.error("Failed to fetch market alerts:", err);
        setError("Failed to load alerts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [marketSymbol]);

  return { data, isLoading, error };
};
