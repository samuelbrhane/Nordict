import {
  ConfidenceBands,
  Forecastingenginehero,
  ForecastOutputs,
  ModelLifecycle,
  SupportedHorizons,
  UpdateFrequency,
} from "@/components/sections/product/engine";
import SubPageCTA from "@/components/sections/shared/Subpagecta";

const ForecastEngine = () => {
  return (
    <div>
      <Forecastingenginehero />
      <SupportedHorizons />
      <ForecastOutputs />
      <ConfidenceBands />
      <ModelLifecycle />
      <UpdateFrequency />
      <SubPageCTA
        title="Ready to see it"
        highlight="in action"
        description="Get early access and explore the forecasting engine with real data."
        relatedLinks={[
          {
            label: "Performance & Backtesting",
            href: "/product/performance",
            description: "See how we measure accuracy",
          },
          {
            label: "Alerts & Signals",
            href: "/product/alerts",
            description: "Turn forecasts into actions",
          },
        ]}
      />
    </div>
  );
};

export default ForecastEngine;
