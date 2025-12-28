"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  PerformanceHeader,
  MetricsGrid,
  ValidationNote,
  RegimeBreakdown,
  BacktestTable,
  TransparencyNote,
  ModelInfo,
} from "@/components/app/sections/performance";

import {
  MARKETS,
  MODEL_VERSIONS,
  HORIZONS,
  METRICS_BY_HORIZON,
  BACKTEST_RUNS,
  REGIME_BREAKDOWN,
} from "@/config/performanceData";

const PerformancePage = () => {
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [selectedVersion, setSelectedVersion] = useState(MODEL_VERSIONS[0]);
  const [selectedHorizon, setSelectedHorizon] = useState(HORIZONS[1]); // 7D default

  // Get metrics for selected horizon
  const metricsData = METRICS_BY_HORIZON[selectedHorizon.id];

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <PerformanceHeader
          markets={MARKETS}
          selectedMarket={selectedMarket}
          onMarketChange={setSelectedMarket}
          versions={MODEL_VERSIONS}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
          horizons={HORIZONS}
          selectedHorizon={selectedHorizon}
          onHorizonChange={setSelectedHorizon}
        />

        <ModelInfo version={selectedVersion} />

        <MetricsGrid metricsData={metricsData} />

        <ValidationNote />

        <div className="grid gap-6 lg:grid-cols-2">
          <RegimeBreakdown regimes={REGIME_BREAKDOWN} />
          <BacktestTable runs={BACKTEST_RUNS} />
        </div>

        <TransparencyNote />
      </div>
    </AppLayout>
  );
};

export default PerformancePage;
