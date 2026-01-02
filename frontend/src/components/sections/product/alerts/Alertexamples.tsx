"use client";

import { useState, useEffect, useRef } from "react";

const ALERT_EXAMPLES = [
  {
    id: "momentum",
    name: "Momentum Trader",
    persona: "Active day trader looking for high-conviction setups",
    alerts: [
      {
        type: "Confidence",
        condition: "Confidence > 75% AND Direction = Bullish",
        description: "High conviction bullish signal",
        triggered: "BTC confidence hit 78%, direction bullish",
      },
      {
        type: "Threshold",
        condition: "Forecast change > +3% in 24h horizon",
        description: "Strong upside forecast",
        triggered: "BTC 24h forecast jumped to +4.2%",
      },
    ],
    outcome:
      "Trader reviews the setup, checks technicals, decides whether to enter position",
  },
  {
    id: "risk",
    name: "Risk Manager",
    persona: "Portfolio manager monitoring downside exposure",
    alerts: [
      {
        type: "Direction",
        condition: "Direction flips from Bullish to Bearish",
        description: "Sentiment reversal warning",
        triggered: "ETH forecast flipped bearish after 5 days bullish",
      },
      {
        type: "Band",
        condition: "Price breaks 95% lower band",
        description: "Extreme downside move",
        triggered: "SOL broke below 95% confidence band",
      },
    ],
    outcome:
      "Manager reviews portfolio exposure, considers hedging or reducing position sizes",
  },
  {
    id: "swing",
    name: "Swing Trader",
    persona: "Weekly trader looking for regime changes",
    alerts: [
      {
        type: "Regime",
        condition: "Regime changes from Ranging to Trending",
        description: "New trend potentially starting",
        triggered: "BTC regime shifted to 'Trending Up'",
      },
      {
        type: "Confidence",
        condition: "Weekly confidence increases by 15%+ from prior week",
        description: "Conviction building",
        triggered: "Weekly confidence rose from 58% to 74%",
      },
    ],
    outcome:
      "Trader prepares for potential trend-following entry on confirmation",
  },
  {
    id: "passive",
    name: "Passive Investor",
    persona: "Long-term holder wanting occasional updates",
    alerts: [
      {
        type: "Scheduled",
        condition: "Weekly digest every Sunday 9am",
        description: "Regular performance summary",
        triggered: "Weekly digest delivered with all forecasts",
      },
      {
        type: "Threshold",
        condition: "Monthly forecast drops below -10%",
        description: "Major downside warning only",
        triggered: "Monthly forecast hit -12%, first alert in 3 months",
      },
    ],
    outcome:
      "Investor stays informed without constant notifications, only acts on major signals",
  },
];

const AlertExamples = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedExample, setSelectedExample] = useState("momentum");
  const [hoveredAlert, setHoveredAlert] = useState<number | null>(null);
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

  const activeExample = ALERT_EXAMPLES.find((e) => e.id === selectedExample);

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
              Alert examples
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
            Real-world{" "}
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
              alert setups
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
            See how different user types configure alerts to match their
            decision-making style.
          </p>
        </div>

        {/* Persona selector */}
        <div
          className={`mt-10 flex flex-wrap gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {ALERT_EXAMPLES.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`relative overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-300 ${
                selectedExample === example.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  selectedExample === example.id
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {example.name}
              </span>

              {selectedExample === example.id && (
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Selected example details */}
        {activeExample && (
          <div
            className={`mt-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              {/* Persona header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {activeExample.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {activeExample.persona}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {activeExample.alerts.length} alerts configured
                  </span>
                </div>
              </div>

              {/* Alerts */}
              <div className="grid gap-4 lg:grid-cols-2">
                {activeExample.alerts.map((alert, i) => (
                  <div
                    key={alert.type + i}
                    className={`relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 dark:bg-black ${
                      hoveredAlert === i
                        ? "border-[var(--brand)]/50 shadow-md"
                        : "border-neutral-200 dark:border-neutral-700"
                    }`}
                    onMouseEnter={() => setHoveredAlert(i)}
                    onMouseLeave={() => setHoveredAlert(null)}
                  >
                    {/* Alert type badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {alert.type}
                      </span>
                      <svg
                        className={`h-4 w-4 transition-colors duration-200 ${
                          hoveredAlert === i
                            ? "text-[var(--brand)]"
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {alert.description}
                    </p>

                    {/* Condition */}
                    <div className="mt-3 rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Condition
                      </p>
                      <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        {alert.condition}
                      </p>
                    </div>

                    {/* Triggered example */}
                    <div className="mt-3 flex items-start gap-2">
                      <div
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Example:</span>{" "}
                        {alert.triggered}
                      </p>
                    </div>

                    {/* Hover accent */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                        hoveredAlert === i ? "w-full" : "w-0"
                      }`}
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                  </div>
                ))}
              </div>

              {/* Outcome */}
              <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Then what?
                    </p>
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                      {activeExample.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertExamples;
