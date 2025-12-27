import {
  EvaluationMetrics,
  HistoricalPerformance,
  ModelVersionComparison,
  PerformanceHero,
  Walkforwardvalidation,
} from "@/components/sections/product/performance";

const Performance = () => {
  return (
    <div>
      <PerformanceHero />
      <EvaluationMetrics />
      <Walkforwardvalidation />
      <HistoricalPerformance />
      <ModelVersionComparison />
    </div>
  );
};

export default Performance;
