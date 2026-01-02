import { FinalCTA } from "@/components/sections/home";
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
      {/* <TraderTestimonial /> */}
      <FinalCTA />
    </div>
  );
};

export default Traders;
