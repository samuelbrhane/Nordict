"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  AlertsHeader,
  AlertsList,
  AlertHistory,
  NoiseControls,
  CreateAlertModal,
} from "@/components/app/sections/alerts";
import {
  MARKETS,
  INITIAL_ALERTS,
  ALERT_HISTORY,
  CONDITION_TYPES,
  Alert,
} from "@/config/alertsData";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterMarket, setFilterMarket] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused">(
    "all"
  );

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

  const createAlert = (newAlertData: {
    market: string;
    horizon: string;
    conditionType: string;
    value: number;
  }) => {
    const conditionType = CONDITION_TYPES.find(
      (c) => c.id === newAlertData.conditionType
    );
    const conditionLabel = conditionType?.unit
      ? `${conditionType.label} ${newAlertData.value}${conditionType.unit}`
      : conditionType?.label || "";

    const newAlert: Alert = {
      id: Math.max(...alerts.map((a) => a.id), 0) + 1,
      market: newAlertData.market,
      horizon: newAlertData.horizon,
      condition: conditionLabel,
      conditionType: newAlertData.conditionType,
      value: newAlertData.value,
      channel: "email",
      status: "active",
      lastTriggered: "Never",
      triggerCount: 0,
    };

    setAlerts((prev) => [...prev, newAlert]);
    setIsCreateModalOpen(false);
  };

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <AlertsHeader
          markets={MARKETS}
          filterMarket={filterMarket}
          onFilterMarketChange={setFilterMarket}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        <AlertsList
          alerts={filteredAlerts}
          onToggleStatus={toggleAlertStatus}
          onDelete={deleteAlert}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AlertHistory history={ALERT_HISTORY} />
          <NoiseControls />
        </div>
      </div>

      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createAlert}
        markets={MARKETS}
      />
    </AppLayout>
  );
};

export default AlertsPage;
