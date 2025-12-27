"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PerformanceHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-20 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-10 dark:opacity-20" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div
          className={`mb-6 flex items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <Link
            href="/"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <Link
            href="/product"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Product
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Performance & Backtesting
          </span>
        </div>

        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Deep Dive
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <div>
            {/* Headline */}
            <h1
              className={`text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Performance tracking as a{" "}
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
                first-class feature
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              How do you know if forecasts are any good? We built performance
              tracking into the core of Nordict—not as an afterthought, but as
              the{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                foundation of trust
              </span>
              .
            </p>

            {/* Key principles */}
            <div
              className={`mt-8 space-y-3 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                "Walk-forward validation mirrors real deployment",
                "Every forecast is tracked against actual outcomes",
                "Performance is versioned alongside models",
                "No cherry-picking—all results visible",
              ].map((point, i) => (
                <div key={point} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <svg
                      className="h-3 w-3"
                      style={{ color: "var(--brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request access
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                href="#metrics"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  See metrics
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              {/* Mock performance dashboard */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Performance Dashboard
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Last 30 days • Model v2.4.1
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Live
                    </span>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Directional Accuracy",
                      value: "68%",
                      trend: "+2.1%",
                    },
                    {
                      label: "Calibration Score",
                      value: "0.92",
                      trend: "+0.04",
                    },
                    { label: "Avg Confidence", value: "71%", trend: "-1.3%" },
                    { label: "Forecasts Made", value: "12,847", trend: "+847" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {metric.label}
                      </p>
                      <div className="mt-1 flex items-end justify-between">
                        <p
                          className="text-xl font-semibold"
                          style={{ color: "var(--brand)" }}
                        >
                          {metric.value}
                        </p>
                        <span
                          className={`text-xs font-medium ${
                            metric.trend.startsWith("+")
                              ? "text-green-600"
                              : metric.trend.startsWith("-")
                              ? "text-amber-600"
                              : "text-neutral-500"
                          }`}
                        >
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini chart */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Rolling Accuracy
                    </p>
                    <p className="text-xs text-neutral-500">7-day MA</p>
                  </div>
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-1 h-16">
                    {[65, 70, 68, 72, 69, 71, 68, 74, 70, 67, 72, 68].map(
                      (val, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all duration-500"
                          style={{
                            height: `${val}%`,
                            backgroundColor:
                              val >= 70 ? "var(--brand)" : "rgba(4,236,58,0.4)",
                            transitionDelay: `${i * 50}ms`,
                          }}
                        />
                      )
                    )}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-neutral-400">
                    <span>12 weeks ago</span>
                    <span>Now</span>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
                  <div className="flex items-center gap-2">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      All systems operational
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Updated 2 min ago
                  </span>
                </div>
              </div>

              {/* Decorative glow */}
              <div
                className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceHero;
