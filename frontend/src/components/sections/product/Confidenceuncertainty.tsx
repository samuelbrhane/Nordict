"use client";

import { useState, useEffect, useRef } from "react";

const CONFIDENCE_LEVELS = [
  { level: "50%", desc: "Most likely range", width: "w-[30%]", opacity: "1" },
  { level: "75%", desc: "Probable range", width: "w-[50%]", opacity: "0.6" },
  { level: "95%", desc: "Extended range", width: "w-[75%]", opacity: "0.3" },
];

const KEY_POINTS = [
  {
    title: "Calibrated probabilities",
    desc: "Confidence bands are tested against historical outcomes to ensure they mean what they claim.",
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "No false precision",
    desc: "We show ranges, not exact numbers. Markets are uncertain—our forecasts reflect that.",
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
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    title: "Regime-aware adjustment",
    desc: "Bands widen during volatile periods and tighten when conditions stabilize.",
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
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    title: "Decision-ready output",
    desc: "Use confidence levels to size positions, set stops, or decide when to wait.",
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
];

const ConfidenceUncertainty = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [animateBands, setAnimateBands] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimateBands(true), 500);
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
              Confidence & uncertainty
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
            Uncertainty is a{" "}
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
              feature
            </span>
            , not a bug.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Every forecast includes explicit confidence bands. Instead of hiding
            uncertainty behind a single number, we show you the{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              full probability distribution
            </span>{" "}
            so you can make informed decisions.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Left: Animated visualization */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8">
              {/* Chart area */}
              <div className="relative h-64 sm:h-72">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-neutral-400 dark:text-neutral-500">
                  <span>High</span>
                  <span>Mid</span>
                  <span>Low</span>
                </div>

                {/* Chart container */}
                <div className="ml-10 h-full relative">
                  {/* Horizontal grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pb-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-px bg-neutral-100 dark:bg-neutral-800"
                      />
                    ))}
                  </div>

                  {/* Confidence bands - animated */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0">
                    {CONFIDENCE_LEVELS.slice()
                      .reverse()
                      .map((band, i) => (
                        <div
                          key={band.level}
                          className={`h-12 rounded-lg transition-all duration-1000 ease-out ${
                            animateBands ? band.width : "w-0"
                          }`}
                          style={{
                            backgroundColor: "var(--brand)",
                            opacity: band.opacity,
                            transitionDelay: `${i * 200}ms`,
                          }}
                        />
                      ))}
                  </div>

                  {/* Center line (forecast) */}
                  <div
                    className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 transition-all duration-1000 ease-out ${
                      animateBands ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      backgroundColor: "var(--brand)",
                      transitionDelay: "600ms",
                    }}
                  />

                  {/* Current price marker */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-700 ${
                      animateBands
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: "800ms" }}
                  >
                    <div className="h-3 w-3 rounded-full bg-neutral-900 dark:bg-white" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Current
                    </span>
                  </div>

                  {/* X-axis */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
                    <span>Now</span>
                    <span>+6h</span>
                    <span>+12h</span>
                    <span>+24h</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div
                className={`mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-neutral-100 pt-6 dark:border-neutral-800 transition-all duration-700 ${
                  animateBands ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "1000ms" }}
              >
                {CONFIDENCE_LEVELS.map((band) => (
                  <div key={band.level} className="flex items-center gap-2">
                    <div
                      className="h-3 w-6 rounded-sm"
                      style={{
                        backgroundColor: "var(--brand)",
                        opacity: band.opacity,
                      }}
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {band.level}
                      </span>{" "}
                      {band.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Key points */}
          <div className="flex flex-col justify-center">
            <div className="grid gap-4 sm:grid-cols-2">
              {KEY_POINTS.map((point, i) => (
                <div
                  key={point.title}
                  className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-black cursor-default ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon */}
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 ${
                      hoveredCard === i
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {point.icon}
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {point.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {point.desc}
                  </p>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredCard === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidenceUncertainty;
