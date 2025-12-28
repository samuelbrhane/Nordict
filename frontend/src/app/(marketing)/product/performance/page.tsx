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
      <ModelVersionComparison />
      <LiveVsBacktest />
      <TransparencyGuarantees />
      <SubPageCTA
        title="Ready to verify"
        highlight="for yourself"
        description="Get early access and explore our full performance dashboard with historical data."
        relatedLinks={[
          {
            label: "Forecasting Engine",
            href: "/product/engine",
            description: "How predictions are made",
          },
          {
            label: "Alerts & Signals",
            href: "/product/alerts",
            description: "Turn forecasts into actions",
          },
          {
            label: "Methodology",
            href: "/resources/methodology",
            description: "Our evaluation principles",
          },
        ]}
      />
    </div>
  );
};

export default Performance;
