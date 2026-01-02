"use client";

import { useEffect, useState } from "react";

const AboutHero = () => {
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

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Badge */}
        <div
          className={`flex justify-center mb-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              About
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1
            className={`text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Making markets{" "}
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
              more predictable
            </span>
          </h1>

          <p
            className={`mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg max-w-2xl mx-auto transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Nordict exists to give traders and investors an edge, not through
            hype or promises, but through{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              rigorous, transparent forecasting
            </span>{" "}
            that quantifies both predictions and uncertainty.
          </p>
        </div>

        {/* Mission statement */}
        <div
          className={`mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-7 w-7"
                style={{ color: "var(--brand)" }}
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
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                The mission
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Build the most honest, transparent, and useful market
                forecasting tool available. No black boxes. No overpromising.
                Just data-driven insights with clearly quantified confidence
                levels.
              </p>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {[
            { value: "2025", label: "Founded" },
            { value: "50+", label: "Markets covered" },
            { value: "24/7", label: "Forecast updates" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--brand)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
