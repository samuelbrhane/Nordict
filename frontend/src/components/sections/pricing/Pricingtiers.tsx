"use client";

import { useState, useEffect, useRef } from "react";

interface PricingTiersProps {
  billingCycle: "monthly" | "annual";
}

const TIERS = [
  {
    id: "free",
    name: "Free",
    description: "For exploration and testing",
    monthlyPrice: 0,
    annualPrice: 0,
    limits: {
      "API requests": "100 / day",
      "Assets tracked": "3",
      Webhooks: "1",
      "Historical data": "7 days",
      "Forecast horizons": "24h only",
    },
    features: [
      "All endpoints access",
      "Test environment",
      "Community support",
      "Basic dashboard",
    ],
    cta: "Get started free",
    ctaStyle: "secondary",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For individual traders and developers",
    monthlyPrice: 49,
    annualPrice: 39,
    limits: {
      "API requests": "10,000 / day",
      "Assets tracked": "Unlimited",
      Webhooks: "10",
      "Historical data": "1 year",
      "Forecast horizons": "All (4h–30d)",
    },
    features: [
      "All endpoints access",
      "Production environment",
      "Email support",
      "Webhook delivery logs",
      "Custom alerts",
      "Confidence bands",
      "Priority API access",
    ],
    cta: "Start 14-day trial",
    ctaStyle: "primary",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For teams and businesses",
    monthlyPrice: 199,
    annualPrice: 159,
    limits: {
      "API requests": "100,000 / day",
      "Assets tracked": "Unlimited",
      Webhooks: "Unlimited",
      "Historical data": "Full history",
      "Forecast horizons": "All (4h–30d)",
    },
    features: [
      "Everything in Pro",
      "Multiple API keys",
      "Team dashboards",
      "Role-based access",
      "Shared alerts",
      "Audit logs",
      "Priority support",
      "SLA guarantee",
    ],
    cta: "Start 14-day trial",
    ctaStyle: "primary",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For institutions and large teams",
    monthlyPrice: null,
    annualPrice: null,
    limits: {
      "API requests": "Custom",
      "Assets tracked": "Unlimited",
      Webhooks: "Unlimited",
      "Historical data": "Full history",
      "Forecast horizons": "All + custom",
    },
    features: [
      "Everything in Team",
      "SSO / SAML",
      "Custom integrations",
      "Dedicated support",
      "On-premise option",
      "Custom SLA",
      "Volume discounts",
      "Training & onboarding",
    ],
    cta: "Contact sales",
    ctaStyle: "secondary",
    popular: false,
  },
];

const PricingTiers = ({ billingCycle }: PricingTiersProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("pro");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getPrice = (tier: (typeof TIERS)[0]) => {
    if (tier.monthlyPrice === null) return null;
    return billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-20 dark:bg-black"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Tiers grid */}
        <div
          className={`grid gap-6 lg:grid-cols-4 md:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {TIERS.map((tier, i) => {
            const price = getPrice(tier);
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-xl ring-1 ring-[var(--brand)]/20 scale-[1.02]"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute -right-12 top-6 rotate-45">
                    <div
                      className="px-12 py-1 text-xs font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      Selected
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl font-bold transition-colors duration-300 ${
                          isSelected ? "" : "text-neutral-900 dark:text-white"
                        }`}
                        style={{
                          color: isSelected ? "var(--brand)" : undefined,
                        }}
                      >
                        ${price}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        / month
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span
                        className={`text-4xl font-bold transition-colors duration-300 ${
                          isSelected ? "" : "text-neutral-900 dark:text-white"
                        }`}
                        style={{
                          color: isSelected ? "var(--brand)" : undefined,
                        }}
                      >
                        Custom
                      </span>
                    </div>
                  )}
                  {billingCycle === "annual" && price !== null && price > 0 && (
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Billed annually (${price * 12}/year)
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className="mb-6 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    Limits
                  </p>
                  <div className="space-y-2">
                    {Object.entries(tier.limits).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {key}
                        </span>
                        <span className="text-xs font-medium text-neutral-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    Features
                  </p>
                  <div className="space-y-2">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <svg
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: "var(--brand)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  className={`w-full rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "text-black hover:opacity-90"
                      : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "var(--brand)" : undefined,
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div
          className={`mt-10 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            All plans include access to our{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              forecasting engine
            </span>
            ,{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              confidence scores
            </span>
            , and{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              direction signals
            </span>
            . Only limits differ.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
