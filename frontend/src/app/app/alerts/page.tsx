"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const MARKETS = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "MATIC-USD", name: "Polygon" },
  { symbol: "LINK-USD", name: "Chainlink" },
];

const HORIZONS = ["1D", "7D", "30D", "90D"];

const CONDITION_TYPES = [
  { id: "confidence_above", label: "Confidence above", unit: "%" },
  { id: "confidence_below", label: "Confidence below", unit: "%" },
  { id: "predicted_move_above", label: "Predicted move above", unit: "%" },
  { id: "predicted_move_below", label: "Predicted move below", unit: "%" },
  { id: "probability_up_above", label: "Probability up above", unit: "%" },
  { id: "probability_down_above", label: "Probability down above", unit: "%" },
  { id: "direction_change", label: "Direction changes", unit: null },
  { id: "price_exits_range", label: "Price exits predicted range", unit: null },
];

// Mock alerts data
const MOCK_ALERTS = [
  {
    id: 1,
    market: "BTC-USD",
    horizon: "7D",
    condition: "Confidence above 75%",
    conditionType: "confidence_above",
    value: 75,
    channel: "email",
    status: "active",
    lastTriggered: "Dec 21, 2024",
    triggerCount: 8,
  },
  {
    id: 2,
    market: "BTC-USD",
    horizon: "1D",
    condition: "Price exits predicted range",
    conditionType: "price_exits_range",
    value: null,
    channel: "email",
    status: "active",
    lastTriggered: "Never",
    triggerCount: 0,
  },
  {
    id: 3,
    market: "ETH-USD",
    horizon: "7D",
    condition: "Predicted move above 5%",
    conditionType: "predicted_move_above",
    value: 5,
    channel: "email",
    status: "active",
    lastTriggered: "Dec 18, 2024",
    triggerCount: 3,
  },
  {
    id: 4,
    market: "SOL-USD",
    horizon: "7D",
    condition: "Direction changes",
    conditionType: "direction_change",
    value: null,
    channel: "email",
    status: "paused",
    lastTriggered: "Dec 15, 2024",
    triggerCount: 5,
  },
];

// Mock alert history
const ALERT_HISTORY = [
  {
    id: 1,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 21, 2024 14:32",
    value: "78%",
  },
  {
    id: 2,
    alertId: 3,
    market: "ETH-USD",
    condition: "Predicted move above 5%",
    triggeredAt: "Dec 18, 2024 09:15",
    value: "+6.2%",
  },
  {
    id: 3,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 14, 2024 11:45",
    value: "82%",
  },
  {
    id: 4,
    alertId: 4,
    market: "SOL-USD",
    condition: "Direction changes",
    triggeredAt: "Dec 15, 2024 16:20",
    value: "↑ → ↓",
  },
  {
    id: 5,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 7, 2024 10:30",
    value: "76%",
  },
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterMarket, setFilterMarket] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused">(
    "all"
  );

  // Create modal state
  const [newAlert, setNewAlert] = useState({
    market: MARKETS[0].symbol,
    horizon: "7D",
    conditionType: "confidence_above",
    value: 75,
    channel: "email",
    cooldown: "1h",
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (filterMarket && alert.market !== filterMarket) return false;
    if (filterStatus !== "all" && alert.status !== filterStatus) return false;
    return true;
  });

  const toggleAlertStatus = (alertId: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: alert.status === "active" ? "paused" : "active",
            }
          : alert
      )
    );
  };

  const deleteAlert = (alertId: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const createAlert = () => {
    const conditionType = CONDITION_TYPES.find(
      (c) => c.id === newAlert.conditionType
    );
    const conditionLabel = conditionType?.unit
      ? `${conditionType.label} ${newAlert.value}${conditionType.unit}`
      : conditionType?.label || "";

    const newAlertData = {
      id: Math.max(...alerts.map((a) => a.id)) + 1,
      market: newAlert.market,
      horizon: newAlert.horizon,
      condition: conditionLabel,
      conditionType: newAlert.conditionType,
      value: newAlert.value,
      channel: newAlert.channel,
      status: "active" as const,
      lastTriggered: "Never",
      triggerCount: 0,
    };

    setAlerts((prev) => [...prev, newAlertData]);
    setIsCreateModalOpen(false);
    setNewAlert({
      market: MARKETS[0].symbol,
      horizon: "7D",
      conditionType: "confidence_above",
      value: 75,
      channel: "email",
      cooldown: "1h",
    });
  };

  return (
    <AppLayout title="Alerts" subtitle="Configure forecast-based notifications">
      <div className="space-y-6">
        {/* Header with Create button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Market filter */}
            <select
              value={filterMarket || ""}
              onChange={(e) => setFilterMarket(e.target.value || null)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <option value="">All markets</option>
              {MARKETS.map((market) => (
                <option key={market.symbol} value={market.symbol}>
                  {market.symbol}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <div className="flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {(["all", "active", "paused"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    filterStatus === status
                      ? "text-black"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  style={
                    filterStatus === status
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Alert
          </button>
        </div>

        {/* Alerts list */}
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {filteredAlerts.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                        alert.status === "active"
                          ? "bg-emerald-500"
                          : "bg-neutral-300 dark:bg-neutral-600"
                      }`}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/app/forecasts/${alert.market}`}
                          className="font-semibold text-neutral-900 hover:underline dark:text-white"
                        >
                          {alert.market}
                        </Link>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {alert.horizon}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {alert.condition}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-3.5 w-3.5"
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
                          {alert.channel}
                        </span>
                        <span>Last: {alert.lastTriggered}</span>
                        <span>Triggered {alert.triggerCount}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlertStatus(alert.id)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                        alert.status === "active"
                          ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          : "text-black"
                      }`}
                      style={
                        alert.status === "paused"
                          ? { backgroundColor: "var(--brand)" }
                          : {}
                      }
                    >
                      {alert.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                No alerts found
              </p>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                {filterMarket || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first alert to get started"}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Alert History */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Alert History
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              When alerts were triggered
            </p>

            <div className="mt-6 space-y-3">
              {ALERT_HISTORY.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.market}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.triggeredAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Noise Controls */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Noise Controls
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage alert frequency
            </p>

            <div className="mt-6 space-y-4">
              {/* Cooldown */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Default Cooldown
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Minimum time between alerts
                  </p>
                </div>
                <select className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <option>15 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>24 hours</option>
                </select>
              </div>

              {/* Daily limit */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Daily Limit
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Max alerts per day
                  </p>
                </div>
                <select className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                  <option>Unlimited</option>
                </select>
              </div>

              {/* Quiet hours */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Quiet Hours
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Pause alerts during night
                  </p>
                </div>
                <button
                  className="relative h-6 w-11 rounded-full bg-neutral-200 transition-colors dark:bg-neutral-700"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.classList.toggle("bg-[var(--brand)]");
                    btn
                      .querySelector("span")
                      ?.classList.toggle("translate-x-5");
                  }}
                >
                  <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>

            {/* Delivery channels */}
            <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-700">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Delivery Channels
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-neutral-500"
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
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      Email
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-neutral-500"
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
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      Webhook
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    Coming soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Alert Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Create Alert
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 px-6 py-5">
              {/* Market */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Market
                </label>
                <select
                  value={newAlert.market}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, market: e.target.value })
                  }
                  className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {MARKETS.map((market) => (
                    <option key={market.symbol} value={market.symbol}>
                      {market.symbol} – {market.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horizon */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Horizon
                </label>
                <div className="mt-2 flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  {HORIZONS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setNewAlert({ ...newAlert, horizon: h })}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        newAlert.horizon === h
                          ? "text-black"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                      style={
                        newAlert.horizon === h
                          ? { backgroundColor: "var(--brand)" }
                          : {}
                      }
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Condition
                </label>
                <select
                  value={newAlert.conditionType}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, conditionType: e.target.value })
                  }
                  className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  {CONDITION_TYPES.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value (if applicable) */}
              {CONDITION_TYPES.find((c) => c.id === newAlert.conditionType)
                ?.unit && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Threshold
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={newAlert.value}
                      onChange={(e) =>
                        setNewAlert({
                          ...newAlert,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                      {
                        CONDITION_TYPES.find(
                          (c) => c.id === newAlert.conditionType
                        )?.unit
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Cooldown */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Cooldown
                </label>
                <select
                  value={newAlert.cooldown}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, cooldown: e.target.value })
                  }
                  className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="24h">24 hours</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={createAlert}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AlertsPage;
