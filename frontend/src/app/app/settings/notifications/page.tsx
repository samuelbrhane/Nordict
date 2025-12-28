"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  NotificationsHeader,
  AlertChannels,
  ForecastUpdates,
  SystemNotifications,
  DigestSettings,
  QuietHours,
} from "@/components/app/sections/settings/notifications";

const SettingsNotificationsPage = () => {
  const [settings, setSettings] = useState({
    alertsEmail: true,
    alertsPush: false,
    forecastDaily: true,
    forecastWeekly: false,
    forecastSignificant: true,
    systemMaintenance: true,
    systemNewFeatures: true,
    systemNewsletter: false,
    digestEnabled: true,
    digestFrequency: "daily",
    digestTime: "09:00",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  const update = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <NotificationsHeader />

        <AlertChannels
          email={settings.alertsEmail}
          push={settings.alertsPush}
          onEmailChange={(v) => update("alertsEmail", v)}
          onPushChange={(v) => update("alertsPush", v)}
        />

        <ForecastUpdates
          daily={settings.forecastDaily}
          weekly={settings.forecastWeekly}
          significant={settings.forecastSignificant}
          onDailyChange={(v) => update("forecastDaily", v)}
          onWeeklyChange={(v) => update("forecastWeekly", v)}
          onSignificantChange={(v) => update("forecastSignificant", v)}
        />

        <SystemNotifications
          maintenance={settings.systemMaintenance}
          newFeatures={settings.systemNewFeatures}
          newsletter={settings.systemNewsletter}
          onMaintenanceChange={(v) => update("systemMaintenance", v)}
          onNewFeaturesChange={(v) => update("systemNewFeatures", v)}
          onNewsletterChange={(v) => update("systemNewsletter", v)}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <DigestSettings
            enabled={settings.digestEnabled}
            frequency={settings.digestFrequency}
            time={settings.digestTime}
            onEnabledChange={(v) => update("digestEnabled", v)}
            onFrequencyChange={(v) => update("digestFrequency", v)}
            onTimeChange={(v) => update("digestTime", v)}
          />
          <QuietHours
            enabled={settings.quietHoursEnabled}
            start={settings.quietHoursStart}
            end={settings.quietHoursEnd}
            onEnabledChange={(v) => update("quietHoursEnabled", v)}
            onStartChange={(v) => update("quietHoursStart", v)}
            onEndChange={(v) => update("quietHoursEnd", v)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsNotificationsPage;
