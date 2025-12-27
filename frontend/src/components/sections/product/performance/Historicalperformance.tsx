"use client";

import { useState, useEffect, useRef } from "react";

const TIME_PERIODS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "1y", label: "1Y" },
  { id: "all", label: "All" },
];

const CHART_DATA_BY_PERIOD: Record<
  string,
  { label: string; accuracy: number }[]
> = {
  "7d": [
    { label: "Mon", accuracy: 71 },
    { label: "Tue", accuracy: 68 },
    { label: "Wed", accuracy: 74 },
    { label: "Thu", accuracy: 66 },
    { label: "Fri", accuracy: 72 },
    { label: "Sat", accuracy: 69 },
    { label: "Sun", accuracy: 70 },
  ],
  "30d": [
    { label: "W1", accuracy: 67 },
    { label: "W2", accuracy: 71 },
    { label: "W3", accuracy: 65 },
    { label: "W4", accuracy: 73 },
  ],
  "90d": [
    { label: "Oct", accuracy: 68 },
    { label: "Nov", accuracy: 71 },
    { label: "Dec", accuracy: 69 },
  ],
  "1y": [
    { label: "Jan", accuracy: 65 },
    { label: "Feb", accuracy: 68 },
    { label: "Mar", accuracy: 64 },
    { label: "Apr", accuracy: 71 },
    { label: "May", accuracy: 69 },
    { label: "Jun", accuracy: 72 },
    { label: "Jul", accuracy: 67 },
    { label: "Aug", accuracy: 70 },
    { label: "Sep", accuracy: 73 },
    { label: "Oct", accuracy: 68 },
    { label: "Nov", accuracy: 71 },
    { label: "Dec", accuracy: 69 },
  ],
  all: [
    { label: "2022", accuracy: 62 },
    { label: "2023", accuracy: 66 },
    { label: "2024", accuracy: 69 },
  ],
};

const REGIME_DATA = [
  {
    regime: "Trending Up",
    accuracy: 74,
    forecasts: 3247,
    color: "var(--brand)",
  },
  {
    regime: "Trending Down",
    accuracy: 71,
    forecasts: 2891,
    color: "var(--brand)",
  },
  {
    regime: "Ranging",
    accuracy: 62,
    forecasts: 4102,
    color: "#f59e0b",
  },
  {
    regime: "High Volatility",
    accuracy: 58,
    forecasts: 1847,
    color: "#ef4444",
  },
];

const HistoricalPerformance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1y");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredRegime, setHoveredRegime] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId);
    setAnimationKey((prev) => prev + 1);
  };

  const currentChartData =
    CHART_DATA_BY_PERIOD[selectedPeriod] || CHART_DATA_BY_PERIOD["1y"];

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
      {/* CSS Animation for bars */}
      <style jsx>{`
        @keyframes growUp {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
      `}</style>
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
              Historical performance views
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
            Inspect performance{" "}
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
              across time and regimes
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
            Performance isn't static. See how forecasts have performed over
            different time periods and market conditions.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Left: Time-series chart (2 cols) */}
          <div
            className={`lg:col-span-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
              {/* Chart header */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Directional Accuracy Over Time
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Rolling 30-day accuracy vs 50% baseline
                  </p>
                </div>

                {/* Period selector */}
                <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  {TIME_PERIODS.map((period) => (
                    <button
                      key={period.id}
                      onClick={() => handlePeriodChange(period.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        selectedPeriod === period.id
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-neutral-400 dark:text-neutral-500">
                  <span>80%</span>
                  <span>70%</span>
                  <span>60%</span>
                  <span>50%</span>
                  <span>40%</span>
                </div>

                {/* Chart area */}
                <div className="ml-10 h-full">
                  {/* Grid lines */}
                  <div className="absolute inset-0 ml-10 flex flex-col justify-between pb-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-px ${
                          i === 2
                            ? "bg-neutral-300 dark:bg-neutral-600"
                            : "bg-neutral-100 dark:bg-neutral-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Baseline label */}
                  <div className="absolute right-0 top-[60%] -translate-y-1/2 text-xs text-neutral-400 dark:text-neutral-500">
                    Baseline (50%)
                  </div>

                  {/* Bars */}
                  <div
                    key={animationKey}
                    className="relative h-full pb-8 flex items-end justify-between gap-1"
                  >
                    {currentChartData.map((data, i) => {
                      const height = ((data.accuracy - 40) / 40) * 100;

                      return (
                        <div
                          key={`${selectedPeriod}-${data.label}`}
                          className="flex-1 flex flex-col items-center"
                          onMouseEnter={() => setHoveredBar(i)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Tooltip */}
                          {hoveredBar === i && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-lg border border-neutral-200 bg-white px-2 py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-10">
                              <p
                                className="text-xs font-semibold"
                                style={{ color: "var(--brand)" }}
                              >
                                {data.accuracy}%
                              </p>
                            </div>
                          )}

                          {/* Bar */}
                          <div
                            className={`w-full rounded-t transition-all duration-500 cursor-pointer ${
                              hoveredBar === i ? "opacity-100" : "opacity-80"
                            }`}
                            style={{
                              height: `${height}%`,
                              backgroundColor:
                                data.accuracy >= 65
                                  ? "var(--brand)"
                                  : "#f59e0b",
                              animation: "growUp 0.5s ease-out forwards",
                              animationDelay: `${i * 50}ms`,
                            }}
                          />

                          {/* X-axis label */}
                          <span className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            {data.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart legend */}
              <div className="mt-4 flex items-center justify-center gap-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-6 rounded"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Above target (≥65%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-6 rounded"
                    style={{ backgroundColor: "#f59e0b" }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Below target (&lt;65%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Regime breakdown */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black h-full">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                By Market Regime
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Performance varies by conditions
              </p>

              <div className="mt-6 space-y-4">
                {REGIME_DATA.map((regime, i) => (
                  <div
                    key={regime.regime}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-default ${
                      hoveredRegime === i
                        ? "border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800"
                        : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                    }`}
                    onMouseEnter={() => setHoveredRegime(i)}
                    onMouseLeave={() => setHoveredRegime(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {regime.regime}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {regime.forecasts.toLocaleString()} forecasts
                        </p>
                      </div>
                      <p
                        className="text-xl font-semibold"
                        style={{ color: regime.color }}
                      >
                        {regime.accuracy}%
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: isVisible ? `${regime.accuracy}%` : "0%",
                          backgroundColor: regime.color,
                          transitionDelay: `${500 + i * 100}ms`,
                        }}
                      />
                    </div>

                    {/* Hover accent */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                        hoveredRegime === i ? "w-full" : "w-0"
                      }`}
                      style={{ backgroundColor: regime.color }}
                    />
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="mt-6 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <div className="flex items-start gap-2">
                  <svg
                    className="h-4 w-4 mt-0.5 shrink-0"
                    style={{ color: "var(--brand)" }}
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
                  <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    Performance is strongest in trending markets and weaker
                    during high volatility. This is expected—and honestly
                    reported.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {[
            { label: "Total forecasts tracked", value: "48,291" },
            { label: "Tracking period", value: "18 months" },
            { label: "Assets covered", value: "12" },
            { label: "Data points analyzed", value: "2.4M" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
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

export default HistoricalPerformance;
