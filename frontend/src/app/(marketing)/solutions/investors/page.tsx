import { FinalCTA } from "@/components/sections/home";
import SubPageCTA from "@/components/sections/shared/Subpagecta";
import {
  InvestmentApproach,
  InvestorFeatures,
  InvestorsHero,
  InvestorTestimonial,
  InvestorUseCases,
} from "@/components/sections/solutions/investors";

const Investors = () => {
  return (
    <div>
      <InvestorsHero />
      <InvestmentApproach />
      <InvestorFeatures />
      <InvestorUseCases />
      {/* <InvestorTestimonial /> */}
      <FinalCTA />
    </div>
  );
};

export default Investors;
