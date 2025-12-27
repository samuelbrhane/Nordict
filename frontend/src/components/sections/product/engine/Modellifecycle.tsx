"use client";

import { useState, useEffect, useRef } from "react";

const LIFECYCLE_STAGES = [
  {
    id: "training",
    number: "01",
    title: "Training",
    subtitle: "Learn from history",
    description:
      "Models are trained on historical market data using walk-forward methodology. No future data ever leaks into training.",
    details: [
      "Historical data spanning multiple market regimes",
      "Feature engineering with domain expertise",
      "Strict temporal data separation",
      "Multiple model architectures evaluated",
    ],
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
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
  },
  {
    id: "validation",
    number: "02",
    title: "Validation",
    subtitle: "Test on unseen data",
    description:
      "Every model is validated on data it has never seen. Walk-forward testing simulates real deployment conditions.",
    details: [
      "Out-of-sample performance testing",
      "Multiple evaluation metrics tracked",
      "Confidence calibration verification",
      "Regime-specific performance analysis",
    ],
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
    id: "deployment",
    number: "03",
    title: "Deployment",
    subtitle: "Go live with versioning",
    description:
      "Validated models are deployed with full version tracking. Every forecast is tagged with the model that generated it.",
    details: [
      "Semantic versioning (major.minor.patch)",
      "Gradual rollout capability",
      "Rollback ready if issues arise",
      "Changelog for every version",
    ],
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
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
    ),
  },
  {
    id: "monitoring",
    number: "04",
    title: "Monitoring",
    subtitle: "Track continuously",
    description:
      "Live performance is tracked against forecasts. Drift detection triggers retraining when conditions change.",
    details: [
      "Real-time accuracy tracking",
      "Calibration drift detection",
      "Automated alerting on degradation",
      "Continuous comparison to baseline",
    ],
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

const ModelLifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStage, setActiveStage] = useState("training");
  const [animatedStages, setAnimatedStages] = useState(0);
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

  // Animate stages sequentially
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setAnimatedStages((prev) => {
        if (prev >= LIFECYCLE_STAGES.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVisible]);

  const selectedStage = LIFECYCLE_STAGES.find((s) => s.id === activeStage);

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
              Model lifecycle
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
            From training to{" "}
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
              live monitoring
            </span>
            —every step tracked.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Models go through a rigorous lifecycle before generating forecasts
            you see. Here's how it works.
          </p>
        </div>

        {/* Lifecycle visualization */}
        <div
          className={`mt-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Desktop: Horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-10 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    backgroundColor: "var(--brand)",
                    width: `${
                      (animatedStages / LIFECYCLE_STAGES.length) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Stages */}
              <div className="relative grid grid-cols-4 gap-4">
                {LIFECYCLE_STAGES.map((stage, i) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`text-left transition-all duration-300 ${
                      i < animatedStages ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    {/* Node */}
                    <div className="flex justify-center">
                      <div
                        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                          activeStage === stage.id
                            ? "border-[var(--brand)] bg-[var(--brand)]/10 shadow-lg"
                            : i < animatedStages
                            ? "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                            : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                        }`}
                      >
                        <div
                          className={`transition-colors duration-300 ${
                            activeStage === stage.id
                              ? "text-[var(--brand)]"
                              : "text-neutral-400 dark:text-neutral-500"
                          }`}
                        >
                          {stage.icon}
                        </div>

                        {/* Active ring */}
                        {activeStage === stage.id && (
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
                        className={`text-xs font-bold tracking-widest transition-colors duration-300 ${
                          activeStage === stage.id
                            ? "text-[var(--brand)]"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {stage.number}
                      </span>
                      <h3
                        className={`mt-1 text-sm font-semibold transition-colors duration-300 ${
                          activeStage === stage.id
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {stage.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {stage.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical list */}
          <div className="lg:hidden space-y-3">
            {LIFECYCLE_STAGES.map((stage, i) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all duration-300 ${
                  activeStage === stage.id
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-md"
                    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      activeStage === stage.id
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {stage.icon}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold tracking-widest ${
                        activeStage === stage.id
                          ? "text-[var(--brand)]"
                          : "text-neutral-400"
                      }`}
                    >
                      {stage.number}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-neutral-500">{stage.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected stage details */}
        <div
          className={`mt-8 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {selectedStage && (
            <div
              key={selectedStage.id}
              className="animate-in fade-in duration-300 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: Description */}
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                    >
                      <div style={{ color: "var(--brand)" }}>
                        {selectedStage.icon}
                      </div>
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold tracking-widest"
                        style={{ color: "var(--brand)" }}
                      >
                        {selectedStage.number}
                      </span>
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        {selectedStage.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {selectedStage.description}
                  </p>
                </div>

                {/* Right: Details */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Key aspects
                  </p>
                  <div className="space-y-2">
                    {selectedStage.details.map((detail, i) => (
                      <div
                        key={detail}
                        className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom note */}
        <p
          className={`mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          This cycle repeats continuously. When monitoring detects drift,
          retraining is triggered automatically.
        </p>
      </div>
    </section>
  );
};

export default ModelLifecycle;
