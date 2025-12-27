"use client";

import { useState, useEffect, useRef } from "react";

const FEATURES = [
  {
    id: "intraday",
    title: "Intraday Forecasts",
    description:
      "Hourly updates for short-term trading. See direction shifts as they develop, not hours later.",
    highlight: "Updated every hour",
    details: [
      "4h, 8h, 12h, 24h horizons",
      "Direction + magnitude forecasts",
      "Confidence scores per timeframe",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "confidence",
    title: "Confidence Scoring",
    description:
      "Know when to size up and when to stay small. Confidence scores quantify forecast conviction.",
    highlight: "0-100% scale",
    details: [
      "Higher confidence = stronger signal",
      "Historical accuracy by confidence level",
      "Separate scores per horizon",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    id: "alerts",
    title: "Real-time Alerts",
    description:
      "Don't stare at screens. Get notified when setups emerge or when your positions need attention.",
    highlight: "Sub-second delivery",
    details: [
      "Direction flip alerts",
      "Confidence threshold triggers",
      "Custom condition combinations",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
  },
  {
    id: "bands",
    title: "Confidence Bands",
    description:
      "Visualize expected price ranges. Know when moves are within expectations vs. genuine breakouts.",
    highlight: "50%, 75%, 95% bands",
    details: [
      "Dynamic range forecasts",
      "Band breach alerts",
      "Historical band accuracy",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
        />
      </svg>
    ),
  },
  {
    id: "multiasset",
    title: "Multi-asset View",
    description:
      "Compare forecasts across your watchlist. Spot relative strength and identify the best setups.",
    highlight: "Side-by-side comparison",
    details: [
      "Customizable watchlists",
      "Sort by confidence or forecast",
      "Cross-asset correlation signals",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    id: "api",
    title: "API Integration",
    description:
      "Pipe forecasts directly into your trading tools. Automate signal logging and analysis.",
    highlight: "REST + Webhooks",
    details: [
      "Real-time webhook events",
      "Historical data access",
      "Python & JS SDKs",
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
  },
];

const TraderFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(
    "intraday"
  );
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
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

  const activeFeature = FEATURES.find((f) => f.id === selectedFeature);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 dark:bg-black"
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
              Features for traders
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
            Built for{" "}
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
              speed and clarity
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
            Every feature is designed with active traders in mind—quick to scan,
            easy to act on, and integrated into your existing workflow.
          </p>
        </div>

        {/* Features grid */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {FEATURES.map((feature, i) => (
            <button
              key={feature.id}
              onClick={() =>
                setSelectedFeature(
                  selectedFeature === feature.id ? null : feature.id
                )
              }
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                selectedFeature === feature.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-lg ring-1 ring-[var(--brand)]/20"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                    selectedFeature === feature.id || hoveredFeature === i
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {feature.icon}
                </div>

                {/* Highlight badge */}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-200 ${
                    selectedFeature === feature.id
                      ? "bg-[var(--brand)] text-black"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {feature.highlight}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                {feature.title}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>

              {/* Hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                  selectedFeature === feature.id || hoveredFeature === i
                    ? "w-full"
                    : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </button>
          ))}
        </div>

        {/* Expanded detail panel */}
        {activeFeature && (
          <div
            className={`mt-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8`}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: Feature details */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {activeFeature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {activeFeature.title}
                    </h3>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--brand)" }}
                    >
                      {activeFeature.highlight}
                    </span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {activeFeature.description}
                </p>
              </div>

              {/* Right: Details list */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  What you get
                </h4>
                <div className="space-y-2">
                  {activeFeature.details.map((detail, i) => (
                    <div
                      key={detail}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          style={{ color: "var(--brand)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom stats */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            { value: "4", label: "Intraday horizons" },
            { value: "<1s", label: "Alert delivery" },
            { value: "24/7", label: "Market coverage" },
            { value: "100+", label: "Assets tracked" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p
                className="text-2xl font-semibold"
                style={{ color: "var(--brand)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TraderFeatures;
