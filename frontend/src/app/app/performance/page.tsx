"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  PerformanceHeader,
  ModelInfo,
  MetricsGrid,
  BacktestTable,
  TransparencyNote,
} from "@/components/app/sections/performance";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { useModelInfo } from "@/lib/hooks/useModelInfo";
import { useBacktestRuns } from "@/lib/hooks/useBacktestRuns";

const PerformancePage = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon>("24H");
  const [backtestPage, setBacktestPage] = useState(1);

  const { data: modelInfo, isLoading: modelLoading } =
    useModelInfo(selectedHorizon);
  const {
    data: backtestRuns,
    total,
    totalPages,
    isLoading: backtestLoading,
  } = useBacktestRuns(selectedHorizon, backtestPage);

  // Reset page when horizon changes
  const handleHorizonChange = (horizon: Horizon) => {
    setSelectedHorizon(horizon);
    setBacktestPage(1);
  };

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <PerformanceHeader
          selectedHorizon={selectedHorizon}
          onHorizonChange={handleHorizonChange}
        />

        <ModelInfo model={modelInfo} isLoading={modelLoading} />

        <BacktestTable
          runs={backtestRuns}
          isLoading={backtestLoading}
          page={backtestPage}
          totalPages={totalPages}
          total={total}
          onPageChange={setBacktestPage}
        />
        <TransparencyNote />
      </div>
    </AppLayout>
  );
};

export default PerformancePage;

{
  /* <RegimeBreakdown /> */
}
{
  /* <BacktestTable /> */
}
{
  /* <TransparencyNote /> */
}
