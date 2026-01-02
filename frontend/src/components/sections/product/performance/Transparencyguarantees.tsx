"use client";

import { useState, useEffect, useRef } from "react";

const GUARANTEES = [
  {
    id: "no-cherry-picking",
    title: "No cherry-picking",
    description:
      "All forecasts are recorded and tracked—not just the good ones. You see the complete picture, including periods of underperformance.",
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
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
        />
      </svg>
    ),
  },
  {
    id: "timestamped",
    title: "Timestamped records",
    description:
      "Every forecast includes an immutable timestamp. We can't go back and change what was predicted after seeing the outcome.",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "versioned",
    title: "Full version history",
    description:
      "Model versions are tracked with complete changelogs. You can see exactly what changed between versions and how it affected performance.",
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
          d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
        />
      </svg>
    ),
  },
  {
    id: "methodology",
    title: "Open methodology",
    description:
      "Our evaluation methodology is documented publicly. You can understand how we measure success and hold us to those standards.",
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
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    id: "honest-failures",
    title: "Honest about failures",
    description:
      "When forecasts are wrong or the model underperforms, we don't hide it. We analyze what happened and share our learnings.",
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
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    id: "exportable",
    title: "Exportable data",
    description:
      "Download your complete forecast history and performance data. Run your own analysis. We have nothing to hide.",
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
];

const AUDIT_LOG_EXAMPLE = [
  {
    time: "2024-12-15 10:00:03",
    event: "Forecast generated",
    details: "BTC 24h: +2.4% (72% conf)",
  },
  {
    time: "2024-12-15 10:00:03",
    event: "Record stored",
    details: "Hash: 0x7f3a...8c2d",
  },
  {
    time: "2024-12-16 10:00:00",
    event: "Outcome recorded",
    details: "Actual: +2.1%",
  },
  {
    time: "2024-12-16 10:00:01",
    event: "Accuracy logged",
    details: "Direction: ✓ Correct",
  },
];

const TransparencyGuarantees = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredGuarantee, setHoveredGuarantee] = useState<number | null>(null);
  const [expandedGuarantee, setExpandedGuarantee] = useState<string | null>(
    null
  );
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
              Transparency guarantees
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
            Built for{" "}
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
              auditability
            </span>
            , not just accuracy.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Trust requires more than good numbers. It requires verifiable
            processes, complete records, and honest communication.
          </p>
        </div>

        {/* Guarantees grid */}
        <div
          className={`mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {GUARANTEES.map((guarantee, i) => (
            <div
              key={guarantee.id}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-default ${
                hoveredGuarantee === i
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-lg -translate-y-1"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
              onMouseEnter={() => setHoveredGuarantee(i)}
              onMouseLeave={() => setHoveredGuarantee(null)}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                  hoveredGuarantee === i
                    ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {guarantee.icon}
              </div>

              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                {guarantee.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {guarantee.description}
              </p>

              {/* Hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                  hoveredGuarantee === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          ))}
        </div>

        {/* Audit log example */}
        <div
          className={`mt-12 grid gap-8 lg:grid-cols-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {/* Left: Audit log */}
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Audit Log Example
              </h3>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Immutable
              </span>
            </div>

            <div className="space-y-3">
              {AUDIT_LOG_EXAMPLE.map((entry, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800 transition-all duration-300 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      <span className="text-xs font-medium text-neutral-900 dark:text-white">
                        {entry.event}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-neutral-400">
                      {entry.time}
                    </span>
                  </div>
                  <p className="mt-1 ml-4 text-xs text-neutral-600 dark:text-neutral-400">
                    {entry.details}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              Every forecast creates an immutable record that cannot be altered
              after the fact.
            </p>
          </div>

          {/* Right: Commitment statement */}
          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border-2 border-dashed border-neutral-300 bg-white p-8 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                >
                  <svg
                    className="h-6 w-6"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Our Promise
                </h3>
              </div>

              <blockquote className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                "We will never hide bad performance, manipulate historical
                records, or present backtests as live results. If we make a
                mistake, we'll own it publicly. Trust is built on honesty, not
                perfection."
              </blockquote>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Nordict Team
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Founding principles
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[
                { value: "100%", label: "Forecasts tracked" },
                { value: "0", label: "Records modified" },
                { value: "Public", label: "Methodology" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-neutral-200 bg-white p-3 text-center dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "var(--brand)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencyGuarantees;
