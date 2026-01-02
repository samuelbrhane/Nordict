"use client";

import { useState, useEffect, useRef } from "react";

const WORKFLOW_STEPS = [
  {
    id: "scan",
    time: "Morning",
    title: "Scan opportunities",
    description:
      "Review overnight forecast changes and identify high-conviction setups across your watchlist.",
    action: "Check dashboard for confidence shifts",
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
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
  },
  {
    id: "evaluate",
    time: "Pre-trade",
    title: "Evaluate conviction",
    description:
      "Cross-reference forecast direction and confidence with your own technical analysis.",
    action: "Combine forecasts with your edge",
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
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
        />
      </svg>
    ),
  },
  {
    id: "size",
    time: "Entry",
    title: "Size with confidence",
    description:
      "Use confidence scores to inform position sizing. Higher confidence = larger allocation within your risk framework.",
    action: "Scale positions to conviction",
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
    id: "monitor",
    time: "Intraday",
    title: "Monitor in real-time",
    description:
      "Receive alerts when forecasts shift or confidence drops. React to changing conditions before the crowd.",
    action: "Get notified on signal changes",
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
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
  },
  {
    id: "review",
    time: "End of day",
    title: "Review & adjust",
    description:
      "Compare your trades against forecast outcomes. Learn what confidence levels work best for your style.",
    action: "Track forecast accuracy over time",
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
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
  },
];

const TradingWorkflow = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="workflow"
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
              Trading workflow
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
            How forecasts fit into{" "}
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
              your day
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
            Nordict doesn't replace your strategy, it enhances it. Here's how
            active traders integrate forecasts into their decision-making.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Timeline - Desktop */}
          <div
            className={`hidden lg:block lg:col-span-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800" />

              {/* Steps */}
              <div className="space-y-2">
                {WORKFLOW_STEPS.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(i)}
                    className={`relative w-full text-left pl-14 pr-4 py-4 rounded-2xl transition-all duration-300 ${
                      activeStep === i
                        ? "bg-white shadow-lg dark:bg-neutral-900"
                        : "hover:bg-white/50 dark:hover:bg-neutral-900/50"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                        activeStep === i
                          ? "border-[var(--brand)] bg-[var(--brand)] scale-125"
                          : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800"
                      }`}
                    />

                    {/* Time badge */}
                    <span
                      className={`text-xs font-medium transition-colors duration-200 ${
                        activeStep === i
                          ? "text-[var(--brand)]"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {step.time}
                    </span>

                    {/* Title */}
                    <h4
                      className={`mt-1 text-sm font-semibold transition-colors duration-200 ${
                        activeStep === i
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile step selector */}
          <div
            className={`lg:hidden flex gap-2 overflow-x-auto pb-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {WORKFLOW_STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  activeStep === i
                    ? "bg-[var(--brand)] text-black"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {step.time}
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div
            className={`lg:col-span-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              {/* Icon */}
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
              >
                <div style={{ color: "var(--brand)" }}>
                  {WORKFLOW_STEPS[activeStep].icon}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {WORKFLOW_STEPS[activeStep].time}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">
                  {WORKFLOW_STEPS[activeStep].title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {WORKFLOW_STEPS[activeStep].description}
                </p>
              </div>

              {/* Action */}
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
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
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {WORKFLOW_STEPS[activeStep].action}
                  </p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {WORKFLOW_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === i
                        ? "w-6"
                        : "w-2 bg-neutral-300 dark:bg-neutral-600"
                    }`}
                    style={{
                      backgroundColor:
                        activeStep === i ? "var(--brand)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingWorkflow;
