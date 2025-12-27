"use client";

import { useState, useEffect, useRef } from "react";

const VALIDATION_METHODS = [
  {
    id: "backtesting",
    title: "Historical Backtesting",
    description:
      "We test our models against years of historical data, simulating how forecasts would have performed in real market conditions.",
    methodology:
      "Walk-forward analysis with expanding training windows. No future data leakage—models only see data available at forecast time.",
    metrics: [
      { label: "Test period", value: "2019–2024" },
      { label: "Data points", value: "2M+" },
      { label: "Assets tested", value: "50+" },
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
    id: "outofsample",
    title: "Out-of-Sample Testing",
    description:
      "Models are always evaluated on data they've never seen. This prevents overfitting and ensures forecasts generalize to new conditions.",
    methodology:
      "Strict train/validation/test splits. Final model selection based only on held-out test performance, never training data.",
    metrics: [
      { label: "Train/Test split", value: "80/20" },
      { label: "Validation holdout", value: "10%" },
      { label: "No look-ahead", value: "Guaranteed" },
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: "calibration",
    title: "Confidence Calibration",
    description:
      "A 70% confidence forecast should be correct ~70% of the time. We rigorously calibrate confidence scores to match actual accuracy.",
    methodology:
      "Reliability diagrams and Brier scores track calibration. Models are recalibrated when confidence drifts from observed accuracy.",
    metrics: [
      { label: "Calibration error", value: "<5%" },
      { label: "Brier score", value: "0.18" },
      { label: "Recalibration", value: "Weekly" },
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
    id: "regime",
    title: "Regime Analysis",
    description:
      "Markets behave differently in bull runs, bear markets, and sideways chop. We evaluate performance across all market conditions.",
    methodology:
      "Segment historical data by volatility regime and trend state. Ensure models perform consistently, not just in favorable conditions.",
    metrics: [
      { label: "Regimes tested", value: "5 types" },
      { label: "Worst regime", value: "Published" },
      { label: "Regime detection", value: "Automated" },
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    id: "live",
    title: "Live Monitoring",
    description:
      "Backtests are necessary but not sufficient. We continuously monitor live forecast accuracy and flag degradation immediately.",
    methodology:
      "Real-time accuracy dashboards. Automated alerts when performance drops below thresholds. Regular model retraining cycles.",
    metrics: [
      { label: "Monitoring", value: "24/7" },
      { label: "Alert threshold", value: "5% drop" },
      { label: "Retrain cycle", value: "Monthly" },
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
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
];

const Validation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("backtesting");
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

  const activeMethod = VALIDATION_METHODS.find((m) => m.id === selectedMethod);

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
              Validation
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
            How we{" "}
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
              prove
            </span>{" "}
            it works
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Claims are easy. We hold ourselves to rigorous validation standards
            so you can trust the forecasts.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Left: Method selector */}
          <div
            className={`lg:col-span-2 space-y-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {VALIDATION_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${
                  selectedMethod === method.id
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-md ring-1 ring-[var(--brand)]/20"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                      selectedMethod === method.id
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      selectedMethod === method.id
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {method.title}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detail panel */}
          <div
            className={`lg:col-span-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {activeMethod && (
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8 h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {activeMethod.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {activeMethod.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                  {activeMethod.description}
                </p>

                {/* Methodology */}
                <div className="rounded-xl bg-white p-4 dark:bg-neutral-800 mb-6">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    Methodology
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {activeMethod.methodology}
                  </p>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    Key metrics
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activeMethod.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl border border-neutral-200 bg-white p-3 text-center dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <p
                          className="text-lg font-bold"
                          style={{ color: "var(--brand)" }}
                        >
                          {metric.value}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance link */}
        <div
          className={`mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Want to see the numbers?
              </h4>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Our Performance page shows live accuracy metrics, historical
                backtests, and confidence calibration data.
              </p>
            </div>
            <a
              href="/product/performance"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              View performance
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Validation;
