"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  DashboardHeader,
  KpiTiles,
  ForecastChart,
  TopSignalsTable,
} from "@/components/app/sections/dashboard";

const DashboardPage = () => {
  const [marketFilter, setMarketFilter] = useState<"all" | "favorites">("all");
  const [horizon, setHorizon] = useState<"1D" | "7D" | "30D">("7D");

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
        <TopSignalsTable horizon={horizon} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
