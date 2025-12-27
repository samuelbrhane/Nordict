"use client";

import { useState, useEffect, useRef } from "react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For exploration and testing",
    limits: {
      requests: "100 / day",
      assets: "3",
      webhooks: "1",
      history: "7 days",
    },
    features: ["All endpoints", "Test environment", "Community support"],
    cta: "Get started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For individual traders and developers",
    limits: {
      requests: "10,000 / day",
      assets: "All",
      webhooks: "10",
      history: "1 year",
    },
    features: [
      "All endpoints",
      "Production environment",
      "Email support",
      "Webhook delivery logs",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$199",
    period: "/ month",
    description: "For teams and businesses",
    limits: {
      requests: "100,000 / day",
      assets: "All",
      webhooks: "Unlimited",
      history: "Full",
    },
    features: [
      "All endpoints",
      "Multiple API keys",
      "Priority support",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

const RATE_LIMIT_INFO = [
  {
    title: "Burst handling",
    description:
      "Short bursts above limits are allowed. We use a sliding window algorithm.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Clear headers",
    description:
      "Every response includes X-RateLimit headers showing remaining quota.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
  },
  {
    title: "Graceful degradation",
    description:
      "429 responses include Retry-After header. We never block without notice.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
];

const RateLimits = () => {
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

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-950"
    >
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div
            className={`flex items-center gap-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Rate limits & pricing
            </p>
          </div>

          <h2
            className={`mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Transparent limits,{" "}
            <span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 0%, rgba(4,236,58,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              fair pricing
            </span>
            .
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Start free, scale as you grow. All plans include access to every
            endpoint—only limits differ.
          </p>
        </div>

        {/* Pricing tiers */}
        <div
          className={`mt-10 grid gap-6 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {TIERS.map((tier, i) => {
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-[var(--brand)]/50 bg-white shadow-xl ring-1 ring-[var(--brand)]/20 dark:bg-black scale-[1.02]"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
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
                  <span
                    className={`text-4xl font-bold transition-colors duration-300 ${
                      isSelected ? "" : "text-neutral-900 dark:text-white"
                    }`}
                    style={{ color: isSelected ? "var(--brand)" : undefined }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {" "}
                    {tier.period}
                  </span>
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
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                          {key.replace("_", " ")}
                        </span>
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 shrink-0"
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

        {/* Rate limit handling info */}
        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
            How we handle rate limits
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {RATE_LIMIT_INFO.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                >
                  <div style={{ color: "var(--brand)" }}>{item.icon}</div>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise note */}
        <div
          className={`mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Need higher limits?
              </h4>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Enterprise plans with custom limits, dedicated support, and SLAs
                are available.
              </p>
            </div>
            <button
              className="shrink-0 rounded-xl px-6 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RateLimits;
