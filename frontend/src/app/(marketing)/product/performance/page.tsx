import { FinalCTA } from "@/components/sections/home";
import {
  EvaluationMetrics,
  HistoricalPerformance,
  LiveVsBacktest,
  ModelVersionComparison,
  PerformanceHero,
  TransparencyGuarantees,
  Walkforwardvalidation,
} from "@/components/sections/product/performance";
import SubPageCTA from "@/components/sections/shared/Subpagecta";

const Performance = () => {
  return (
    <div>
      <PerformanceHero />
      <EvaluationMetrics />
      <Walkforwardvalidation />
      <HistoricalPerformance />
      {/* <ModelVersionComparison /> */}
      <LiveVsBacktest />
      {/* <TransparencyGuarantees /> */}

      <FinalCTA />
    </div>
  );
};

export default Performance;
