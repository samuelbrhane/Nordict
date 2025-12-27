"use client";

import { useState, useEffect, useRef } from "react";

const NOISE_CONTROLS = [
  {
    id: "cooldown",
    name: "Cooldown Periods",
    description:
      "Set minimum time between repeat alerts for the same condition.",
    example: "Don't alert again for 4 hours after triggering",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "threshold",
    name: "Significance Thresholds",
    description: "Only trigger when changes exceed meaningful levels.",
    example: "Alert only if confidence changes by 10%+, not 1%",
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
          d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
        />
      </svg>
    ),
  },
  {
    id: "hold",
    name: "Hold Duration",
    description: "Require conditions to persist before firing.",
    example: "Must stay triggered for 15 minutes before alerting",
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
          d="M15.75 5.25v13.5m-7.5-13.5v13.5"
        />
      </svg>
    ),
  },
  {
    id: "schedule",
    name: "Quiet Hours",
    description: "Pause non-critical alerts during specific times.",
    example: "No alerts between 11pm and 7am except critical",
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
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    ),
  },
  {
    id: "priority",
    name: "Priority Levels",
    description: "Route alerts by importance to different channels.",
    example: "Critical → Push, Normal → Email, Low → Digest only",
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
          d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21l3.75-3.75"
        />
      </svg>
    ),
  },
  {
    id: "digest",
    name: "Batch Digests",
    description: "Combine multiple low-priority alerts into summaries.",
    example: "Daily digest at 9am with all non-urgent alerts",
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
          d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
        />
      </svg>
    ),
  },
];

const BEFORE_AFTER = {
  before: {
    label: "Without controls",
    alerts: 47,
    period: "24 hours",
    status: "Overwhelming",
    color: "#ef4444",
  },
  after: {
    label: "With smart controls",
    alerts: 8,
    period: "24 hours",
    status: "Actionable",
    color: "var(--brand)",
  },
};

const AlertNoise = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredControl, setHoveredControl] = useState<number | null>(null);
  const [showAfter, setShowAfter] = useState(false);
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

  // Toggle before/after comparison
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

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
              Managing alert noise
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
            More alerts isn't{" "}
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
              better
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
            Alert fatigue is real. We've built in controls to ensure every
            notification you receive is worth your attention.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Left: Before/After comparison (1 col) */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black h-full">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                The Difference
              </h3>

              {/* Toggle */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <button
                  onClick={() => setShowAfter(false)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    !showAfter
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  Before
                </button>
                <button
                  onClick={() => setShowAfter(true)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    showAfter
                      ? "bg-[var(--brand)]/20 text-[var(--brand)]"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  After
                </button>
              </div>

              {/* Comparison card */}
              <div
                className={`rounded-2xl border-2 p-6 transition-all duration-500 ${
                  showAfter
                    ? "border-[var(--brand)]/50 bg-[var(--brand)]/5"
                    : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                }`}
              >
                <div className="text-center">
                  <p
                    className="text-5xl font-bold transition-all duration-300"
                    style={{ color: showAfter ? "var(--brand)" : "#ef4444" }}
                  >
                    {showAfter
                      ? BEFORE_AFTER.after.alerts
                      : BEFORE_AFTER.before.alerts}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    alerts in{" "}
                    {showAfter
                      ? BEFORE_AFTER.after.period
                      : BEFORE_AFTER.before.period}
                  </p>
                  <div className="mt-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                        showAfter
                          ? "bg-[var(--brand)] text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {showAfter
                        ? BEFORE_AFTER.after.status
                        : BEFORE_AFTER.before.status}
                    </span>
                  </div>
                </div>

                {/* Visual representation */}
                <div className="mt-6 flex flex-wrap justify-center gap-1">
                  {[...Array(showAfter ? 8 : 47)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        i < (showAfter ? 8 : 12) ? "" : "opacity-50"
                      }`}
                      style={{
                        backgroundColor: showAfter ? "var(--brand)" : "#ef4444",
                        transitionDelay: `${i * 20}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Reduction stat */}
              <div className="mt-4 text-center">
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--brand)" }}
                >
                  83%
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  reduction in noise
                </p>
              </div>
            </div>
          </div>

          {/* Right: Controls grid (2 cols) */}
          <div
            className={`lg:col-span-2 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Built-in Controls
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {NOISE_CONTROLS.map((control, i) => (
                <div
                  key={control.id}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-default ${
                    hoveredControl === i
                      ? "border-[var(--brand)]/50 bg-white shadow-md dark:bg-black"
                      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  }`}
                  onMouseEnter={() => setHoveredControl(i)}
                  onMouseLeave={() => setHoveredControl(null)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                        hoveredControl === i
                          ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {control.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {control.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {control.description}
                      </p>
                      <div className="mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 dark:bg-neutral-800">
                        <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {control.example}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredControl === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Philosophy note */}
        <div
          className={`mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Our philosophy: Signal, not noise
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                Every alert should prompt a question: "Should I look into this?"
                If you're ignoring alerts, your settings need tuning. We'd
                rather you receive 5 alerts you act on than 50 you dismiss.
                Quality over quantity, always.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertNoise;
