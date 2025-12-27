"use client";

import { useEffect, useState } from "react";

interface LegalHeroProps {
  badge: string;
  title: string;
  highlightedWord: string;
  lastUpdated: string;
  intro: string;
}

const LegalHero = ({
  badge,
  title,
  highlightedWord,
  lastUpdated,
  intro,
}: LegalHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-8 sm:pb-16 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 sm:h-[500px] sm:w-[500px] ${
            isVisible ? "opacity-10 dark:opacity-20" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        {/* Badge */}
        <div
          className={`flex justify-center mb-4 sm:mb-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 backdrop-blur sm:gap-2 sm:px-4 sm:py-1.5 dark:border-neutral-800 dark:bg-neutral-900/60">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse sm:h-2 sm:w-2"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-[10px] font-medium text-neutral-700 sm:text-xs dark:text-neutral-300">
              {badge}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1
            className={`text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {title}{" "}
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
              {highlightedWord}
            </span>
          </h1>

          {/* Last updated */}
          <p
            className={`mt-3 text-[10px] text-neutral-500 sm:mt-4 sm:text-xs dark:text-neutral-400 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            Last updated: {lastUpdated}
          </p>

          {/* Intro */}
          <p
            className={`mt-4 text-sm leading-relaxed text-neutral-600 sm:mt-6 sm:text-base lg:text-lg dark:text-neutral-300 max-w-2xl mx-auto transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {intro}
          </p>
        </div>

        {/* Quick navigation hint */}
        <div
          className={`mt-6 flex justify-center sm:mt-8 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 sm:px-4 dark:border-neutral-800 dark:bg-neutral-900">
            <svg
              className="h-3.5 w-3.5 text-neutral-400 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
            <span className="text-[10px] text-neutral-500 sm:text-xs dark:text-neutral-400">
              Scroll to read full document
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalHero;
