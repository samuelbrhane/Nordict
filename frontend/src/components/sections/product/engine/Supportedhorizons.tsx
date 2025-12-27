"use client";

import { useState, useEffect, useRef } from "react";

const HORIZONS = [
  {
    id: "intraday",
    name: "Intraday",
    range: "1–24 hours",
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
    description:
      "Short-term forecasts for capturing near-term price movements. Updated hourly with tight confidence intervals.",
    bestFor: [
      "Day traders",
      "Scalping strategies",
      "Timing entries/exits",
      "High-frequency decisions",
    ],
    characteristics: [
      { label: "Update frequency", value: "Hourly" },
      { label: "Confidence precision", value: "High" },
      { label: "Signal volatility", value: "Higher" },
    ],
  },
  {
    id: "daily",
    name: "Daily",
    range: "1–7 days",
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
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
    description:
      "Multi-day directional forecasts balancing responsiveness with noise reduction. Ideal for swing trading.",
    bestFor: [
      "Swing traders",
      "Position sizing",
      "Risk management",
      "Weekly planning",
    ],
    characteristics: [
      { label: "Update frequency", value: "Daily" },
      { label: "Confidence precision", value: "Medium" },
      { label: "Signal volatility", value: "Moderate" },
    ],
  },
  {
    id: "weekly",
    name: "Weekly",
    range: "1–4 weeks",
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
    description:
      "Extended outlook for portfolio-level decisions. Wider confidence bands reflect longer-term uncertainty.",
    bestFor: [
      "Investors",
      "Portfolio allocation",
      "Macro trend analysis",
      "Long-term positioning",
    ],
    characteristics: [
      { label: "Update frequency", value: "Weekly" },
      { label: "Confidence precision", value: "Wider bands" },
      { label: "Signal volatility", value: "Lower" },
    ],
  },
];

const SupportedHorizons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeHorizon, setActiveHorizon] = useState("daily");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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

  const selectedHorizon = HORIZONS.find((h) => h.id === activeHorizon);

  return (
    <section
      ref={sectionRef}
      id="horizons"
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
              Supported horizons
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
            Choose the{" "}
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
              time horizon
            </span>{" "}
            that fits your strategy.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Different decisions need different timeframes. Nordict supports
            multiple horizons, each with appropriate confidence calibration.
          </p>
        </div>

        {/* Horizon selector */}
        <div
          className={`mt-10 flex flex-wrap gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {HORIZONS.map((horizon) => (
            <button
              key={horizon.id}
              onClick={() => setActiveHorizon(horizon.id)}
              className={`group relative overflow-hidden rounded-2xl border px-5 py-3 transition-all duration-300 ${
                activeHorizon === horizon.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 ${
                    activeHorizon === horizon.id
                      ? "bg-[var(--brand)]/20 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {horizon.icon}
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      activeHorizon === horizon.id
                        ? "text-[var(--brand)]"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {horizon.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {horizon.range}
                  </p>
                </div>
              </div>

              {/* Active indicator */}
              {activeHorizon === horizon.id && (
                <div
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Selected horizon details */}
        <div
          className={`mt-8 grid gap-8 lg:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Left: Description & Best For */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black sm:p-8">
            {selectedHorizon && (
              <div
                key={selectedHorizon.id}
                className="animate-in fade-in duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {selectedHorizon.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {selectedHorizon.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedHorizon.range}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {selectedHorizon.description}
                </p>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Best for
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedHorizon.bestFor.map((use) => (
                      <span
                        key={use}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Characteristics */}
          <div className="space-y-4">
            {selectedHorizon?.characteristics.map((char, i) => (
              <div
                key={char.label}
                className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 cursor-default ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {char.label}
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    {char.value}
                  </p>
                </div>

                {/* Hover accent */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                    hoveredCard === i ? "w-full" : "w-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              </div>
            ))}

            {/* Visual timeline */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Horizon comparison
              </p>
              <div className="space-y-3">
                {HORIZONS.map((h) => (
                  <div key={h.id} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-neutral-600 dark:text-neutral-400">
                      {h.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          h.id === activeHorizon ? "opacity-100" : "opacity-40"
                        }`}
                        style={{
                          backgroundColor: "var(--brand)",
                          width:
                            h.id === "intraday"
                              ? "25%"
                              : h.id === "daily"
                              ? "50%"
                              : "100%",
                        }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs text-neutral-500 dark:text-neutral-500">
                      {h.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportedHorizons;
