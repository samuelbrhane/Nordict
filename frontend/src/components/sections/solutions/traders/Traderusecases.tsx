"use client";

import { useState, useEffect, useRef } from "react";

const USE_CASES = [
  {
    id: "momentum",
    title: "Momentum Entries",
    scenario:
      "You spot a potential breakout forming. Is this the real move or a fakeout?",
    withoutNordict:
      "Rely on price action alone, often entering too early or too late",
    withNordict:
      "Check forecast direction and confidence. High confidence + bullish = stronger signal",
    example: {
      situation: "BTC consolidating near resistance",
      signal: "Forecast: +3.2% (24h) • Confidence: 78% • Direction: Bullish",
      action:
        "Elevated confidence supports breakout thesis—consider entry with tighter stop",
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
  {
    id: "sizing",
    title: "Position Sizing",
    scenario:
      "You've decided to take a trade. How much of your capital should you allocate?",
    withoutNordict: "Use fixed position sizes regardless of setup quality",
    withNordict:
      "Scale position size to confidence score within your risk framework",
    example: {
      situation: "Two setups: ETH and SOL both look good",
      signal: "ETH: 74% confidence • SOL: 58% confidence",
      action: "Allocate more to ETH (higher confidence), smaller size to SOL",
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
          d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
        />
      </svg>
    ),
  },
  {
    id: "risk",
    title: "Risk Management",
    scenario:
      "You're in a profitable position. Should you hold, take profit, or tighten stops?",
    withoutNordict: "Guess based on fear/greed, often cutting winners short",
    withNordict:
      "Monitor forecast changes. Dropping confidence = consider protection",
    example: {
      situation: "Long BTC +8%, forecast was bullish at entry",
      signal: "Direction flipped: Bearish • Confidence dropped: 72% → 54%",
      action: "Weakening conviction—tighten stop or take partial profit",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    id: "screening",
    title: "Opportunity Screening",
    scenario: "Markets are open. Where should you focus your attention today?",
    withoutNordict: "Manually scan dozens of charts, easy to miss setups",
    withNordict:
      "Sort watchlist by confidence. Focus on highest-conviction opportunities first",
    example: {
      situation: "Morning scan across 20 assets",
      signal: "Top 3 by confidence: LINK (81%), AVAX (76%), BTC (74%)",
      action:
        "Prioritize LINK and AVAX for detailed analysis—highest signal quality",
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
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
        />
      </svg>
    ),
  },
];

const TraderUseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState("momentum");
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
            Real scenarios,{" "}
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
              better decisions
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
            See how traders use Nordict forecasts in common trading situations.
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

        {/* Bottom disclaimer */}
        <div
          className={`mt-8 flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <svg
            className="h-4 w-4 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Examples are illustrative. Past performance doesn't guarantee future
            results.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TraderUseCases;
