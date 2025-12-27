import {
  APIHero,
  Authentication,
  EndpointsOverview,
  RateLimits,
  SDKs,
  Webhooks,
} from "@/components/sections/product/api";
import SubPageCTA from "@/components/sections/product/Subpagecta";

const Api = () => {
  return (
    <div>
      <APIHero />
      <EndpointsOverview />
      <Authentication />
      <Webhooks />
      <SDKs />
      <RateLimits />
      <SubPageCTA
        title="Ready to"
        highlight="integrate"
        description="Get API access and start building with forecast data in minutes."
        relatedLinks={[
          {
            label: "Forecasting Engine",
            href: "/product/engine",
            description: "How predictions are made",
          },
          {
            label: "Alerts & Signals",
            href: "/product/alerts",
            description: "Real-time notifications",
          },
          {
            label: "For Traders",
            href: "/solutions/traders",
            description: "Trading integrations",
          },
        ]}
      />
    </div>
  );
};

export default Api;
