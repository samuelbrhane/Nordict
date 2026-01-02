import { FinalCTA } from "@/components/sections/home";
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
      {/* <ForecastOutputs /> */}
      <ConfidenceBands />
      <ModelLifecycle />
      <UpdateFrequency />
      <FinalCTA />
    </div>
  );
};

export default ForecastEngine;
