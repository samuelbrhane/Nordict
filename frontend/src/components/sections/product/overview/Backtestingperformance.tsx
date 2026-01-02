"use client";

import { useState, useEffect, useRef } from "react";

const TIMELINE_STEPS = [
  {
    step: "01",
    title: "Train on historical data",
    desc: "Models learn patterns from past market behavior using a fixed training window.",
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
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Validate on held-out period",
    desc: "Performance is tested on data the model has never seen, no peeking allowed.",
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Roll forward and repeat",
    desc: "The window advances, and the process repeats, simulating real deployment.",
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Track live performance",
    desc: "Once deployed, forecasts are compared against actual outcomes continuously.",
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

const METRICS = [
  {
    label: "Directional Accuracy",
    value: "68%",
    desc: "Correct direction calls",
    trend: "up",
  },
  {
    label: "Calibration Score",
    value: "0.92",
    desc: "Confidence reliability",
    trend: "up",
  },
  {
    label: "Sharpe Ratio",
    value: "1.4",
    desc: "Risk-adjusted returns",
    trend: "neutral",
  },
  {
    label: "Max Drawdown",
    value: "-12%",
    desc: "Worst peak-to-trough",
    trend: "down",
  },
];

const BacktestingPerformance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);
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
      setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
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
              Backtesting & performance
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
            Evaluated the way it will{" "}
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
              actually run
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
            Walk-forward validation ensures models are tested on{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              unseen data,{" "}
            </span>
            mimicking live conditions. No lookahead bias, no overfitting to
            history.
          </p>
        </div>

        {/* Timeline */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Desktop timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: "var(--brand)",
                    width: `${
                      ((activeStep + 1) / TIMELINE_STEPS.length) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-4 gap-4">
                {TIMELINE_STEPS.map((step, i) => (
                  <div
                    key={step.step}
                    className="cursor-pointer"
                    onClick={() => setActiveStep(i)}
                  >
                    {/* Node */}
                    <div className="flex justify-center">
                      <div
                        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                          i <= activeStep
                            ? "border-[var(--brand)] bg-[var(--brand)]/10"
                            : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                        }`}
                      >
                        <div
                          className={`transition-colors duration-300 ${
                            i <= activeStep
                              ? "text-[var(--brand)]"
                              : "text-neutral-400 dark:text-neutral-500"
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Active ring */}
                        {i === activeStep && (
                          <span
                            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                            style={{ backgroundColor: "var(--brand)" }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-4 text-center">
                      <span
                        className={`text-xs font-semibold tracking-widest transition-colors duration-300 ${
                          i <= activeStep
                            ? "text-[var(--brand)]"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {step.step}
                      </span>
                      <h3
                        className={`mt-1 text-sm font-semibold transition-colors duration-300 ${
                          i <= activeStep
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`mt-1 text-xs leading-relaxed transition-colors duration-300 ${
                          i <= activeStep
                            ? "text-neutral-600 dark:text-neutral-300"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden space-y-4">
            {TIMELINE_STEPS.map((step, i) => (
              <div
                key={step.step}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                  i === activeStep
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5"
                    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                }`}
                onClick={() => setActiveStep(i)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      i === activeStep
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold tracking-widest ${
                        i === activeStep
                          ? "text-[var(--brand)]"
                          : "text-neutral-400"
                      }`}
                    >
                      {step.step}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Active accent */}
                {i === activeStep && (
                  <div
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
      </div>
    </section>
  );
};

export default BacktestingPerformance;
