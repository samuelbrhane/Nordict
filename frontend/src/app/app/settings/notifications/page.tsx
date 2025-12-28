"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";

const SettingsNotificationsPage = () => {
  const [settings, setSettings] = useState({
    // Alert notifications
    alertsEmail: true,
    alertsPush: false,
    alertsWebhook: false,

    // Forecast notifications
    forecastDaily: true,
    forecastWeekly: false,
    forecastSignificant: true,

    // System notifications
    systemMaintenance: true,
    systemNewFeatures: true,
    systemNewsletter: false,

    // Digest settings
    digestEnabled: true,
    digestFrequency: "daily",
    digestTime: "09:00",

    // Quiet hours
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const Toggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "" : "bg-neutral-200 dark:bg-neutral-700"
      }`}
      style={enabled ? { backgroundColor: "var(--brand)" } : {}}
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <AppLayout title="Notifications" subtitle="Control how you receive updates">
      <div className="space-y-6">
        {/* Alert Notifications */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Alert Notifications
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            How you want to receive forecast alerts
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <svg
                    className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Email
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Receive alerts via email
                  </p>
                </div>
              </div>
              <Toggle
                enabled={settings.alertsEmail}
                onChange={(v) => setSettings({ ...settings, alertsEmail: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <svg
                    className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Push Notifications
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Browser and mobile push
                  </p>
                </div>
              </div>
              <Toggle
                enabled={settings.alertsPush}
                onChange={(v) => setSettings({ ...settings, alertsPush: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <svg
                    className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Webhook
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Send to custom endpoint
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Coming soon
                </span>
                <Toggle enabled={false} onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Updates */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Forecast Updates
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Regular forecast summary notifications
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Daily Summary
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Overview of all forecasts each morning
                </p>
              </div>
              <Toggle
                enabled={settings.forecastDaily}
                onChange={(v) => setSettings({ ...settings, forecastDaily: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Weekly Report
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Performance summary every Monday
                </p>
              </div>
              <Toggle
                enabled={settings.forecastWeekly}
                onChange={(v) =>
                  setSettings({ ...settings, forecastWeekly: v })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Significant Changes
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  When a forecast changes direction or confidence spikes
                </p>
              </div>
              <Toggle
                enabled={settings.forecastSignificant}
                onChange={(v) =>
                  setSettings({ ...settings, forecastSignificant: v })
                }
              />
            </div>
          </div>
        </div>

        {/* System Notifications */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            System Notifications
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Platform updates and announcements
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Maintenance Alerts
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Scheduled downtime and system updates
                </p>
              </div>
              <Toggle
                enabled={settings.systemMaintenance}
                onChange={(v) =>
                  setSettings({ ...settings, systemMaintenance: v })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  New Features
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Product updates and improvements
                </p>
              </div>
              <Toggle
                enabled={settings.systemNewFeatures}
                onChange={(v) =>
                  setSettings({ ...settings, systemNewFeatures: v })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Newsletter
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Monthly insights and market analysis
                </p>
              </div>
              <Toggle
                enabled={settings.systemNewsletter}
                onChange={(v) =>
                  setSettings({ ...settings, systemNewsletter: v })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Email Digest */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Email Digest
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Combine multiple notifications
                </p>
              </div>
              <Toggle
                enabled={settings.digestEnabled}
                onChange={(v) => setSettings({ ...settings, digestEnabled: v })}
              />
            </div>

            {settings.digestEnabled && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Frequency
                  </label>
                  <select
                    value={settings.digestFrequency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        digestFrequency: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="realtime">Real-time (no digest)</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {settings.digestFrequency !== "realtime" && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Delivery Time
                    </label>
                    <select
                      value={settings.digestTime}
                      onChange={(e) =>
                        setSettings({ ...settings, digestTime: e.target.value })
                      }
                      className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="06:00">6:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quiet Hours */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Quiet Hours
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Pause notifications during set hours
                </p>
              </div>
              <Toggle
                enabled={settings.quietHoursEnabled}
                onChange={(v) =>
                  setSettings({ ...settings, quietHoursEnabled: v })
                }
              />
            </div>

            {settings.quietHoursEnabled && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Start
                  </label>
                  <select
                    value={settings.quietHoursStart}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHoursStart: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                    <option value="23:00">11:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    End
                  </label>
                  <select
                    value={settings.quietHoursEnd}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        quietHoursEnd: e.target.value,
                      })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="06:00">6:00 AM</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {isSaving && (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            Save Changes
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsNotificationsPage;
