"use client";

import { useState, useEffect, useRef } from "react";

const ALERT_TYPES = [
  {
    id: "threshold",
    name: "Threshold Alerts",
    description: "Trigger when a value crosses a level you define.",
    examples: [
      "Forecast exceeds +3%",
      "Price drops below $40,000",
      "Confidence falls under 60%",
    ],
    useCase:
      "Set boundaries for values you care about and get notified when they're crossed.",
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
          d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
        />
      </svg>
    ),
  },
  {
    id: "confidence",
    name: "Confidence Shifts",
    description: "Trigger when model confidence changes significantly.",
    examples: [
      "Confidence jumps above 75%",
      "Confidence drops by 15%+ in 24h",
      "High conviction signal emerges",
    ],
    useCase:
      "Know when the model becomes more or less certain about its forecast.",
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
    id: "direction",
    name: "Direction Flips",
    description: "Trigger when the forecast direction reverses.",
    examples: [
      "Bullish → Bearish flip",
      "Bearish → Bullish flip",
      "Neutral → Directional change",
    ],
    useCase:
      "Stay aware when the model's directional view changes—a potential inflection point.",
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
    id: "regime",
    name: "Regime Changes",
    description: "Trigger when detected market regime shifts.",
    examples: [
      "Trending → Ranging transition",
      "Low → High volatility shift",
      "Regime uncertainty detected",
    ],
    useCase: "Adapt your strategy when market conditions fundamentally change.",
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    id: "band",
    name: "Band Breaches",
    description: "Trigger when price exits confidence bands.",
    examples: [
      "Price breaks 95% upper band",
      "Price breaks 75% lower band",
      "Sustained band breach (>1h)",
    ],
    useCase: "Get notified when actual price moves outside expected ranges.",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: "scheduled",
    name: "Scheduled Digests",
    description: "Regular summaries at times you choose.",
    examples: [
      "Daily morning briefing",
      "Weekly performance summary",
      "End-of-day forecast recap",
    ],
    useCase: "Get consistent updates without constant notifications.",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const AlertTypes = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>("threshold");
  const [hoveredType, setHoveredType] = useState<number | null>(null);
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

  const activeAlert = ALERT_TYPES.find((a) => a.id === selectedType);

  return (
    <section
      ref={sectionRef}
      id="alert-types"
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
              Alert types
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
            Six ways to{" "}
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
              stay informed
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
            Different conditions require different alerts. Choose the types that
            match your decision-making needs.
          </p>
        </div>

        {/* Alert types grid */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {ALERT_TYPES.map((alert, i) => (
            <button
              key={alert.id}
              onClick={() =>
                setSelectedType(selectedType === alert.id ? null : alert.id)
              }
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                selectedType === alert.id
                  ? "border-[var(--brand)]/50 bg-white shadow-lg ring-1 ring-[var(--brand)]/20 dark:bg-black"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
              onMouseEnter={() => setHoveredType(i)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                    selectedType === alert.id || hoveredType === i
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {alert.icon}
                </div>
                <svg
                  className={`h-5 w-5 transition-transform duration-200 ${
                    selectedType === alert.id
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

              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                {alert.name}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {alert.description}
              </p>

              {/* Hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                  selectedType === alert.id || hoveredType === i
                    ? "w-full"
                    : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </button>
          ))}
        </div>

        {/* Expanded detail panel */}
        {activeAlert && (
          <div
            className={`mt-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8`}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: Examples */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {activeAlert.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {activeAlert.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Example conditions
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {activeAlert.examples.map((example, i) => (
                    <div
                      key={example}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertTypes;
