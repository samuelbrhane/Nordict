"use client";

import { useState, useEffect, useRef } from "react";

const ENDPOINT_CATEGORIES = [
  {
    id: "forecasts",
    name: "Forecasts",
    description: "Access current and historical forecast data",
    endpoints: [
      {
        method: "GET",
        path: "/v1/forecasts",
        description: "Get latest forecasts for all assets",
      },
      {
        method: "GET",
        path: "/v1/forecasts/{asset}",
        description: "Get forecast for a specific asset",
      },
      {
        method: "GET",
        path: "/v1/forecasts/{asset}/history",
        description: "Get historical forecast data",
      },
    ],
  },
  {
    id: "confidence",
    name: "Confidence & Bands",
    description: "Retrieve confidence scores and prediction intervals",
    endpoints: [
      {
        method: "GET",
        path: "/v1/confidence/{asset}",
        description: "Get current confidence score",
      },
      {
        method: "GET",
        path: "/v1/bands/{asset}",
        description: "Get confidence bands (50%, 75%, 95%)",
      },
      {
        method: "GET",
        path: "/v1/confidence/{asset}/history",
        description: "Get historical confidence data",
      },
    ],
  },
  {
    id: "alerts",
    name: "Alerts",
    description: "Manage and configure alert rules",
    endpoints: [
      {
        method: "GET",
        path: "/v1/alerts",
        description: "List all configured alerts",
      },
      {
        method: "POST",
        path: "/v1/alerts",
        description: "Create a new alert rule",
      },
      {
        method: "DELETE",
        path: "/v1/alerts/{id}",
        description: "Delete an alert rule",
      },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    description: "Access backtesting and accuracy metrics",
    endpoints: [
      {
        method: "GET",
        path: "/v1/performance",
        description: "Get overall performance metrics",
      },
      {
        method: "GET",
        path: "/v1/performance/{asset}",
        description: "Get asset-specific performance",
      },
      {
        method: "GET",
        path: "/v1/performance/regimes",
        description: "Get performance by market regime",
      },
    ],
  },
];

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  POST: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  PUT: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  DELETE: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
  },
};

const EndpointsOverview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "forecasts"
  );
  const [hoveredEndpoint, setHoveredEndpoint] = useState<string | null>(null);
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
      id="endpoints"
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
              Endpoints overview
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
            Everything you need,{" "}
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
              one API
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
            Clean, RESTful endpoints organized by function. All responses are
            JSON with consistent structure.
          </p>
        </div>

        {/* Endpoint categories */}
        <div
          className={`mt-10 grid gap-4 lg:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {ENDPOINT_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className={`rounded-2xl border transition-all duration-300 ${
                expandedCategory === category.id
                  ? "border-[var(--brand)]/50 bg-white shadow-lg dark:bg-black"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              {/* Category header */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className="w-full p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {category.endpoints.length} endpoints
                    </span>
                    <svg
                      className={`h-5 w-5 text-neutral-400 transition-transform duration-200 ${
                        expandedCategory === category.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Endpoints list */}
              <div
                className={`grid transition-all duration-300 ${
                  expandedCategory === category.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-neutral-100 dark:border-neutral-800">
                    {category.endpoints.map((endpoint, i) => {
                      const methodColor = METHOD_COLORS[endpoint.method];
                      const endpointKey = `${category.id}-${i}`;

                      return (
                        <div
                          key={endpointKey}
                          className={`flex items-center gap-4 border-b border-neutral-100 px-5 py-3 last:border-b-0 transition-colors duration-200 dark:border-neutral-800 ${
                            hoveredEndpoint === endpointKey
                              ? "bg-neutral-50 dark:bg-neutral-900"
                              : ""
                          }`}
                          onMouseEnter={() => setHoveredEndpoint(endpointKey)}
                          onMouseLeave={() => setHoveredEndpoint(null)}
                        >
                          {/* Method badge */}
                          <span
                            className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${methodColor.bg} ${methodColor.text}`}
                          >
                            {endpoint.method}
                          </span>

                          {/* Path */}
                          <code className="flex-1 font-mono text-sm text-neutral-700 dark:text-neutral-300">
                            {endpoint.path}
                          </code>

                          {/* Description (visible on hover) */}
                          <span
                            className={`text-xs text-neutral-500 dark:text-neutral-400 transition-opacity duration-200 ${
                              hoveredEndpoint === endpointKey
                                ? "opacity-100"
                                : "opacity-0 lg:opacity-100"
                            }`}
                          >
                            {endpoint.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Base URL info */}
        <div
          className={`mt-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Base URL
              </h3>
              <code className="mt-1 inline-block rounded-lg bg-neutral-100 px-3 py-1.5 font-mono text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                https://api.nordict.com/v1
              </code>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  JSON responses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  HTTPS only
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  UTF-8 encoded
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div
          className={`mt-6 grid gap-4 sm:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {[
            { value: "12", label: "Endpoints" },
            { value: "4", label: "Categories" },
            { value: "v1", label: "API Version" },
            { value: "<100ms", label: "Avg Latency" },
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

export default EndpointsOverview;
