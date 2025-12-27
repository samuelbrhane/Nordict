"use client";

import { useState, useEffect, useRef } from "react";

const PIPELINE_STEPS = [
  {
    id: 1,
    title: "Data Ingestion",
    subtitle: "Collect & normalize",
    description:
      "Raw data streams in from multiple sources—exchanges, on-chain providers, derivatives platforms. We normalize everything to a consistent format and timestamp.",
    details: [
      "Multi-exchange aggregation",
      "Timestamp synchronization",
      "Outlier detection & cleaning",
      "Missing data interpolation",
    ],
    duration: "Real-time",
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
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Feature Engineering",
    subtitle: "Extract signals",
    description:
      "Transform raw data into meaningful features. This is where domain expertise meets data science—we create indicators that capture market dynamics.",
    details: [
      "200+ engineered features",
      "Multi-timeframe aggregation",
      "Cross-asset feature generation",
      "Rolling window calculations",
    ],
    duration: "~2 seconds",
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Model Ensemble",
    subtitle: "Generate predictions",
    description:
      "Multiple specialized models process the features. Each model votes on direction and magnitude. Disagreement between models informs confidence.",
    details: [
      "Gradient boosting models",
      "Neural network components",
      "Time-series specialists",
      "Weighted voting system",
    ],
    duration: "~5 seconds",
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
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Confidence Scoring",
    subtitle: "Quantify uncertainty",
    description:
      "We calculate how confident the ensemble is in its prediction. Model agreement, historical accuracy in similar conditions, and volatility all factor in.",
    details: [
      "Model agreement score",
      "Historical calibration",
      "Regime-adjusted confidence",
      "Volatility normalization",
    ],
    duration: "~1 second",
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
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
        />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Forecast Output",
    subtitle: "Deliver results",
    description:
      "The final forecast includes direction (bullish/bearish/neutral), magnitude (expected % change), confidence score (0-100%), and confidence bands.",
    details: [
      "Direction classification",
      "Magnitude estimation",
      "Confidence bands (50/75/95%)",
      "Multi-horizon forecasts",
    ],
    duration: "Instant",
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
];

const ForecastProcess = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
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

  // Auto-cycle through steps
  useEffect(() => {
    if (!isVisible || isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= PIPELINE_STEPS.length ? 1 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, isPaused]);

  // Resume auto-cycle after 10 seconds of no interaction
  useEffect(() => {
    if (!isPaused) return;

    const timeout = setTimeout(() => {
      setIsPaused(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isPaused]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setIsPaused(true);
  };

  const handlePrevious = () => {
    setActiveStep(Math.max(1, activeStep - 1));
    setIsPaused(true);
  };

  const handleNext = () => {
    setActiveStep(Math.min(PIPELINE_STEPS.length, activeStep + 1));
    setIsPaused(true);
  };

  const currentStep = PIPELINE_STEPS.find((s) => s.id === activeStep);

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
              Forecast process
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
            From data to{" "}
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
              forecast
            </span>{" "}
            in seconds
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Here's exactly what happens when we generate a forecast—from raw
            data to actionable signal.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Steps timeline */}
          <div className="relative mb-8">
            {/* Progress bar background */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full" />

            {/* Progress bar fill */}
            <div
              className="absolute top-6 left-0 h-1 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((activeStep - 1) / (PIPELINE_STEPS.length - 1)) * 100
                }%`,
                backgroundColor: "var(--brand)",
              }}
            />

            {/* Step buttons */}
            <div className="relative flex justify-between">
              {PIPELINE_STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                      activeStep === step.id
                        ? "border-[var(--brand)] bg-[var(--brand)] text-black scale-110"
                        : step.id < activeStep
                        ? "border-[var(--brand)] bg-[var(--brand)] text-black"
                        : "border-neutral-300 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500"
                    }`}
                  >
                    {step.id < activeStep ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium transition-colors duration-200 hidden sm:block ${
                      activeStep === step.id
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active step detail */}
          {currentStep && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Step info */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                    >
                      <div style={{ color: "var(--brand)" }}>
                        {currentStep.icon}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          {currentStep.id}
                        </span>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {currentStep.title}
                        </h3>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {currentStep.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-4">
                    {currentStep.description}
                  </p>

                  {/* Duration badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {currentStep.duration}
                    </span>
                  </div>
                </div>

                {/* Right: Details */}
                <div>
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    What happens here
                  </h4>
                  <div className="space-y-2">
                    {currentStep.details.map((detail, i) => (
                      <div
                        key={detail}
                        className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--brand)" }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700">
                <button
                  onClick={handlePrevious}
                  disabled={activeStep === 1}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeStep === 1
                      ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {PIPELINE_STEPS.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeStep === step.id
                          ? "w-6"
                          : "w-2 bg-neutral-300 dark:bg-neutral-600"
                      }`}
                      style={{
                        backgroundColor:
                          activeStep === step.id ? "var(--brand)" : undefined,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={activeStep === PIPELINE_STEPS.length}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeStep === PIPELINE_STEPS.length
                      ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  Next
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Total time */}
        <div
          className={`mt-8 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Total pipeline latency:{" "}
            <span className="font-semibold" style={{ color: "var(--brand)" }}>
              ~10 seconds
            </span>{" "}
            from data to forecast
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForecastProcess;
