"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const FEATURES = [
  {
    title: "Multi-horizon forecasts",
    desc: "Switch between intraday and longer horizons to match your decision window.",
    badge: "Forecasts",
  },
  {
    title: "Confidence scoring",
    desc: "Calibrated bands and probabilities so uncertainty is explicit and usable.",
    badge: "Confidence",
  },
  {
    title: "Backtesting & performance",
    desc: "Walk-forward evaluation with metrics you can audit over time.",
    badge: "Performance",
  },
  {
    title: "Alerts & signals",
    desc: "Get notified on threshold moves, regime shifts, or confidence changes.",
    badge: "Alerts",
  },
  {
    title: "API access",
    desc: "Programmatic access to forecasts, history, and model metadata (coming soon).",
    badge: "API",
    coming: true,
  },
];

const CoreFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
      {/* subtle top line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="mx-auto max-w-7xl px-6">
        {/* header */}
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
              Core features
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
            Everything is built around{" "}
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
              confidence
            </span>{" "}
            and{" "}
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
              verification
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
            Forecasts are paired with uncertainty, performance tracking, and an
            auditable model lifecycle—so signals stay accountable.
          </p>
        </div>

        {/* grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:border-neutral-800 dark:bg-black/40 dark:hover:bg-black/60 cursor-default ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 80}ms` }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* badge */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 transition-all duration-200 ${
                    hoveredCard === i ? "border-[var(--brand)]/30" : ""
                  }`}
                >
                  {f.badge}
                </span>

                {f.coming ? (
                  <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
                    Coming soon
                  </span>
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full transition-transform duration-200 ${
                      hoveredCard === i ? "scale-125" : "scale-100"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {f.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {f.desc}
              </p>

              {/* hover accent line */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                  hoveredCard === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          ))}
        </div>

        {/* actions */}
        <div
          className={`mt-10 flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <Link
            href="/product"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-[var(--brand)]/20 active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore product
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

          <Link
            href="/resources/methodology"
            className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-black dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <span className="flex items-center gap-2">
              Read methodology
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
