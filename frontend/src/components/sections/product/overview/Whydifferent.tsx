"use client";

import { useState, useEffect, useRef } from "react";

const COMPARISON_POINTS = [
  {
    aspect: "Forecast output",
    typical: "Single point prediction",
    nordict: "Probability distributions with confidence bands",
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    aspect: "Uncertainty handling",
    typical: "Hidden or ignored",
    nordict: "Explicit, calibrated, and actionable",
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
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    aspect: "Backtesting",
    typical: "In-sample or lookahead bias",
    nordict: "Walk-forward with strict data separation",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    aspect: "Performance tracking",
    typical: "Cherry-picked or unavailable",
    nordict: "Continuous, transparent, and versioned",
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
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    aspect: "Model updates",
    typical: "Black box, no visibility",
    nordict: "Versioned with changelog and metrics",
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    aspect: "Methodology",
    typical: "Proprietary, trust us",
    nordict: "Documented with limitations disclosed",
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
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
];

const PILLARS = [
  {
    title: "Rigor",
    desc: "Every model is trained and tested with walk-forward validation. No shortcuts.",
    color: "var(--brand)",
  },
  {
    title: "Transparency",
    desc: "Methodology, limitations, and performance are documented and accessible.",
    color: "var(--brand)",
  },
  {
    title: "Calibration",
    desc: "Confidence bands are tested against outcomes so probabilities are meaningful.",
    color: "var(--brand)",
  },
];

const WhyDifferent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
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
              Why Nordict is different
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
            Built on{" "}
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
              principles
            </span>
            , not promises.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Most forecasting tools optimize for confidence. We optimize for{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              honesty
            </span>
            —showing you what we know, what we don't, and how we measure both.
          </p>
        </div>

        {/* Pillars */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 cursor-default ${
                hoveredPillar === i
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-lg"
                  : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
              }`}
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              {/* Number */}
              <span
                className={`text-4xl font-bold transition-colors duration-300 ${
                  hoveredPillar === i
                    ? "text-[var(--brand)]"
                    : "text-neutral-200 dark:text-neutral-800"
                }`}
              >
                0{i + 1}
              </span>

              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">
                {pillar.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {pillar.desc}
              </p>

              {/* Bottom accent */}
              <div
                className={`absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                  hoveredPillar === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div
          className={`mt-8 transition-all duration-700 ease-out sm:mt-12 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Desktop: Table layout */}
          <div className="hidden overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-lg sm:block dark:border-neutral-800 dark:bg-neutral-900">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="col-span-4 text-sm font-semibold text-neutral-900 dark:text-white">
                Aspect
              </div>
              <div className="col-span-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Typical approach
              </div>
              <div className="col-span-4 flex items-center gap-2 text-sm font-semibold">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span style={{ color: "var(--brand)" }}>Nordict</span>
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {COMPARISON_POINTS.map((point, i) => (
                <div
                  key={point.aspect}
                  className={`grid grid-cols-12 gap-4 px-6 py-5 transition-all duration-300 cursor-default ${
                    hoveredRow === i
                      ? "bg-[var(--brand)]/5"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  } ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${500 + i * 80}ms` }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Aspect */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                        hoveredRow === i
                          ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {point.icon}
                    </div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {point.aspect}
                    </span>
                  </div>

                  {/* Typical */}
                  <div className="col-span-4 flex items-center">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 shrink-0 text-neutral-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {point.typical}
                      </span>
                    </div>
                  </div>

                  {/* Nordict */}
                  <div className="col-span-4 flex items-center">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 shrink-0"
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
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {point.nordict}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Card layout */}
          <div className="space-y-3 sm:hidden">
            {COMPARISON_POINTS.map((point, i) => (
              <div
                key={point.aspect}
                className={`overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${500 + i * 80}ms` }}
              >
                {/* Card header */}
                <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--brand)]/15"
                    style={{ color: "var(--brand)" }}
                  >
                    <div className="[&>svg]:h-4 [&>svg]:w-4">{point.icon}</div>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {point.aspect}
                  </span>
                </div>

                {/* Card content */}
                <div className="space-y-2 p-3">
                  {/* Typical */}
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                      {point.typical}
                    </span>
                  </div>

                  {/* Nordict */}
                  <div className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
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
                    <span className="text-[11px] font-medium leading-snug text-neutral-900 dark:text-white">
                      {point.nordict}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p
          className={`mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          We're not claiming to predict the future perfectly—we're claiming to
          be honest about how well we can.
        </p>
      </div>
    </section>
  );
};

export default WhyDifferent;
