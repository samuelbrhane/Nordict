"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const HIGHLIGHTS = [
  {
    title: "Walk-forward validation",
    desc: "Models are evaluated sequentially to better reflect live deployment conditions.",
  },
  {
    title: "Leakage prevention",
    desc: "Strict separation of training, validation, and test windows.",
  },
  {
    title: "Confidence calibration",
    desc: "Probabilities are evaluated so confidence bands remain meaningful.",
  },
  {
    title: "Regime-aware evaluation",
    desc: "Performance is inspected across different market conditions.",
  },
];

const MethodologyHighlights = () => {
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="mx-auto max-w-7xl px-6">
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
              Methodology highlights
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
            Designed for{" "}
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
              statistical rigor
            </span>{" "}
            and transparency.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Forecasts are only as useful as the evaluation behind them. Each
            model is trained, validated, and monitored with explicit safeguards.
          </p>
        </div>

        {/* highlights */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:border-neutral-800 dark:bg-black/40 dark:hover:bg-black/60 cursor-default ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 80}ms` }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-transform duration-200 ${
                    hoveredCard === i ? "scale-125" : "scale-100"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {h.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {h.desc}
                  </p>
                </div>
              </div>

              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                  hoveredCard === i ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-10 flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <Link
            href="/resources/methodology"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-[var(--brand)]/20 active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Read full methodology
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
            </span>
          </Link>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Detailed assumptions and limitations are disclosed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MethodologyHighlights;
