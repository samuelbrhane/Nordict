"use client";

import { useState, useEffect, useRef } from "react";

const COMPARISON_DATA = [
  {
    metric: "Directional Accuracy",
    backtest: 69,
    live: 68,
    delta: -1,
    status: "aligned",
  },
  {
    metric: "Calibration Score",
    backtest: 0.91,
    live: 0.92,
    delta: 0.01,
    status: "aligned",
  },
  {
    metric: "Brier Score",
    backtest: 0.17,
    live: 0.18,
    delta: 0.01,
    status: "aligned",
  },
  {
    metric: "75% Band Coverage",
    backtest: 74,
    live: 76,
    delta: 2,
    status: "aligned",
  },
];

const KEY_DIFFERENCES = [
  {
    title: "Data availability",
    backtest: "Complete historical data, no gaps",
    live: "Real-time feeds with occasional delays",
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
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    title: "Market conditions",
    backtest: "Known regimes, can stratify analysis",
    live: "Unknown future, regime shifts possible",
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
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
  {
    title: "Execution reality",
    backtest: "Assumed perfect execution",
    live: "Actual latency and slippage",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const LiveVsBacktest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<"comparison" | "timeline">(
    "comparison"
  );
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
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
              Live vs backtest tracking
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
            Separating{" "}
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
              simulation from reality
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
            Backtest results and live performance are tracked separately—and
            clearly labeled. No mixing, no confusion about what's real.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Comparison view */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Performance Comparison
                </h3>
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Model v2.4.1
                  </span>
                </div>
              </div>

              {/* Comparison header */}
              <div className="grid grid-cols-4 gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Metric
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-500">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Backtest
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: "var(--brand)" }}
                  >
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                    Live
                  </span>
                </div>
                <div className="text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Delta
                </div>
              </div>

              {/* Comparison rows */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {COMPARISON_DATA.map((row, i) => (
                  <div
                    key={row.metric}
                    className={`grid grid-cols-4 gap-4 py-4 transition-colors duration-200 ${
                      hoveredRow === i
                        ? "bg-neutral-50 dark:bg-neutral-900/50"
                        : ""
                    }`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {row.metric}
                    </div>
                    <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                      {typeof row.backtest === "number" && row.backtest < 1
                        ? row.backtest.toFixed(2)
                        : row.backtest}
                      {row.metric.includes("Accuracy") ||
                      row.metric.includes("Coverage")
                        ? "%"
                        : ""}
                    </div>
                    <div
                      className="text-center text-sm font-semibold"
                      style={{ color: "var(--brand)" }}
                    >
                      {typeof row.live === "number" && row.live < 1
                        ? row.live.toFixed(2)
                        : row.live}
                      {row.metric.includes("Accuracy") ||
                      row.metric.includes("Coverage")
                        ? "%"
                        : ""}
                    </div>
                    <div className="text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          Math.abs(row.delta) <= 2
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {row.delta > 0 ? "+" : ""}
                        {typeof row.delta === "number" &&
                        Math.abs(row.delta) < 1
                          ? row.delta.toFixed(2)
                          : row.delta}
                        {row.metric.includes("Accuracy") ||
                        row.metric.includes("Coverage")
                          ? "%"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status indicator */}
              <div className="mt-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Live performance aligned with backtest
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      All metrics within expected variance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key differences */}
          <div
            className={`space-y-4 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Why results can differ
            </h3>

            {KEY_DIFFERENCES.map((diff, i) => (
              <div
                key={diff.title}
                className={`rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>{diff.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {diff.title}
                    </h4>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Backtest
                        </p>
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">
                          {diff.backtest}
                        </p>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
                      >
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--brand)" }}
                        >
                          Live
                        </p>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                          {diff.live}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Commitment note */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 mt-0.5 shrink-0"
                  style={{ color: "var(--brand)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Our commitment
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    We will always clearly label which results are from
                    backtests and which are from live trading. If live
                    performance significantly deviates from backtest
                    expectations, we'll investigate and communicate openly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline visualization */}
        <div
          className={`mt-8 rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
            Data Timeline
          </h3>
          <div className="relative h-12">
            {/* Timeline bar */}
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              {/* Backtest period */}
              <div
                className="absolute left-0 top-0 bottom-0 rounded-l-full"
                style={{
                  width: "70%",
                  backgroundColor: "rgba(245, 158, 11, 0.4)",
                }}
              />
              {/* Live period */}
              <div
                className="absolute right-0 top-0 bottom-0 rounded-r-full"
                style={{
                  width: "30%",
                  backgroundColor: "rgba(4, 236, 58, 0.4)",
                }}
              />
            </div>

            {/* Markers */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="h-4 w-0.5 bg-amber-500" />
              <span className="mt-1 text-xs text-neutral-500">Jan 2023</span>
            </div>
            <div className="absolute left-[70%] top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div
                className="h-4 w-0.5"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span
                className="mt-1 text-xs font-medium"
                style={{ color: "var(--brand)" }}
              >
                Live Start
              </span>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div
                className="h-4 w-0.5"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="mt-1 text-xs text-neutral-500">Now</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-6 rounded"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.4)" }}
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Backtest period (18 months)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-6 rounded"
                style={{ backgroundColor: "rgba(4, 236, 58, 0.4)" }}
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Live tracking (6 months)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveVsBacktest;
