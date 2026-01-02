"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const USE_CASES = [
  {
    title: "Traders",
    desc: "Use short- and medium-horizon forecasts with confidence bands to improve timing and manage risk.",
    bullets: [
      "Intraday to multi-day horizons",
      "Confidence-aware entries & exits",
      "Alert-driven monitoring",
    ],
    cta: "/solutions/traders",
  },
  {
    title: "Investors",
    desc: "Frame longer-term direction and downside risk with probabilistic scenarios and regime context.",
    bullets: [
      "Weekly horizons & trend context",
      "Downside-aware confidence",
      "Backtested performance views",
    ],
    cta: "/solutions/investors",
  },
  {
    title: "Teams",
    desc: "Share forecasts, track versions, and integrate via API for research and production workflows.",
    bullets: [
      "Shared dashboards",
      "Model version comparisons",
      "API & exports (coming)",
    ],
    cta: "/solutions/teams",
    coming: true,
  },
];

const UseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="mx-auto max-w-screen-2xl px-6">
        {/* header */}
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
              different decision styles
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
            The same forecasting engine adapts to how individuals and teams make
            decisions without changing the underlying rigor.
          </p>
        </div>

        {/* cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u, i) => (
            <div
              key={u.title}
              className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:border-neutral-800 dark:bg-black/40 dark:hover:bg-black/60 cursor-default ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {u.title}
                </h3>
                {u.coming ? (
                  <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
                    Coming soon
                  </span>
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full transition-transform duration-200 ${
                      hoveredCard === i ? "scale-125" : "scale-100"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {u.desc}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                {u.bullets.map((b, bulletIndex) => (
                  <li
                    key={b}
                    className={`flex gap-2 transition-all duration-500 ease-out ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-3"
                    }`}
                    style={{
                      transitionDelay: `${400 + i * 100 + bulletIndex * 50}ms`,
                    }}
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-200 ${
                        hoveredCard === i ? "scale-125" : "scale-100"
                      }`}
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              {/* hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                  hoveredCard === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />

              {/* link */}
              <div className="mt-6">
                <Link
                  href={u.cta}
                  className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100 transition-colors"
                >
                  Learn more
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
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
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
