"use client";

import { useState, useEffect, useRef } from "react";

const WEBHOOK_EVENTS = [
  {
    event: "forecast.updated",
    description: "Fired when a new forecast is generated",
    frequency: "Hourly for intraday, daily for longer horizons",
  },
  {
    event: "confidence.changed",
    description: "Fired when confidence shifts significantly",
    frequency: "As detected, typically 1-5x per day",
  },
  {
    event: "direction.flipped",
    description: "Fired when forecast direction reverses",
    frequency: "Rare, only on actual reversals",
  },
  {
    event: "alert.triggered",
    description: "Fired when one of your alerts is triggered",
    frequency: "Based on your alert configurations",
  },
  {
    event: "band.breached",
    description: "Fired when price exits confidence bands",
    frequency: "As detected in real-time",
  },
];

const WEBHOOK_FEATURES = [
  {
    title: "Automatic retries",
    description:
      "Failed deliveries are retried with exponential backoff up to 5 times.",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    title: "Signature verification",
    description:
      "Every webhook includes an HMAC signature to verify authenticity.",
    icon: (
      <svg
        className="h-5 w-5"
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
    title: "Delivery logs",
    description:
      "Full history of webhook attempts, responses, and timing in your dashboard.",
    icon: (
      <svg
        className="h-5 w-5"
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
    title: "Test mode",
    description:
      "Send test events to verify your integration before going live.",
    icon: (
      <svg
        className="h-5 w-5"
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
    ),
  },
];

const Webhooks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
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
              Webhooks
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
            Real-time events,{" "}
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
              delivered to you
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
            Don't poll the API. Subscribe to webhooks and receive events the
            moment they happen.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Events list */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h3 className="mb-3 text-xs font-semibold text-neutral-900 sm:mb-4 sm:text-sm dark:text-white">
              Available Events
            </h3>

            <div className="space-y-2">
              {WEBHOOK_EVENTS.map((item, i) => (
                <div
                  key={item.event}
                  className={`group relative overflow-hidden rounded-lg border p-3 transition-all duration-300 cursor-default sm:rounded-xl sm:p-4 ${
                    hoveredEvent === i
                      ? "border-[var(--brand)]/50 bg-white shadow-md dark:bg-black"
                      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  }`}
                  onMouseEnter={() => setHoveredEvent(i)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Desktop: side by side */}
                  <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-4">
                    <div>
                      <code
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          hoveredEvent === i
                            ? "text-[var(--brand)]"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {item.event}
                      </code>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {item.frequency}
                    </span>
                  </div>

                  {/* Mobile: stacked */}
                  <div className="sm:hidden">
                    <code
                      className={`text-[11px] font-semibold transition-colors duration-200 ${
                        hoveredEvent === i
                          ? "text-[var(--brand)]"
                          : "text-neutral-900 dark:text-white"
                      }`}
                    >
                      {item.event}
                    </code>
                    <p className="mt-1 text-[10px] leading-snug text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {item.frequency}
                    </span>
                  </div>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredEvent === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>

            {/* Payload example */}
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-900 overflow-hidden sm:mt-6 sm:rounded-2xl dark:border-neutral-700">
              <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-3 py-1.5 sm:px-4 sm:py-2">
                <span className="text-[10px] font-medium text-neutral-400 sm:text-xs">
                  Example Payload
                </span>
                <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
                  POST
                </span>
              </div>
              <div className="max-h-48 overflow-auto p-3 sm:max-h-none sm:p-4">
                <pre className="text-[9px] leading-relaxed text-neutral-300 sm:text-xs">
                  {`{
  "event": "forecast.updated",
  "timestamp": "2024-12-15T10:00:03Z",
  "data": {
    "asset": "BTC",
    "horizon": "24h",
    "direction": "bullish",
    "forecast": "+2.4%",
    "confidence": 72,
    "model_version": "v2.4.1"
  },
  "signature": "sha256=abc123..."
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Right: Features */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
              Reliability Built In
            </h3>

            <div className="space-y-3">
              {WEBHOOK_FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-default ${
                    hoveredFeature === i
                      ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-md"
                      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  }`}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                        hoveredFeature === i
                          ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredFeature === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>

            {/* Setup info */}
            <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                >
                  <svg
                    className="h-4 w-4"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Quick setup
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Add your endpoint URL in the dashboard, select which events
                    to subscribe to, and you're live. No complex configuration
                    required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          {[
            { value: "5", label: "Event Types" },
            { value: "<1s", label: "Delivery Time" },
            { value: "5x", label: "Auto Retries" },
            { value: "30 days", label: "Log Retention" },
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

export default Webhooks;
