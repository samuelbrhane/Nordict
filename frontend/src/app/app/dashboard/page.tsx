"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  DashboardHeader,
  KpiTiles,
  TopSignalsTable,
} from "@/components/app/sections/dashboard";
import {
  ForecastChart,
  PerformanceChart,
} from "@/components/app/sections/dashboard/forecastchart";
import { Horizon, useDashboardKpi } from "@/lib/hooks/useDashboardKpi";

const DashboardPage = () => {
  const [horizon, setHorizon] = useState<Horizon>("24H");
  const { data: kpi, isLoading, error } = useDashboardKpi(horizon);

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <DashboardHeader
          horizon={horizon}
          onHorizonChange={setHorizon}
          lastUpdatedAgo={kpi?.last_updated_ago}
          isLoading={isLoading}
        />
        <KpiTiles
          kpi={kpi}
          isLoading={isLoading}
          error={error}
          horizon={horizon}
        />
        <ForecastChart horizon={horizon} />
        <PerformanceChart horizon={horizon} />
        <TopSignalsTable horizon={horizon} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
