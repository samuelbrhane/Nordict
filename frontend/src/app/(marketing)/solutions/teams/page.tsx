import SubPageCTA from "@/components/sections/shared/Subpagecta";
import {
  TeamFeatures,
  TeamsHero,
  TeamTestimonial,
  TeamUseCases,
} from "@/components/sections/solutions/teams";

const Teams = () => {
  return (
    <div>
      <TeamsHero />
      <TeamFeatures />
      <TeamUseCases />
      <TeamTestimonial />
      <SubPageCTA
        title="Ready to collaborate"
        highlight="smarter"
        description="Request a team demo and see how Nordict helps research teams work together."
        relatedLinks={[
          {
            label: "API & Integrations",
            href: "/product/api",
            description: "Connect your tools",
          },
          {
            label: "For Traders",
            href: "/solutions/traders",
            description: "Individual trading",
          },
          {
            label: "For Investors",
            href: "/solutions/investors",
            description: "Long-term strategies",
          },
        ]}
      />
    </div>
  );
};

export default Teams;
