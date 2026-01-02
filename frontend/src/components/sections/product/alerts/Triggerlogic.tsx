"use client";

import { useState, useEffect, useRef } from "react";

const LOGIC_STEPS = [
  {
    step: 1,
    title: "Define condition",
    description: "Set the trigger criteria using simple rules or combinations.",
    example: "IF confidence > 75% AND direction = bullish",
  },
  {
    step: 2,
    title: "Monitor continuously",
    description: "Your conditions are checked against every forecast update.",
    example: "Checked hourly for intraday, daily for longer horizons",
  },
  {
    step: 3,
    title: "Evaluate & filter",
    description: "Debouncing and cooldowns prevent alert fatigue from noise.",
    example: "Must stay triggered for 15min before firing",
  },
  {
    step: 4,
    title: "Deliver instantly",
    description:
      "When conditions are met, alerts are sent via your chosen channels.",
    example: "Email + webhook fired within seconds",
  },
];

const CONDITION_BUILDERS = [
  {
    type: "Simple",
    description: "Single condition triggers",
    example: "Forecast > +3%",
    complexity: 1,
  },
  {
    type: "Compound",
    description: "Multiple conditions with AND/OR",
    example: "Confidence > 70% AND Direction = Bullish",
    complexity: 2,
  },
  {
    type: "Temporal",
    description: "Time-based conditions",
    example: "Confidence increased by 10% in last 4 hours",
    complexity: 3,
  },
  {
    type: "Cross-asset",
    description: "Compare across multiple assets",
    example: "BTC bullish AND ETH bullish",
    complexity: 4,
  },
];

const TriggerLogic = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [hoveredCondition, setHoveredCondition] = useState<number | null>(null);
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

  // Auto-advance steps
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

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
              Trigger logic
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
            How alerts{" "}
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
              get triggered
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
            From condition definition to delivery, here's how the alert system
            evaluates and fires notifications.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Flow visualization */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Alert Pipeline
                </h3>
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Step {activeStep}/4
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {LOGIC_STEPS.map((item) => (
                  <button
                    key={item.step}
                    onClick={() => setActiveStep(item.step)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all duration-300 ${
                      activeStep === item.step
                        ? "border-[var(--brand)]/50 bg-white shadow-md dark:bg-black"
                        : "border-neutral-200 bg-white/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step number */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-300 ${
                          activeStep === item.step
                            ? "text-black"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                        }`}
                        style={{
                          backgroundColor:
                            activeStep === item.step
                              ? "var(--brand)"
                              : undefined,
                        }}
                      >
                        {item.step}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            activeStep === item.step
                              ? "text-neutral-900 dark:text-white"
                              : "text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p
                          className={`mt-1 text-xs transition-colors duration-300 ${
                            activeStep === item.step
                              ? "text-neutral-600 dark:text-neutral-300"
                              : "text-neutral-500 dark:text-neutral-500"
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* Example - shown when active */}
                        {activeStep === item.step && (
                          <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                              <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                                {item.example}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Active indicator */}
                      {activeStep === item.step && (
                        <div
                          className="h-2 w-2 rounded-full animate-pulse"
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress dots */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === step
                        ? "w-6"
                        : "w-2 bg-neutral-300 dark:bg-neutral-600"
                    }`}
                    style={{
                      backgroundColor:
                        activeStep === step ? "var(--brand)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Condition types */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
              Condition Complexity
            </h3>

            <div className="space-y-3">
              {CONDITION_BUILDERS.map((condition, i) => (
                <div
                  key={condition.type}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-default ${
                    hoveredCondition === i
                      ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-md"
                      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  }`}
                  onMouseEnter={() => setHoveredCondition(i)}
                  onMouseLeave={() => setHoveredCondition(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {condition.type}
                        </h4>
                        {/* Complexity indicator */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(4)].map((_, j) => (
                            <div
                              key={j}
                              className={`h-1.5 w-3 rounded-full transition-colors duration-200 ${
                                j < condition.complexity
                                  ? ""
                                  : "bg-neutral-200 dark:bg-neutral-700"
                              }`}
                              style={{
                                backgroundColor:
                                  j < condition.complexity
                                    ? "var(--brand)"
                                    : undefined,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {condition.description}
                      </p>
                    </div>
                  </div>

                  {/* Example */}
                  <div className="mt-3 rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                    <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                      {condition.example}
                    </p>
                  </div>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredCondition === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TriggerLogic;
