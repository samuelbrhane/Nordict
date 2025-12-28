import {
  RoadmapCTA,
  RoadmapHero,
  RoadmapTimeline,
} from "@/components/sections/company/roadmap";
import React from "react";

const Roadmap = () => {
  return (
    <div>
      <RoadmapHero />
      <RoadmapTimeline />
      <RoadmapCTA />
    </div>
  );
};

export default Roadmap;
