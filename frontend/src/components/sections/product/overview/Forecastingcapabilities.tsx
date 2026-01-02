"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const FORECAST_TYPES = [
  {
    id: "24H",
    label: "24 Hours",
    horizon: "24H",
    title: "Short-term price movements",
    description:
      "Capture near-term directional shifts with hourly forecasts. Ideal for active traders who need timely signals with explicit uncertainty.",
    features: [
      "Hourly forecast updates",
      "Tight confidence intervals",
      "High-frequency signal detection",
      "Regime-aware adjustments",
    ],
    image: "/images/hourly",
  },
  {
    id: "30D",
    label: "30 Days",
    horizon: "30D",
    title: "Monthly directional forecasts",
    description:
      "Project price direction over the coming month with calibrated probability bands. Balances responsiveness with noise reduction.",
    features: [
      "Daily forecast generation",
      "Medium-term trend signals",
      "Volatility-adjusted bands",
      "Cross-asset correlation awareness",
    ],
    image: "/images/daily",
  },
  {
    id: "12W",
    label: "12 Weeks",
    horizon: "12W",
    title: "Quarterly outlook",
    description:
      "Extended forecasts for position sizing and portfolio-level decisions. Wider confidence bands reflect increased uncertainty.",
    features: [
      "Weekly forecast cycles",
      "Macro regime integration",
      "Downside risk emphasis",
      "Trend persistence scoring",
    ],
    image: "/images/weekly",
  },
  {
    id: "12M",
    label: "12 Months",
    horizon: "12M",
    title: "Long-term projections",
    description:
      "Annual forecasts for strategic planning and long-term investment decisions. Maximum uncertainty reflected in wide confidence bands.",
    features: [
      "Monthly forecast updates",
      "Long-term trend analysis",
      "Structural shift detection",
      "Multi-cycle awareness",
    ],
    image: "/images/monthly",
  },
];

const ForecastingCapabilities = () => {
  const [activeTab, setActiveTab] = useState("24H");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  const activeForecast = FORECAST_TYPES.find((f) => f.id === activeTab);

  return (
    <section
      ref={sectionRef}
      id="forecasting"
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

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
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
              Forecasting capabilities
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
            Forecasts across{" "}
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
              multiple horizons
            </span>
            , not just point predictions.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Each forecast includes probability distributions and confidence
            bands—so you know not just{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              what
            </span>{" "}
            the model predicts, but{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              how certain
            </span>{" "}
            it is.
          </p>
        </div>

        {/* Tabs */}
        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 p-1 sm:p-1.5 dark:border-neutral-800 dark:bg-neutral-900">
            {FORECAST_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`relative rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                  activeTab === type.id
                    ? "text-black shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }`}
              >
                {activeTab === type.id && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  {type.label}
                  {/* Hide horizon text on mobile, show on sm and up */}
                  <span
                    className={`hidden text-xs sm:inline ${
                      activeTab === type.id
                        ? "text-black/70"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    {type.horizon}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div
          className={`mt-8 grid gap-8 lg:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            {activeForecast && (
              <div
                key={activeForecast.id}
                className="animate-in fade-in duration-300"
              >
                {/* Horizon badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-800 dark:bg-neutral-900">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    {activeForecast.horizon} horizon
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
                  {activeForecast.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
                  {activeForecast.description}
                </p>

                {/* Features list */}
                <ul className="mt-6 space-y-3">
                  {activeForecast.features.map((feature, i) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 cursor-default"
                      onMouseEnter={() => setHoveredFeature(i)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                          hoveredFeature === i
                            ? "bg-[var(--brand)]/20"
                            : "bg-neutral-100 dark:bg-neutral-800"
                        }`}
                      >
                        <svg
                          className={`h-3 w-3 transition-colors duration-200 ${
                            hoveredFeature === i
                              ? "text-[var(--brand)]"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
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
                      <span
                        className={`transition-colors duration-200 ${
                          hoveredFeature === i
                            ? "text-neutral-900 dark:text-white"
                            : ""
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Right: Visual */}
          <div className="relative">
            <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 min-h-[200px] lg:min-h-[400px] flex items-center">
              {mounted && activeForecast ? (
                <Image
                  src={`${activeForecast.image}_${
                    isDark ? "black" : "white"
                  }.png`}
                  alt={activeForecast.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full"
                />
              ) : (
                <div className="aspect-video w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
              )}

              {/* Horizon indicator */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur dark:bg-black/60 dark:text-neutral-200">
                {activeForecast?.label} • {activeForecast?.horizon}
              </div>
            </div>

            {/* Decorative blur */}
            <div
              className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForecastingCapabilities;
