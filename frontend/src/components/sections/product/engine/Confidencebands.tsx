"use client";

import { useState, useEffect, useRef } from "react";

const BAND_LEVELS = [
  {
    level: "50%",
    name: "Core Range",
    description:
      "Where price lands half the time. The most likely outcome zone.",
    width: 30,
    opacity: 1,
    example: "+1.1% to +3.8%",
  },
  {
    level: "75%",
    name: "Probable Range",
    description:
      "Captures three-quarters of outcomes. Reasonable planning zone.",
    width: 55,
    opacity: 0.6,
    example: "-0.5% to +5.2%",
  },
  {
    level: "95%",
    name: "Extended Range",
    description: "Nearly all outcomes fall here. Accounts for tail risks.",
    width: 85,
    opacity: 0.3,
    example: "-3.2% to +8.1%",
  },
];

const INTERPRETATION_POINTS = [
  {
    title: "Wider bands = more uncertainty",
    description:
      "When the model is less certain, bands expand. This isn't a flaw, it's honest communication about forecast reliability.",
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
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      </svg>
    ),
  },
  {
    title: "Calibration matters",
    description:
      "A 75% band should contain the actual outcome ~75% of the time. We test this continuously and adjust when needed.",
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
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Not trading signals",
    description:
      "Bands show probability, not recommendations. A narrow band doesn't mean 'trade now', it means the model is more certain.",
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
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    title: "Regime-aware sizing",
    description:
      "During volatile periods, bands widen automatically. During calm periods, they tighten. The model adapts to conditions.",
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
          d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
        />
      </svg>
    ),
  },
];

const ConfidenceBands = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateBands, setAnimateBands] = useState(false);
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimateBands(true), 400);
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

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
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
              Confidence bands & probabilities
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
            Understanding{" "}
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
              probability ranges
            </span>
            , not just predictions.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Confidence bands show where price might land with different
            probabilities. They turn uncertainty into something you can plan
            around.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Visualization */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8">
              {/* Chart header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Confidence Band Visualization
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Hover over bands to explore
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    BTC 24h
                  </span>
                </div>
              </div>

              {/* Band visualization */}
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-neutral-400 dark:text-neutral-500">
                  <span>+10%</span>
                  <span>+5%</span>
                  <span>0%</span>
                  <span>-5%</span>
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full relative flex items-center justify-center">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pb-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-px bg-neutral-100 dark:bg-neutral-800"
                      />
                    ))}
                  </div>

                  {/* Bands - rendered from widest to narrowest */}
                  <div className="relative w-full flex flex-col items-center justify-center">
                    {BAND_LEVELS.slice()
                      .reverse()
                      .map((band, i) => (
                        <div
                          key={band.level}
                          className={`absolute h-16 rounded-xl transition-all duration-700 ease-out cursor-pointer ${
                            hoveredBand === 2 - i
                              ? "ring-2 ring-[var(--brand)]/50"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "var(--brand)",
                            opacity:
                              hoveredBand === 2 - i
                                ? band.opacity + 0.2
                                : band.opacity,
                            width: animateBands ? `${band.width}%` : "0%",
                            transitionDelay: `${i * 150}ms`,
                          }}
                          onMouseEnter={() => setHoveredBand(2 - i)}
                          onMouseLeave={() => setHoveredBand(null)}
                        />
                      ))}

                    {/* Center line */}
                    <div
                      className={`absolute h-1 rounded-full transition-all duration-700 ease-out ${
                        animateBands ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        backgroundColor: "var(--brand)",
                        width: "10%",
                        transitionDelay: "500ms",
                      }}
                    />

                    {/* Point estimate marker */}
                    <div
                      className={`absolute h-4 w-4 rounded-full border-2 border-white shadow-lg transition-all duration-500 ${
                        animateBands
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-0"
                      }`}
                      style={{
                        backgroundColor: "var(--brand)",
                        transitionDelay: "600ms",
                      }}
                    />
                  </div>

                  {/* X-axis */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-neutral-400 dark:text-neutral-500">
                    <span>Now</span>
                    <span>+24h</span>
                  </div>
                </div>
              </div>

              {/* Band details - shown on hover */}
              <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                {hoveredBand !== null ? (
                  <div className="animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-8 rounded"
                          style={{
                            backgroundColor: "var(--brand)",
                            opacity: BAND_LEVELS[hoveredBand].opacity,
                          }}
                        />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {BAND_LEVELS[hoveredBand].level}{" "}
                          {BAND_LEVELS[hoveredBand].name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--brand)" }}
                      >
                        {BAND_LEVELS[hoveredBand].example}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                      {BAND_LEVELS[hoveredBand].description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Hover over a band to see details
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                {BAND_LEVELS.map((band) => (
                  <div key={band.level} className="flex items-center gap-2">
                    <div
                      className="h-3 w-6 rounded"
                      style={{
                        backgroundColor: "var(--brand)",
                        opacity: band.opacity,
                      }}
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {band.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interpretation points */}
          <div className="flex flex-col justify-center space-y-4">
            {INTERPRETATION_POINTS.map((point, i) => (
              <div
                key={point.title}
                className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 cursor-default ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${400 + i * 100}ms` }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                      hoveredPoint === i
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {point.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {point.description}
                    </p>
                  </div>
                </div>

                {/* Hover accent */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                    hoveredPoint === i ? "w-full" : "w-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidenceBands;
