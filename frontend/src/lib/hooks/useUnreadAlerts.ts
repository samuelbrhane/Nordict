import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export const useUnreadAlerts = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get<{ unread_count: number }>(
        "/api/v1/alerts/unread-count/"
      );
      setUnreadCount(response.unread_count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Refresh every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const markAsViewed = async () => {
    try {
      await api.post("/api/v1/alerts/mark-viewed/");
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark alerts as viewed:", err);
    }
  };

  return { unreadCount, isLoading, refetch: fetchUnreadCount, markAsViewed };
};
