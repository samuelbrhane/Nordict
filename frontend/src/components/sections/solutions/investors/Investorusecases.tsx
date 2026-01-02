"use client";

import { useState, useEffect, useRef } from "react";

const USE_CASES = [
  {
    id: "dca",
    title: "DCA Timing",
    scenario:
      "You invest $500 every week into crypto. Should you buy today or wait a few days?",
    withoutNordict: "Buy on the same day every week regardless of conditions",
    withNordict:
      "Check weekly forecast, delay if strongly bearish, proceed if neutral/bullish",
    example: {
      situation: "Weekly DCA day is Monday, forecast shows bearish outlook",
      signal: "30-day forecast: -4.2% • Confidence: 67% • Direction: Bearish",
      action:
        "Consider delaying purchase by 2-3 days or splitting across the week",
    },
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
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "rebalance",
    title: "Portfolio Rebalancing",
    scenario:
      "Your ETH position has grown to 40% of your portfolio. Time to rebalance?",
    withoutNordict: "Rebalance purely based on allocation drift thresholds",
    withNordict:
      "Check if conviction supports the overweight, maybe it's earned",
    example: {
      situation: "ETH is 40% of portfolio (target: 30%), considering trim",
      signal:
        "ETH 30-day forecast: +8.1% • Confidence: 76% • Direction: Bullish",
      action:
        "High conviction supports overweight, hold off on rebalancing for now",
    },
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
    id: "drawdown",
    title: "Drawdown Management",
    scenario:
      "Market is down 25% from highs. Should you panic sell or buy the dip?",
    withoutNordict: "React emotionally, either panic sell or blindly buy",
    withNordict: "Check if forecasts are recovering or still deteriorating",
    example: {
      situation: "BTC down 25%, considering selling to prevent further losses",
      signal:
        "Confidence trending up: 48% → 62% over past week • Direction shifting neutral",
      action:
        "Forecasts stabilizing—hold position, consider small additional buy",
    },
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
          d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
        />
      </svg>
    ),
  },
  {
    id: "newposition",
    title: "New Position Entry",
    scenario:
      "You want to add a new asset to your portfolio. Is now a good time?",
    withoutNordict: "Enter based on FOMO or arbitrary timing",
    withNordict: "Wait for favorable forecast window with decent confidence",
    example: {
      situation: "Interested in adding SOL to portfolio, checking timing",
      signal:
        "SOL 30-day forecast: +6.4% • Confidence: 71% • Direction: Bullish",
      action:
        "Favorable window—proceed with initial position, plan to scale in",
    },
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
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
];

const InvestorUseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState("dca");
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

  const activeCase = USE_CASES.find((c) => c.id === selectedCase);

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
              Use cases
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
            Investing decisions,{" "}
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
              informed
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
            See how long-term investors use Nordict forecasts for common
            portfolio decisions.
          </p>
        </div>

        {/* Case selector */}
        <div
          className={`mt-10 flex flex-wrap gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {USE_CASES.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setSelectedCase(useCase.id)}
              className={`relative overflow-hidden rounded-xl border px-4 py-2.5 transition-all duration-300 ${
                selectedCase === useCase.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`transition-colors duration-200 ${
                    selectedCase === useCase.id
                      ? "text-[var(--brand)]"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {useCase.icon}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    selectedCase === useCase.id
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {useCase.title}
                </span>
              </div>

              {selectedCase === useCase.id && (
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Active case detail */}
        {activeCase && (
          <div
            className={`mt-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8">
              {/* Scenario */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {activeCase.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium text-neutral-900 dark:text-white">
                    Scenario:
                  </span>{" "}
                  {activeCase.scenario}
                </p>
              </div>

              {/* Comparison */}
              <div className="grid gap-4 lg:grid-cols-2 mb-8">
                {/* Without */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/50">
                      <svg
                        className="h-4 w-4 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-red-800 dark:text-red-300">
                      Without Nordict
                    </span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {activeCase.withoutNordict}
                  </p>
                </div>

                {/* With */}
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: "rgba(4,236,58,0.3)",
                    backgroundColor: "rgba(4,236,58,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "rgba(4,236,58,0.2)" }}
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--brand)" }}
                    >
                      With Nordict
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {activeCase.withNordict}
                  </p>
                </div>
              </div>

              {/* Example */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Example in action
                </h4>

                <div className="space-y-4">
                  {/* Situation */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Situation
                      </p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {activeCase.example.situation}
                      </p>
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      <span className="text-xs font-bold text-black">2</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Nordict Signal
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--brand)" }}
                      >
                        {activeCase.example.signal}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Informed Action
                      </p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {activeCase.example.action}
                      </p>
                    </div>
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

export default InvestorUseCases;
