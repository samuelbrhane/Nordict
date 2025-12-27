"use client";

import { useState, useEffect, useRef } from "react";

const METRICS = [
  {
    id: "directional",
    name: "Directional Accuracy",
    value: "68%",
    description:
      "Percentage of forecasts where the predicted direction (up/down) matched the actual outcome.",
    why: "The most intuitive measure. If you're making decisions based on direction, this tells you how often we get it right.",
    interpretation:
      "Higher is better. 50% is random. We target 65%+ consistently.",
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    id: "calibration",
    name: "Calibration Score",
    value: "0.92",
    description:
      "How well confidence levels match actual accuracy. A 70% confidence should be correct ~70% of the time.",
    why: "Confidence only matters if it's meaningful. This metric ensures our probabilities aren't just made up.",
    interpretation:
      "1.0 is perfect calibration. Above 0.9 is excellent. Below 0.8 needs investigation.",
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
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    id: "brier",
    name: "Brier Score",
    value: "0.18",
    description:
      "Mean squared error of probabilistic forecasts. Measures both calibration and sharpness together.",
    why: "A comprehensive score that penalizes both overconfidence and underconfidence. Industry standard for probabilistic forecasts.",
    interpretation:
      "Lower is better. 0.25 is random for binary outcomes. Below 0.2 indicates skill.",
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
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    id: "sharpe",
    name: "Information Ratio",
    value: "1.4",
    description:
      "Risk-adjusted measure of forecast value. Compares forecast-based returns to a baseline, normalized by volatility.",
    why: "Raw accuracy doesn't account for risk. This shows if forecasts add value after adjusting for the uncertainty involved.",
    interpretation:
      "Higher is better. Above 1.0 indicates consistent value-add. Above 2.0 is exceptional.",
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
    id: "coverage",
    name: "Band Coverage",
    value: "76%",
    description:
      "Percentage of actual outcomes that fell within the 75% confidence band.",
    why: "Tests if our uncertainty estimates are honest. If the 75% band only catches 50% of outcomes, we're overconfident.",
    interpretation:
      "Should match the band level. 75% band should have ~75% coverage. Deviation indicates miscalibration.",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: "mae",
    name: "Mean Absolute Error",
    value: "1.8%",
    description:
      "Average absolute difference between predicted and actual price changes.",
    why: "A straightforward measure of prediction accuracy in the units you care about—percentage points.",
    interpretation:
      "Lower is better. Context-dependent on asset volatility. Compare across similar assets.",
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
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        />
      </svg>
    ),
  },
];

const EvaluationMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
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

  const selectedMetric = METRICS.find((m) => m.id === activeMetric);

  return (
    <section
      ref={sectionRef}
      id="metrics"
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
              Evaluation metrics
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
            The metrics that{" "}
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
              actually matter
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
            We track multiple metrics because no single number tells the whole
            story. Each measures a different aspect of forecast quality.
          </p>
        </div>

        {/* Metrics grid */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {METRICS.map((metric, i) => (
            <button
              key={metric.id}
              onClick={() =>
                setActiveMetric(activeMetric === metric.id ? null : metric.id)
              }
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                activeMetric === metric.id
                  ? "border-[var(--brand)]/50 bg-white shadow-lg ring-1 ring-[var(--brand)]/20 dark:bg-black"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
              onMouseEnter={() => setHoveredMetric(i)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 ${
                    activeMetric === metric.id || hoveredMetric === i
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {metric.icon}
                </div>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  {metric.value}
                </p>
              </div>

              <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">
                {metric.name}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {metric.description}
              </p>

              {/* Expand indicator */}
              <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500">
                <span>{activeMetric === metric.id ? "Less" : "More"}</span>
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${
                    activeMetric === metric.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                  activeMetric === metric.id || hoveredMetric === i
                    ? "w-full"
                    : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </button>
          ))}
        </div>

        {/* Expanded metric detail */}
        {selectedMetric && (
          <div
            className={`mt-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8`}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Why this metric */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Why we track this
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {selectedMetric.why}
                </p>
              </div>

              {/* How to interpret */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    How to interpret
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {selectedMetric.interpretation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom note */}
        <p
          className={`mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          All values shown are illustrative. Actual metrics are updated in
          real-time in the dashboard.
        </p>
      </div>
    </section>
  );
};

export default EvaluationMetrics;
