"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const InvestorsHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const portfolioAssets = [
    {
      asset: "BTC",
      allocation: 45,
      direction: "Bullish",
      confidence: 71,
      change: "+2.1%",
    },
    {
      asset: "ETH",
      allocation: 30,
      direction: "Bullish",
      confidence: 68,
      change: "+1.4%",
    },
    {
      asset: "SOL",
      allocation: 15,
      direction: "Neutral",
      confidence: 52,
      change: "-0.3%",
    },
    {
      asset: "LINK",
      allocation: 10,
      direction: "Bullish",
      confidence: 74,
      change: "+3.2%",
    },
  ];

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
            Solutions
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            For Investors
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
            Solutions
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
              Invest with{" "}
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
                patience
              </span>
              , informed by data
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
              Long-term forecasts and portfolio-level insights help you{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                time entries better
              </span>
              , rebalance with confidence, and stay calm through volatility.
            </p>

            {/* Key benefits */}
            <div
              className={`mt-8 space-y-3 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                "Weekly and monthly forecast horizons",
                "Portfolio-level conviction scores",
                "DCA timing optimization signals",
                "Low-frequency alerts for major shifts only",
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
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start investing smarter
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
                href="#approach"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  See the approach
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

          {/* Right: Portfolio overview mockup */}
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Portfolio Overview
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    30-day forecast outlook
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full bg-[var(--brand)]/20 px-2.5 py-0.5 text-xs font-medium"
                    style={{ color: "var(--brand)" }}
                  >
                    68% Bullish
                  </span>
                </div>
              </div>

              {/* Portfolio assets */}
              <div className="space-y-3">
                {portfolioAssets.map((item, i) => (
                  <div
                    key={item.asset}
                    className={`rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 transition-all duration-500`}
                    style={{ transitionDelay: `${600 + i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                          {item.asset}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {item.allocation}% allocation
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.direction} • {item.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          item.change.startsWith("+")
                            ? "text-[var(--brand)]"
                            : item.change.startsWith("-")
                            ? "text-red-500"
                            : "text-neutral-500"
                        }`}
                      >
                        {item.change}
                      </span>
                    </div>

                    {/* Allocation bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: isVisible ? `${item.allocation}%` : "0%",
                          backgroundColor:
                            item.direction === "Bullish"
                              ? "var(--brand)"
                              : item.direction === "Bearish"
                              ? "#ef4444"
                              : "#a3a3a3",
                          transitionDelay: `${800 + i * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Overall outlook
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Cautiously optimistic
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Suggested action
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--brand)" }}
                    >
                      Hold + DCA
                    </p>
                  </div>
                </div>
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
                Sample portfolio • Not financial advice
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

export default InvestorsHero;
