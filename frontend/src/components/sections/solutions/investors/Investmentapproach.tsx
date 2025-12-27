"use client";

import { useState, useEffect, useRef } from "react";

const APPROACH_PILLARS = [
  {
    id: "horizons",
    title: "Longer Horizons",
    description:
      "Focus on weekly and monthly forecasts, not hourly noise. See the bigger picture without getting distracted by daily fluctuations.",
    comparison: {
      trader: "4h, 8h, 24h forecasts",
      investor: "7d, 14d, 30d forecasts",
    },
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
  },
  {
    id: "frequency",
    title: "Lower Alert Frequency",
    description:
      "Only get notified on significant shifts. No constant pings—just meaningful updates when your attention is actually needed.",
    comparison: {
      trader: "Real-time, every shift",
      investor: "Daily digest, major changes only",
    },
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
    id: "portfolio",
    title: "Portfolio-Level View",
    description:
      "See aggregate conviction across your holdings. Understand overall portfolio sentiment, not just individual assets.",
    comparison: {
      trader: "Single asset focus",
      investor: "Weighted portfolio score",
    },
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
    id: "patience",
    title: "Patience-First Signals",
    description:
      "Designed to reduce overtrading. Signals encourage waiting for high-conviction moments rather than constant action.",
    comparison: {
      trader: "Optimize for opportunities",
      investor: "Optimize for conviction",
    },
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
];

const InvestmentApproach = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState("horizons");
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

  const activePillar = APPROACH_PILLARS.find((p) => p.id === selectedPillar);

  return (
    <section
      ref={sectionRef}
      id="approach"
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
              Investment approach
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
            Different goals,{" "}
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
              different tools
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
            Investors and traders have different needs. Here's how Nordict
            adapts to a long-term, lower-frequency approach.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Pillar selector */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {APPROACH_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar.id)}
                className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 ${
                  selectedPillar === pillar.id
                    ? "border-[var(--brand)]/50 bg-white shadow-lg ring-1 ring-[var(--brand)]/20 dark:bg-black"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                      selectedPillar === pillar.id
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {pillar.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        selectedPillar === pillar.id
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detail panel */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {activePillar && (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {activePillar.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {activePillar.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-8">
                  {activePillar.description}
                </p>

                {/* Comparison */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    How it differs
                  </h4>

                  {/* Trader approach */}
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700">
                        <svg
                          className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Trader approach
                        </p>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {activePillar.comparison.trader}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Investor approach */}
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: "rgba(4,236,58,0.3)",
                      backgroundColor: "rgba(4,236,58,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "rgba(4,236,58,0.2)" }}
                      >
                        <svg
                          className="h-4 w-4"
                          style={{ color: "var(--brand)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-xs"
                          style={{ color: "var(--brand)" }}
                        >
                          Investor approach
                        </p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {activePillar.comparison.investor}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom callout */}
        <div
          className={`mt-10 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Same engine, different lens
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                The underlying forecasting engine is identical. What changes is
                how you consume the signals—longer timeframes, aggregated views,
                and patience-optimized alerts designed for investors who check
                in weekly, not hourly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentApproach;
