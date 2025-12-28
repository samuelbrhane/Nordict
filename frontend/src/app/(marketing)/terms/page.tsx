import { LegalHero } from "@/components/sections/legal/shared";
import { TermsContent } from "@/components/sections/legal/terms";

export default function Terms() {
  return (
    <div>
      <LegalHero
        badge="Legal"
        title="Terms of"
        highlightedWord="Service"
        lastUpdated="December 2024"
        intro="Please read these terms carefully before using Nordict's services."
      />
      <TermsContent />
    </div>
  );
}
