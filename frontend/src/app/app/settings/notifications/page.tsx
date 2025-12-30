"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app";
import { useAuth } from "@/context/AuthContext";
import {
  NotificationsHeader,
  AlertChannels,
  ForecastUpdates,
} from "@/components/app/sections/settings/notifications";
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
  NotificationSettings,
} from "@/context/auth/api";

const SettingsNotificationsPage = () => {
  const { tokens } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_alerts_email: true,
    notify_alerts_push: false,
    notify_forecast_daily: true,
    notify_forecast_significant: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!tokens?.access) return;

      try {
        const data = await getNotificationSettingsApi(tokens.access);
        setSettings(data);
      } catch (err) {
        setError("Failed to load notification settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [tokens?.access]);

  const updateSetting = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    if (!tokens?.access) return;

    const previousValue = settings[key];

    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaving(true);
    setError(null);

    try {
      await updateNotificationSettingsApi(tokens.access, { [key]: value });
    } catch (err) {
      // Revert on error
      setSettings((prev) => ({ ...prev, [key]: previousValue }));
      setError("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[var(--brand)]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <NotificationsHeader />

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <AlertChannels
          emailEnabled={settings.notify_alerts_email}
          pushEnabled={settings.notify_alerts_push}
          onEmailChange={(v) => updateSetting("notify_alerts_email", v)}
          onPushChange={(v) => updateSetting("notify_alerts_push", v)}
          disabled={isSaving}
        />

        <ForecastUpdates
          dailyEnabled={settings.notify_forecast_daily}
          significantEnabled={settings.notify_forecast_significant}
          onDailyChange={(v) => updateSetting("notify_forecast_daily", v)}
          onSignificantChange={(v) =>
            updateSetting("notify_forecast_significant", v)
          }
          disabled={isSaving}
        />
      </div>
    </AppLayout>
  );
};

export default SettingsNotificationsPage;
