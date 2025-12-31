// app/app/dashboard/page.tsx

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

const DashboardPage = () => {
  const [marketFilter, setMarketFilter] = useState<"all" | "favorites">("all");
  const [horizon, setHorizon] = useState<"24H" | "30D" | "12W" | "12M">("30D");

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <DashboardHeader
          marketFilter={marketFilter}
          onMarketFilterChange={setMarketFilter}
          horizon={horizon}
          onHorizonChange={setHorizon}
          lastUpdated="2m ago"
        />
        <KpiTiles horizon={horizon} />
        <ForecastChart horizon={horizon} />
        <PerformanceChart horizon={horizon} />
        <TopSignalsTable horizon={horizon} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
