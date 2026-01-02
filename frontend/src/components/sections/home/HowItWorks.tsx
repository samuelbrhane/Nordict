"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const STEPS = [
  {
    step: "01",
    title: "Ingest & normalize data",
    desc: "Fetch market data, validate inputs, and store clean time-series for training and evaluation.",
  },
  {
    step: "02",
    title: "Train & version models",
    desc: "Run walk-forward training and evaluation, store model artifacts, and record metadata for auditability.",
  },
  {
    step: "03",
    title: "Serve forecasts & track performance",
    desc: "Generate multi-horizon predictions with confidence scoring and continuously monitor live results.",
  },
];

const HowItWorks = () => {
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
              How it works
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
            A simple workflow, designed for{" "}
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
              real-world evaluation
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
            Nordict separates{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              ingestion
            </span>
            ,{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              training
            </span>
            , and{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              serving
            </span>{" "}
            so the web app stays fast while model workloads scale independently.
          </p>
        </div>

        {/* steps */}
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
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
                <span
                  className={`text-xs font-semibold tracking-widest transition-colors duration-200 ${
                    hoveredCard === i
                      ? "text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`h-2 w-2 rounded-full transition-transform duration-200 ${
                    hoveredCard === i ? "scale-125" : "scale-100"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {s.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {s.desc}
              </p>

              {/* Connecting line between steps (visible on lg screens) */}
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden lg:block absolute -right-2 top-1/2 w-4 h-px bg-neutral-200 dark:bg-neutral-700 transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  }`}
                  style={{
                    transitionDelay: `${600 + i * 100}ms`,
                    transformOrigin: "left center",
                  }}
                />
              )}

              {/* hover accent */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                  hoveredCard === i ? "w-full" : "w-0"
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

export default HowItWorks;
