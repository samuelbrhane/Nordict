import {
  AlertExamples,
  AlertNoise,
  AlertsHero,
  AlertTypes,
  DeliveryChannels,
  TriggerLogic,
} from "@/components/sections/product/alerts";
import SubPageCTA from "@/components/sections/product/Subpagecta";

const Alerts = () => {
  return (
    <div>
      <AlertsHero />
      <AlertTypes />
      <TriggerLogic />
      <DeliveryChannels />
      <AlertExamples />
      <AlertNoise />
      <SubPageCTA
        title="Ready to stay"
        highlight="informed"
        description="Get early access and set up your first alerts with real forecast data."
        relatedLinks={[
          {
            label: "Forecasting Engine",
            href: "/product/engine",
            description: "How predictions are made",
          },
          {
            label: "Performance & Backtesting",
            href: "/product/performance",
            description: "Track forecast accuracy",
          },
          {
            label: "For Traders",
            href: "/solutions/traders",
            description: "Alerts for active trading",
          },
        ]}
      />
    </div>
  );
};

export default Alerts;
