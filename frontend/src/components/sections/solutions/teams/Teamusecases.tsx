"use client";

import { useState, useEffect, useRef } from "react";

const USE_CASES = [
  {
    id: "morning",
    title: "Morning Standup",
    scenario:
      "Your team needs to align on market outlook before the trading day starts.",
    withoutNordict:
      "Each analyst shares their own view, leading to conflicting opinions and no clear consensus",
    withNordict:
      "Open shared dashboard showing unified forecasts—everyone starts from the same data",
    example: {
      situation: "9am team standup, discussing today's priorities",
      signal:
        "Dashboard shows: BTC 74% bullish, ETH 68% bullish, SOL 52% neutral",
      action:
        "Team aligns: focus research on BTC and ETH opportunities, deprioritize SOL",
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
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    id: "handoff",
    title: "Shift Handoff",
    scenario:
      "Analyst going off-shift needs to brief the incoming team on current positions and alerts.",
    withoutNordict:
      "Write lengthy handoff notes, hope nothing is missed, incoming team asks clarifying questions",
    withNordict:
      "Point to shared alerts and annotated forecasts—context is already documented",
    example: {
      situation: "End of US shift, handing off to APAC team",
      signal: "3 active alerts set, 2 forecasts annotated with hypotheses",
      action:
        "APAC team reviews alerts and notes, continues monitoring without interruption",
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
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    id: "research",
    title: "Collaborative Research",
    scenario:
      "Multiple analysts investigating the same asset, each with different perspectives.",
    withoutNordict:
      "Duplicate work, conflicting spreadsheets, insights lost in Slack threads",
    withNordict:
      "All notes attached to the forecast, building a shared research thread over time",
    example: {
      situation: "Three analysts researching AVAX for potential position",
      signal:
        "Comments show: on-chain analysis (Anna), technical setup (James), macro context (Sarah)",
      action:
        "PM reviews unified thread, makes informed decision with full context",
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    id: "compliance",
    title: "Compliance Review",
    scenario:
      "Quarterly audit requires documentation of decision-making process and data sources.",
    withoutNordict:
      "Scramble to reconstruct what data informed which decisions, incomplete records",
    withNordict:
      "Export audit logs showing exactly what forecasts were viewed, by whom, when",
    example: {
      situation: "Q4 compliance audit, need to document trading rationale",
      signal:
        "Audit log export: 1,247 forecast views, 89 alerts triggered, 34 decisions documented",
      action:
        "Complete audit trail provided, compliance review passes smoothly",
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
];

const TeamUseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState("morning");
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
            Teams work{" "}
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
              better together
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
            See how research teams and trading desks use Nordict to collaborate
            effectively.
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
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
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
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
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
                        Nordict Data
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
                        Team Outcome
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

        {/* Bottom note */}
        <div
          className={`mt-8 flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Examples based on common team workflows. Your mileage may vary.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamUseCases;
