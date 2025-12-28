"use client";

import { useState } from "react";
import {
  PricingCTA,
  PricingFAQ,
  PricingHero,
  PricingTiers,
} from "@/components/sections/pricing";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  return (
    <div>
      <PricingHero
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
      />
      <PricingTiers billingCycle={billingCycle} />
      <PricingFAQ />
      <PricingCTA />
    </div>
  );
};

export default Pricing;
