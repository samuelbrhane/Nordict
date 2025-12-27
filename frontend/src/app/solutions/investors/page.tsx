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
      <InvestorTestimonial />
      <SubPageCTA
        title="Ready to invest"
        highlight="smarter"
        description="Get early access and start making data-informed portfolio decisions."
        relatedLinks={[
          {
            label: "Forecasting Engine",
            href: "/product/engine",
            description: "How predictions work",
          },
          {
            label: "For Traders",
            href: "/solutions/traders",
            description: "Short-term strategies",
          },
          {
            label: "For Teams",
            href: "/solutions/teams",
            description: "Collaborate on research",
          },
        ]}
      />
    </div>
  );
};

export default Investors;
