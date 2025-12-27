"use client";

import { useState, useEffect, useRef } from "react";

const OUTPUT_COMPONENTS = [
  {
    id: "direction",
    label: "Direction Signal",
    value: "Bullish",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ),
    description:
      "The predicted directional bias—bullish, bearish, or neutral—based on the probability distribution center.",
    note: "Not a binary signal. Comes with confidence weighting.",
  },
  {
    id: "expected",
    label: "Expected Change",
    value: "+2.4%",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    description:
      "The median point estimate of expected price movement over the forecast horizon.",
    note: "Center of the distribution, not a guarantee.",
  },
  {
    id: "confidence",
    label: "Confidence Score",
    value: "72%",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    description:
      "Model certainty about the directional call, calibrated against historical accuracy at similar levels.",
    note: "72% means ~72% historical accuracy at this confidence.",
  },
  {
    id: "bands",
    label: "Confidence Bands",
    value: "50 / 75 / 95%",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    description:
      "Probability ranges showing where price is likely to land. Three bands capture increasing uncertainty.",
    note: "Wider bands = more uncertainty acknowledged.",
  },
  {
    id: "regime",
    label: "Regime Context",
    value: "Trending",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    description:
      "Current market regime classification—trending, ranging, or volatile—affecting forecast interpretation.",
    note: "Helps contextualize confidence and band width.",
  },
  {
    id: "version",
    label: "Model Version",
    value: "v2.4.1",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    description:
      "The specific model version that generated this forecast, for auditability and comparison.",
    note: "Track performance across model updates.",
  },
];

const ForecastOutputs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeOutput, setActiveOutput] = useState<string | null>(null);
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
              Forecast outputs explained
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
            What you{" "}
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
              actually receive
            </span>{" "}
            with each forecast.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Every forecast includes multiple components—not just a number, but
            the context needed to interpret and act on it responsibly.
          </p>
        </div>

        {/* Output preview card */}
        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
            {/* Mock forecast output */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  BTC
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Bitcoin / USD
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    24-hour forecast
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Generated
                </p>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Dec 15, 2024 10:00 UTC
                </p>
              </div>
            </div>

            {/* Output grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {OUTPUT_COMPONENTS.map((output, i) => (
                <div
                  key={output.id}
                  className={`group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 cursor-pointer ${
                    activeOutput === output.id
                      ? "border-[var(--brand)]/50 shadow-md ring-1 ring-[var(--brand)]/20"
                      : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                  }`}
                  onClick={() =>
                    setActiveOutput(
                      activeOutput === output.id ? null : output.id
                    )
                  }
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 ${
                        activeOutput === output.id || hoveredCard === i
                          ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                      }`}
                    >
                      {output.icon}
                    </div>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeOutput === output.id
                          ? "rotate-180 text-[var(--brand)]"
                          : "text-neutral-400"
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

                  <p className="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {output.label}
                  </p>
                  <p
                    className="mt-1 text-xl font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    {output.value}
                  </p>

                  {/* Expanded description */}
                  <div
                    className={`grid transition-all duration-300 ${
                      activeOutput === output.id
                        ? "grid-rows-[1fr] opacity-100 mt-3"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {output.description}
                      </p>
                      <p className="mt-2 text-xs italic text-neutral-500 dark:text-neutral-400">
                        {output.note}
                      </p>
                    </div>
                  </div>

                  {/* Hover/active accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      activeOutput === output.id || hoveredCard === i
                        ? "w-full"
                        : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click any component to see details
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  Sample output • Not live data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional context */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            {
              title: "Machine-readable",
              desc: "All outputs available via API in JSON format for integration into your systems.",
            },
            {
              title: "Timestamped",
              desc: "Every forecast includes generation time for auditability and historical tracking.",
            },
            {
              title: "Versioned",
              desc: "Model version is attached so you can compare performance across updates.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForecastOutputs;
