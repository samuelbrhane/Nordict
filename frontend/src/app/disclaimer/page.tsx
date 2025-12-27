import { LegalHero } from "@/components/sections/legal/shared";
import { DisclaimerContent } from "@/components/sections/legal/disclaimer";

export default function Disclaimer() {
  return (
    <div>
      <LegalHero
        badge="Legal"
        title="Risk"
        highlightedWord="Disclaimer"
        lastUpdated="December 2024"
        intro="Important information about the risks associated with using Nordict's forecasting services."
      />
      <DisclaimerContent />
    </div>
  );
}
