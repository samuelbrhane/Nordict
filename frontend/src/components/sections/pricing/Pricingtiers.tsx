"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PricingTiersProps {
  billingCycle: "monthly" | "annual";
}

const TIERS = [
  {
    id: "pro",
    name: "Pro",
    description: "For individual traders getting started",
    monthlyPrice: 9,
    annualPrice: 7,
    annualTotal: 84,
    limits: {
      Markets: "10",
      Alerts: "5",
      Sessions: "3",
      "Historical data": "30 days",
    },
    horizons: ["24H", "30D"],
    features: [
      "Probabilistic forecasts",
      "Confidence scoring",
      "Direction signals",
      "Basic alerts",
      "Email support",
    ],
    cta: "Start 7-day trial",
    ctaHref: "/signup?plan=pro",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For serious traders and investors",
    monthlyPrice: 19,
    annualPrice: 15,
    annualTotal: 180,
    limits: {
      Markets: "Unlimited",
      Alerts: "Unlimited",
      Sessions: "5",
      "Historical data": "Unlimited",
    },
    horizons: ["24H", "30D", "12W", "12M"],
    features: [
      "Everything in Pro",
      "All 4 forecast horizons",
      "Unlimited markets & alerts",
      "Full historical backtest",
      "Priority support",
    ],
    cta: "Start 7-day trial",
    ctaHref: "/signup?plan=premium",
    popular: true,
  },
  {
    id: "teams",
    name: "Teams",
    description: "For teams and organizations",
    monthlyPrice: 49,
    annualPrice: 39,
    annualTotal: 468,
    limits: {
      Markets: "Unlimited",
      Alerts: "Unlimited",
      Sessions: "Unlimited",
      "Team members": "Up to 10",
    },
    horizons: ["24H", "30D", "12W", "12M"],
    features: [
      "Everything in Premium",
      "API access",
      "Team dashboards",
      "Role-based access",
      "Shared alerts",
      "Audit logs",
    ],
    cta: "Coming soon",
    ctaHref: null,
    comingSoon: true,
    popular: false,
  },
];

const PricingTiers = ({ billingCycle }: PricingTiersProps) => {
  const [isVisible, setIsVisible] = useState(false);
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
    return billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-20 dark:bg-black"
    >
      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        {/* Tiers grid */}
        <div
          className={`grid gap-6 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {TIERS.map((tier, i) => {
            const price = getPrice(tier);
            const isPopular = tier.popular;
            const isComingSoon = tier.comingSoon;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
                  isComingSoon
                    ? "border-neutral-200 bg-neutral-50 opacity-75 dark:border-neutral-800 dark:bg-neutral-900/50"
                    : isPopular
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-xl ring-1 ring-[var(--brand)]/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -right-12 top-6 rotate-45">
                    <div
                      className="px-12 py-1 text-xs font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Coming soon badge */}
                {isComingSoon && (
                  <div className="absolute -right-10 top-6 rotate-45">
                    <div className="px-12 py-1 text-xs font-bold text-neutral-600 bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300">
                      Coming Soon
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <h3
                    className={`text-lg font-semibold ${
                      isComingSoon
                        ? "text-neutral-500 dark:text-neutral-400"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      isComingSoon
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold transition-colors duration-300 ${
                        isComingSoon
                          ? "text-neutral-400 dark:text-neutral-500"
                          : isPopular
                          ? ""
                          : "text-neutral-900 dark:text-white"
                      }`}
                      style={{
                        color:
                          isPopular && !isComingSoon
                            ? "var(--brand)"
                            : undefined,
                      }}
                    >
                      ${price.toFixed(price % 1 === 0 ? 0 : 2)}
                    </span>
                    <span
                      className={`text-sm ${
                        isComingSoon
                          ? "text-neutral-400 dark:text-neutral-500"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      / month
                    </span>
                  </div>
                  {billingCycle === "annual" && (
                    <p
                      className={`mt-1 text-xs ${
                        isComingSoon
                          ? "text-neutral-400 dark:text-neutral-500"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      Billed annually (${tier.annualTotal.toFixed(2)}/year)
                    </p>
                  )}
                </div>

                {/* Horizons */}
                <div className="mb-4">
                  <p
                    className={`text-xs font-medium uppercase tracking-wider mb-2 ${
                      isComingSoon
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Forecast Horizons
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.horizons.map((horizon) => (
                      <span
                        key={horizon}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          isComingSoon
                            ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                            : "text-black"
                        }`}
                        style={{
                          backgroundColor: isComingSoon
                            ? undefined
                            : "var(--brand)",
                        }}
                      >
                        {horizon}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Limits */}
                <div
                  className={`mb-6 rounded-xl p-4 ${
                    isComingSoon
                      ? "bg-neutral-100 dark:bg-neutral-800/50"
                      : "bg-neutral-50 dark:bg-neutral-800"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wider mb-3 ${
                      isComingSoon
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Limits
                  </p>
                  <div className="space-y-2">
                    {Object.entries(tier.limits).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={`text-xs ${
                            isComingSoon
                              ? "text-neutral-400 dark:text-neutral-500"
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {key}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isComingSoon
                              ? "text-neutral-500 dark:text-neutral-400"
                              : "text-neutral-900 dark:text-white"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 flex-1">
                  <p
                    className={`text-xs font-medium uppercase tracking-wider mb-3 ${
                      isComingSoon
                        ? "text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Features
                  </p>
                  <div className="space-y-2">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <svg
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            isComingSoon ? "text-neutral-400" : ""
                          }`}
                          style={{
                            color: isComingSoon ? undefined : "var(--brand)",
                          }}
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
                        <span
                          className={`text-sm ${
                            isComingSoon
                              ? "text-neutral-400 dark:text-neutral-500"
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {isComingSoon ? (
                  <button
                    disabled
                    className="w-full rounded-xl py-3 text-sm font-medium bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400"
                  >
                    {tier.cta}
                  </button>
                ) : tier.ctaHref ? (
                  <Link
                    href={tier.ctaHref}
                    className={`w-full rounded-xl py-3 text-sm font-medium text-center transition-all duration-200 block ${
                      isPopular
                        ? "text-black hover:opacity-90"
                        : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                    }`}
                    style={{
                      backgroundColor: isPopular ? "var(--brand)" : undefined,
                    }}
                  >
                    {tier.cta}
                  </Link>
                ) : null}
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
            All plans include{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              probabilistic forecasts
            </span>
            ,{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              confidence scores
            </span>
            , and{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              direction signals
            </span>
            . Start with a 7-day free trial of Premium.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
