"use client";

import { useEffect, useState, useRef } from "react";

const ProblemSolution = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<"problem" | "solution" | null>(
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problemItems = [
    "Overfitting disguised as accuracy",
    "No visibility into uncertainty",
    "Backtests that don't reflect live conditions",
  ];

  const solutionItems = [
    "Confidence bands instead of single outcomes",
    "Multi-horizon forecasts for context",
    "Versioned models with live performance tracking",
  ];

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
      <div className="mx-auto max-w-7xl px-6">
        {/* Section label */}
        <div
          className={`mb-10 flex items-center gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Problem → Solution
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Problem */}
          <div
            className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 ease-out hover:shadow-md dark:border-neutral-800 dark:bg-black cursor-default ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
            onMouseEnter={() => setHoveredCard("problem")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Markets are noisy
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Point predictions hide uncertainty. Backtests are often
              optimistic. Performance is rarely tracked once models go live.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
              {problemItems.map((item, i) => (
                <li
                  key={item}
                  className={`flex gap-2 transition-all duration-500 ease-out ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                  style={{ transitionDelay: `${250 + i * 80}ms` }}
                >
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 transition-transform duration-200 ${
                      hoveredCard === "problem" ? "scale-125" : "scale-100"
                    }`}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* subtle hover cue */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-neutral-300 transition-all duration-500 dark:bg-neutral-700 ${
                hoveredCard === "problem" ? "w-full" : "w-0"
              }`}
            />
          </div>

          {/* Solution */}
          <div
            className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 ease-out hover:shadow-md dark:border-neutral-800 dark:bg-black cursor-default ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
            onMouseEnter={() => setHoveredCard("solution")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              We model{" "}
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
                uncertainty explicitly
              </span>
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              Nordict produces{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-100">
                probabilistic forecasts
              </span>{" "}
              across multiple horizons and tracks performance using{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-100">
                walk-forward evaluation
              </span>
              .
            </p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
              {solutionItems.map((item, i) => (
                <li
                  key={item}
                  className={`flex gap-2 transition-all duration-500 ease-out ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                  style={{ transitionDelay: `${350 + i * 80}ms` }}
                >
                  <span
                    className={`mt-1 h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                      hoveredCard === "solution" ? "scale-125" : "scale-100"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* brand hover accent */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                hoveredCard === "solution" ? "w-full" : "w-0"
              }`}
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
