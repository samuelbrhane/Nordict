"use client";

import { useState, useEffect, useRef } from "react";

const MODEL_VERSIONS = [
  {
    version: "v2.4.1",
    date: "Dec 2024",
    status: "current",
    metrics: {
      directional: 68,
      calibration: 0.92,
      brier: 0.18,
      sharpe: 1.4,
    },
    changes: [
      "Improved confidence calibration",
      "Better handling of low-volatility regimes",
      "Reduced false positive rate",
    ],
  },
  {
    version: "v2.3.0",
    date: "Oct 2024",
    status: "previous",
    metrics: {
      directional: 66,
      calibration: 0.88,
      brier: 0.21,
      sharpe: 1.2,
    },
    changes: [
      "Added weekly horizon support",
      "New feature engineering pipeline",
      "Performance optimizations",
    ],
  },
  {
    version: "v2.2.0",
    date: "Jul 2024",
    status: "archived",
    metrics: {
      directional: 64,
      calibration: 0.85,
      brier: 0.23,
      sharpe: 1.0,
    },
    changes: [
      "Regime detection improvements",
      "Extended backtest coverage",
      "Bug fixes",
    ],
  },
  {
    version: "v2.1.0",
    date: "Apr 2024",
    status: "archived",
    metrics: {
      directional: 62,
      calibration: 0.82,
      brier: 0.25,
      sharpe: 0.9,
    },
    changes: [
      "Initial confidence bands",
      "Daily horizon launch",
      "Core model architecture",
    ],
  },
];

const METRIC_LABELS = {
  directional: { label: "Directional", unit: "%", better: "higher" },
  calibration: { label: "Calibration", unit: "", better: "higher" },
  brier: { label: "Brier Score", unit: "", better: "lower" },
  sharpe: { label: "Info Ratio", unit: "", better: "higher" },
};

const ModelVersionComparison = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    "v2.4.1",
    "v2.3.0",
  ]);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
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

  const toggleVersion = (version: string) => {
    if (selectedVersions.includes(version)) {
      if (selectedVersions.length > 1) {
        setSelectedVersions(selectedVersions.filter((v) => v !== version));
      }
    } else {
      if (selectedVersions.length < 3) {
        setSelectedVersions([...selectedVersions, version]);
      }
    }
  };

  const compareVersions = MODEL_VERSIONS.filter((v) =>
    selectedVersions.includes(v.version)
  );

  const getBetterValue = (
    metric: keyof typeof METRIC_LABELS,
    values: number[]
  ) => {
    const info = METRIC_LABELS[metric];
    if (info.better === "higher") {
      return Math.max(...values);
    }
    return Math.min(...values);
  };

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
              Model version comparison
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
            Track improvements{" "}
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
              across versions
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
            Every model version is tracked with full performance history.
            Compare versions side-by-side to see exactly how improvements
            materialize.
          </p>
        </div>

        {/* Version selector */}
        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Select versions to compare (max 3)
          </p>
          <div className="flex flex-wrap gap-3">
            {MODEL_VERSIONS.map((model) => (
              <button
                key={model.version}
                onClick={() => toggleVersion(model.version)}
                className={`relative overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-300 ${
                  selectedVersions.includes(model.version)
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-200 ${
                      selectedVersions.includes(model.version)
                        ? "bg-[var(--brand)] text-black"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {model.version.slice(1, 4)}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        selectedVersions.includes(model.version)
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {model.version}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {model.date}
                    </p>
                  </div>
                  {model.status === "current" && (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      Current
                    </span>
                  )}
                </div>

                {/* Selected indicator */}
                {selectedVersions.includes(model.version) && (
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div
          className={`mt-8 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Desktop: Table layout */}
          <div className="hidden rounded-3xl border border-neutral-200 bg-white shadow-lg overflow-hidden sm:block dark:border-neutral-800 dark:bg-black">
            {/* Table header */}
            <div
              className="grid border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
              style={{
                gridTemplateColumns: `200px repeat(${compareVersions.length}, 1fr)`,
              }}
            >
              <div className="p-4">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Metric
                </p>
              </div>
              {compareVersions.map((model) => (
                <div
                  key={model.version}
                  className="p-4 text-center border-l border-neutral-200 dark:border-neutral-800"
                >
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {model.version}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {model.date}
                  </p>
                </div>
              ))}
            </div>

            {/* Metrics rows */}
            {(
              Object.keys(METRIC_LABELS) as Array<keyof typeof METRIC_LABELS>
            ).map((metric) => {
              const values = compareVersions.map((v) => v.metrics[metric]);
              const bestValue = getBetterValue(metric, values);

              return (
                <div
                  key={metric}
                  className={`grid border-b border-neutral-100 transition-colors duration-200 dark:border-neutral-800 ${
                    hoveredMetric === metric
                      ? "bg-neutral-50 dark:bg-neutral-900/50"
                      : ""
                  }`}
                  style={{
                    gridTemplateColumns: `200px repeat(${compareVersions.length}, 1fr)`,
                  }}
                  onMouseEnter={() => setHoveredMetric(metric)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="p-4 flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {METRIC_LABELS[metric].label}
                    </p>
                    <span className="text-xs text-neutral-400">
                      ({METRIC_LABELS[metric].better} is better)
                    </span>
                  </div>
                  {compareVersions.map((model) => {
                    const value = model.metrics[metric];
                    const isBest =
                      value === bestValue && compareVersions.length > 1;

                    return (
                      <div
                        key={model.version}
                        className="p-4 text-center border-l border-neutral-100 dark:border-neutral-800"
                      >
                        <p
                          className={`text-lg font-semibold ${
                            isBest
                              ? ""
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                          style={{ color: isBest ? "var(--brand)" : undefined }}
                        >
                          {value}
                          {METRIC_LABELS[metric].unit}
                        </p>
                        {isBest && (
                          <span
                            className="inline-flex items-center gap-1 mt-1 text-xs font-medium"
                            style={{ color: "var(--brand)" }}
                          >
                            <svg
                              className="h-3 w-3"
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
                            Best
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Changes row */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `200px repeat(${compareVersions.length}, 1fr)`,
              }}
            >
              <div className="p-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Key Changes
                </p>
              </div>
              {compareVersions.map((model) => (
                <div
                  key={model.version}
                  className="p-4 border-l border-neutral-100 dark:border-neutral-800"
                >
                  <ul className="space-y-1">
                    {model.changes.map((change) => (
                      <li
                        key={change}
                        className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        <span
                          className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Card layout - one card per version */}
          <div className="space-y-4 sm:hidden">
            {compareVersions.map((model) => {
              const metrics = Object.keys(METRIC_LABELS) as Array<
                keyof typeof METRIC_LABELS
              >;

              return (
                <div
                  key={model.version}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {model.version}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {model.date}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {metrics.map((metric) => {
                      const values = compareVersions.map(
                        (v) => v.metrics[metric]
                      );
                      const bestValue = getBetterValue(metric, values);
                      const value = model.metrics[metric];
                      const isBest =
                        value === bestValue && compareVersions.length > 1;

                      return (
                        <div
                          key={metric}
                          className="flex items-center justify-between px-3 py-2"
                        >
                          <div>
                            <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                              {METRIC_LABELS[metric].label}
                            </p>
                            <p className="text-[9px] text-neutral-400">
                              {METRIC_LABELS[metric].better} is better
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`text-sm font-semibold ${
                                isBest
                                  ? ""
                                  : "text-neutral-600 dark:text-neutral-400"
                              }`}
                              style={{
                                color: isBest ? "var(--brand)" : undefined,
                              }}
                            >
                              {value}
                              {METRIC_LABELS[metric].unit}
                            </p>
                            {isBest && (
                              <svg
                                className="h-3 w-3"
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
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Key changes */}
                  <div className="border-t border-neutral-100 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                    <p className="mb-1.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                      Key Changes
                    </p>
                    <ul className="space-y-1">
                      {model.changes.map((change) => (
                        <li
                          key={change}
                          className="flex items-start gap-1.5 text-[10px] leading-snug text-neutral-600 dark:text-neutral-400"
                        >
                          <span
                            className="mt-1 h-1 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: "var(--brand)" }}
                          />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div
          className={`mt-6 flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <svg
            className="h-4 w-4 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            All metrics are calculated on identical test sets for fair
            comparison. Full changelog available in documentation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ModelVersionComparison;
