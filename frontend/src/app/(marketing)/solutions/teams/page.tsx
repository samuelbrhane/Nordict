import { FinalCTA } from "@/components/sections/home";
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
      {/* <TeamTestimonial /> */}
      <FinalCTA />
    </div>
  );
};

export default Teams;
