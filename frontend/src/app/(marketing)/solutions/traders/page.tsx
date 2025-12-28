import SubPageCTA from "@/components/sections/shared/Subpagecta";
import {
  TraderFeatures,
  TradersHero,
  TraderTestimonial,
  TraderUseCases,
  TradingWorkflow,
} from "@/components/sections/solutions/traders";

const Traders = () => {
  return (
    <div>
      <TradersHero />
      <TradingWorkflow />
      <TraderFeatures />
      <TraderUseCases />
      <TraderTestimonial />
      <SubPageCTA
        title="Ready to trade"
        highlight="smarter"
        description="Get early access and start making data-backed trading decisions."
        relatedLinks={[
          {
            label: "Alerts & Signals",
            href: "/product/alerts",
            description: "Real-time notifications",
          },
          {
            label: "For Investors",
            href: "/solutions/investors",
            description: "Long-term strategies",
          },
          {
            label: "Forecasting Engine",
            href: "/product/engine",
            description: "How predictions work",
          },
        ]}
      />
    </div>
  );
};

export default Traders;
