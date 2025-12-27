import { LegalHero } from "@/components/sections/legal/shared";
import { PrivacyContent } from "@/components/sections/legal/privacy";

export default function Privacy() {
  return (
    <div>
      <LegalHero
        badge="Legal"
        title="Privacy"
        highlightedWord="Policy"
        lastUpdated="December 2024"
        intro="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      />
      <PrivacyContent />
    </div>
  );
}
