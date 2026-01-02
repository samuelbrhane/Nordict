import { FinalCTA } from "@/components/sections/home";
import {
  AlertExamples,
  AlertNoise,
  AlertsHero,
  AlertTypes,
  DeliveryChannels,
  TriggerLogic,
} from "@/components/sections/product/alerts";
import SubPageCTA from "@/components/sections/shared/Subpagecta";

const Alerts = () => {
  return (
    <div>
      <AlertsHero />
      <AlertTypes />
      <TriggerLogic />
      <DeliveryChannels />
      <AlertExamples />
      {/* <AlertNoise /> */}
      <FinalCTA />
    </div>
  );
};

export default Alerts;
