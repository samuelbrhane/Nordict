"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(4,236,58,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-5 sm:pb-20 sm:pt-10">
        <div className="max-w-3xl">
          {/* animated pill */}
          <p
            className={`inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/60 px-3 py-1 text-xs text-neutral-700 backdrop-blur transition-all duration-700 ease-out dark:border-neutral-800 dark:bg-black/40 dark:text-neutral-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="flex items-center gap-1.5">
              <span className="transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white cursor-default">
                AI-powered forecasts
              </span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white cursor-default">
                Confidence scoring
              </span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="transition-colors duration-200 hover:text-neutral-900 dark:hover:text-white cursor-default">
                Transparent backtests
              </span>
            </span>
          </p>

          {/* headline - simple fade in */}
          <h1
            className={`mt-5 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            AI-powered market{" "}
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
              forecasts
            </span>{" "}
            with calibrated{" "}
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
            </span>
          </h1>

          {/* subtitle */}
          <p
            className={`mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Modelis uses{" "}
            <span className="relative inline-block group cursor-default">
              <span className="relative z-10 font-medium text-neutral-800 dark:text-neutral-100">
                multiple AI models{" "}
              </span>
              <span
                className="absolute bottom-0 left-0 h-[2px] w-full rounded-full opacity-40 transition-opacity duration-200 group-hover:opacity-70"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </span>{" "}
            trained on historical market data to generate{" "}
            <span className="relative inline-block group cursor-default">
              <span className="relative z-10 font-medium text-neutral-800 dark:text-neutral-100">
                probabilistic price forecasts
              </span>
              <span
                className="absolute bottom-0 left-0 h-[2px] w-full rounded-full opacity-40 transition-opacity duration-200 group-hover:opacity-70"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </span>{" "}
            across multiple time horizons—tracked and evaluated with{" "}
            <span className="relative inline-block group cursor-default">
              <span className="relative z-10 font-medium text-neutral-800 dark:text-neutral-100">
                walk-forward backtesting
              </span>
              <span
                className="absolute bottom-0 left-0 h-[2px] w-full rounded-full opacity-40 transition-opacity duration-200 group-hover:opacity-70"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </span>
            .
          </p>

          {/* actions */}
          <div
            className={`mt-6 flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              href="/pricing"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-3 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-[var(--brand)]/20 active:scale-[0.98]"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started
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
              className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-200 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-black dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:border-neutral-700"
            >
              <span className="flex items-center gap-2">
                View methodology
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

            <p className="w-full text-xs text-neutral-500 dark:text-neutral-400 sm:w-auto sm:pl-2">
              Supported markets: Crypto • Indices • FX (coming)
            </p>
          </div>

          {/* proof cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                title: "ML-driven models",
                desc: "Trained on historical data and evaluated out-of-sample.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Confidence bands",
                desc: "Uncertainty is explicit—not hidden.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Walk-forward evaluation",
                desc: "Backtests designed to avoid leakage.",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={`group relative rounded-2xl border border-neutral-200 bg-white/60 p-4 text-sm text-neutral-700 backdrop-blur shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-black/40 dark:text-neutral-300 cursor-default ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-3 inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
                      hoveredCard === i
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {card.icon}
                  </div>

                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {card.title}
                  </p>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                    {card.desc}
                  </p>

                  {/* Animated underline */}
                  <div
                    className={`mt-4 h-0.5 rounded-full transition-all duration-300 ease-out ${
                      hoveredCard === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
