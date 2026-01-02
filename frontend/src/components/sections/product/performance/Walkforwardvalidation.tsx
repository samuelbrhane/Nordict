"use client";

import { useState, useEffect, useRef } from "react";

const KEY_PRINCIPLES = [
  {
    title: "No future data leakage",
    description:
      "The model never sees validation data during training. This mimics real conditions where you can't peek at tomorrow's prices.",
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
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: "Multiple test periods",
    description:
      "Instead of one backtest, we run many across different market conditions bull, bear, sideways, volatile.",
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
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    title: "Realistic constraints",
    description:
      "We include transaction costs, slippage estimates, and data delays. Results aren't idealized.",
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
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Regime-aware evaluation",
    description:
      "Performance is broken down by market regime so you know where the model excels and where it struggles.",
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
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
];

const WalkForwardValidation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
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

  // Animate the walk-forward visualization
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);

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
              Walk-forward validation
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
            Testing that{" "}
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
              mirrors reality
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
            Walk-forward validation is the gold standard for evaluating
            time-series forecasts. It simulates how the model would have
            performed if deployed in the past.
          </p>
        </div>

        {/* Visualization */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Walk-Forward Process
              </h3>
            </div>

            {/* Timeline visualization */}
            <div className="space-y-6">
              {/* Time axis */}
              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700" />

                {/* Time markers */}
                <div className="relative flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Past</span>
                  <span>Present</span>
                </div>
              </div>

              {/* Walk-forward windows - 3 iterations shown */}
              {[0, 1, 2].map((iteration) => (
                <div
                  key={iteration}
                  className={`relative h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-all duration-500 ${
                    animationStep === iteration || animationStep === 3
                      ? "ring-2 ring-[var(--brand)]/50"
                      : "opacity-60"
                  }`}
                  style={{
                    marginLeft: `${iteration * 10}%`,
                    width: `${80 - iteration * 5}%`,
                  }}
                >
                  {/* Training window */}
                  <div
                    className="absolute left-0 top-0 bottom-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      width: "65%",
                      backgroundColor:
                        animationStep === iteration || animationStep === 3
                          ? "rgba(4,236,58,0.3)"
                          : "rgba(4,236,58,0.15)",
                    }}
                  >
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Training
                    </span>
                  </div>

                  {/* Validation window */}
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center transition-all duration-500"
                    style={{
                      left: "65%",
                      width: "35%",
                      backgroundColor:
                        animationStep === iteration || animationStep === 3
                          ? "rgba(245,158,11,0.4)"
                          : "rgba(245,158,11,0.2)",
                    }}
                  >
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Test
                    </span>
                  </div>

                  {/* Iteration label */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {iteration + 1}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-8 rounded"
                    style={{ backgroundColor: "rgba(4,236,58,0.3)" }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Training data (model learns)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-8 rounded"
                    style={{ backgroundColor: "rgba(245,158,11,0.4)" }}
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Test data (never seen before)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-neutral-500"
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
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    Windows roll forward in time
                  </span>
                </div>
              </div>
            </div>

            {/* Step indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {[0, 1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => setAnimationStep(step)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    animationStep === step
                      ? "w-6"
                      : "w-2 bg-neutral-300 dark:bg-neutral-600"
                  }`}
                  style={{
                    backgroundColor:
                      animationStep === step ? "var(--brand)" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Key principles */}
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {KEY_PRINCIPLES.map((principle, i) => (
            <div
              key={principle.title}
              className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 cursor-default`}
              onMouseEnter={() => setHoveredPrinciple(i)}
              onMouseLeave={() => setHoveredPrinciple(null)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    hoveredPrinciple === i
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {principle.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {principle.description}
                  </p>
                </div>
              </div>

              {/* Hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                  hoveredPrinciple === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WalkForwardValidation;
