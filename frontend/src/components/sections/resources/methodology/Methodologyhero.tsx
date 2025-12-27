"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MethodologyHero = () => {
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
          <span className="text-sm text-neutral-500 transition-colors  dark:text-neutral-400 dark:hover:text-white">
            Resources
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Methodology
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
            Resources
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
                forecast
              </span>{" "}
              the market
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
              No black boxes. We believe you should understand{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                how predictions are made
              </span>{" "}
              before you trust them. Here's the methodology behind Nordict's
              forecasting engine.
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
                "Transparent approach—no hidden logic",
                "Quantified uncertainty with confidence scores",
                "Rigorous backtesting and validation",
                "Honest about limitations and edge cases",
              ].map((point) => (
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
                href="#overview"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Read the methodology
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
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                href="/product/performance"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  View performance data
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
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Forecasting Pipeline
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Simplified overview
                  </p>
                </div>
              </div>

              {/* Pipeline steps */}
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    label: "Data Collection",
                    desc: "Multi-source aggregation",
                  },
                  {
                    step: "2",
                    label: "Feature Engineering",
                    desc: "Signal extraction",
                  },
                  {
                    step: "3",
                    label: "Model Ensemble",
                    desc: "Multiple model voting",
                  },
                  {
                    step: "4",
                    label: "Confidence Scoring",
                    desc: "Uncertainty quantification",
                  },
                  {
                    step: "5",
                    label: "Forecast Output",
                    desc: "Direction + magnitude",
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.desc}
                      </p>
                    </div>
                    {i < 4 && (
                      <svg
                        className="h-4 w-4 text-neutral-300 dark:text-neutral-600"
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
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <svg
                  className="h-3.5 w-3.5"
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
                Detailed breakdown below
              </div>
            </div>

            {/* Decorative glow */}
            <div
              className="absolute -bottom-8 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologyHero;
