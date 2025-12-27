"use client";

import { useState, useEffect, useRef } from "react";

const DATA_CATEGORIES = [
  {
    id: "price",
    title: "Price & Volume",
    description:
      "The foundation of any market analysis. We ingest high-frequency price and volume data across multiple timeframes.",
    sources: [
      { name: "OHLCV candles", detail: "1m to 1d resolution" },
      { name: "Tick-level data", detail: "For volatility analysis" },
      { name: "Volume profiles", detail: "By exchange and aggregate" },
      { name: "Bid-ask spreads", detail: "Liquidity indicators" },
    ],
    updateFrequency: "Real-time",
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    id: "technical",
    title: "Technical Indicators",
    description:
      "Derived metrics that capture momentum, trend strength, volatility, and market structure patterns.",
    sources: [
      { name: "Momentum", detail: "RSI, MACD, Stochastic" },
      { name: "Trend", detail: "Moving averages, ADX" },
      { name: "Volatility", detail: "ATR, Bollinger Bands" },
      { name: "Structure", detail: "Support/resistance levels" },
    ],
    updateFrequency: "Hourly",
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
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
  {
    id: "crossasset",
    title: "Cross-Asset Signals",
    description:
      "No asset moves in isolation. We track correlations and relative strength across the crypto market and beyond.",
    sources: [
      { name: "BTC dominance", detail: "Market structure shifts" },
      { name: "Correlation matrix", detail: "Rolling correlations" },
      { name: "Relative strength", detail: "Asset vs. benchmark" },
      { name: "Sector rotation", detail: "DeFi, L1s, memes, etc." },
    ],
    updateFrequency: "Hourly",
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
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    id: "derivatives",
    title: "Derivatives Data",
    description:
      "Futures and options markets often lead spot. We analyze positioning, funding rates, and options flow.",
    sources: [
      { name: "Funding rates", detail: "Perpetual futures" },
      { name: "Open interest", detail: "Positioning changes" },
      { name: "Liquidation levels", detail: "Risk concentration" },
      { name: "Options flow", detail: "Put/call ratios, skew" },
    ],
    updateFrequency: "Real-time",
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    id: "onchain",
    title: "On-Chain Metrics",
    description:
      "Blockchain-native data provides insights into holder behavior, network health, and capital flows.",
    sources: [
      { name: "Exchange flows", detail: "Inflows/outflows" },
      { name: "Whale activity", detail: "Large transactions" },
      { name: "Active addresses", detail: "Network usage" },
      { name: "HODL waves", detail: "Holder distribution" },
    ],
    updateFrequency: "Daily",
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
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
];

const DataSources = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("price");
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

  const activeCategory = DATA_CATEGORIES.find((c) => c.id === selectedCategory);

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
              Data sources
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
            What{" "}
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
              feeds
            </span>{" "}
            our models
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Good forecasts require good data. Here's the full picture of what
            goes into our models.
          </p>
        </div>

        {/* Category tabs */}
        <div
          className={`mt-10 flex flex-wrap gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {DATA_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-300 ${
                selectedCategory === category.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? "text-[var(--brand)]"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {category.icon}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {category.title}
                </span>
              </div>

              {selectedCategory === category.id && (
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Active category detail */}
        {activeCategory && (
          <div
            className={`mt-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Description */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                    >
                      <div style={{ color: "var(--brand)" }}>
                        {activeCategory.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {activeCategory.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "var(--brand)" }}
                        >
                          {activeCategory.updateFrequency} updates
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {activeCategory.description}
                  </p>
                </div>

                {/* Right: Sources list */}
                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Data points
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeCategory.sources.map((source) => (
                      <div
                        key={source.name}
                        className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {source.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {source.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom stats */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {[
            { value: "50+", label: "Data sources" },
            { value: "200+", label: "Features extracted" },
            { value: "5", label: "Data categories" },
            { value: "24/7", label: "Data collection" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"
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

export default DataSources;
