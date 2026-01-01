"use client";

import { useState, useEffect } from "react";
import { AppLayout, LoadingSpinner } from "@/components/app";
import { useAuth } from "@/context/AuthContext";
import {
  AlertsHeader,
  AlertsList,
  AlertHistory,
  CreateAlertModal,
} from "@/components/app/sections/alerts";
import { AlertChannels } from "@/components/app/sections/settings/notifications";
import { useAlerts, useAlertHistory } from "@/lib/hooks/useAlerts";
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
  NotificationSettings,
} from "@/context/auth/api";

const AlertsPage = () => {
  const { tokens } = useAuth();
  const [filterMarket, setFilterMarket] = useState<{
    symbol: string;
    name: string;
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused">(
    "all"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      notify_alerts_email: true,
      notify_alerts_push: false,
      notify_forecast_daily: true,
      notify_forecast_significant: true,
    });
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: alerts,
    isLoading: alertsLoading,
    createAlert,
    toggleAlert,
    deleteAlert,
  } = useAlerts({
    market: filterMarket?.symbol,
    status: filterStatus,
  });

  const { data: alertHistory, isLoading: historyLoading } = useAlertHistory();

  // Fetch notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!tokens?.access) return;

      try {
        const data = await getNotificationSettingsApi(tokens.access);
        setNotificationSettings(data);
      } catch (err) {
        console.error("Failed to load notification settings:", err);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [tokens?.access]);

  const updateNotificationSetting = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    if (!tokens?.access) return;

    const previousValue = notificationSettings[key];

    // Optimistic update
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaving(true);

    try {
      await updateNotificationSettingsApi(tokens.access, { [key]: value });
    } catch (err) {
      // Revert on error
      setNotificationSettings((prev) => ({ ...prev, [key]: previousValue }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (alertId: number) => {
    try {
      await toggleAlert(alertId);
    } catch (err) {
      console.error("Failed to toggle alert:", err);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      await deleteAlert(alertId);
    } catch (err) {
      console.error("Failed to delete alert:", err);
    }
  };

  // Show loading until all data is ready
  const isLoading = isSettingsLoading || alertsLoading || historyLoading;

  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <LoadingSpinner text="Loading alerts..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <AlertsHeader
          filterMarket={filterMarket}
          onFilterMarketChange={setFilterMarket}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onCreateClick={() => setIsCreateModalOpen(true)}
          alertCount={alerts.length}
        />

        <AlertChannels
          emailEnabled={notificationSettings.notify_alerts_email}
          pushEnabled={notificationSettings.notify_alerts_push}
          onEmailChange={(v) =>
            updateNotificationSetting("notify_alerts_email", v)
          }
          onPushChange={(v) =>
            updateNotificationSetting("notify_alerts_push", v)
          }
          disabled={isSaving}
        />

        <AlertsList
          alerts={alerts}
          isLoading={false}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <AlertHistory history={alertHistory} isLoading={false} />
      </div>

      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createAlert}
      />
    </AppLayout>
  );
};

export default AlertsPage;
