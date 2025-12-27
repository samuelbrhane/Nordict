"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const ProductPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPanel, setHoveredPanel] = useState<
    "forecast" | "performance" | null
  >(null);
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
      className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-950"
    >
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>
      {/* background divider */}
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
              Product preview
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
            See{" "}
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
              forecasts
            </span>
            , confidence, and performance in one place.
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Interactive panels let you switch horizons, inspect uncertainty, and
            track how models perform over time. Screens below use mock data.
          </p>
        </div>

        {/* preview panels */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Forecast panel */}
          <div
            className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-500 ease-out hover:shadow-lg dark:border-neutral-800 dark:bg-black ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
            onMouseEnter={() => setHoveredPanel("forecast")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <Image
              src="/mock/mock6.jpeg"
              alt="Forecast panel preview (mock)"
              width={1200}
              height={900}
              className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* slide overlay */}
            <div className="pointer-events-none absolute inset-0 translate-x-full bg-gradient-to-l from-black/10 via-transparent to-transparent transition-transform duration-700 group-hover:translate-x-0 dark:from-white/10" />

            <div
              className={`absolute left-4 top-4 rounded-full border bg-white/80 px-3 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur transition-all duration-300 dark:bg-black/60 dark:text-neutral-200 ${
                hoveredPanel === "forecast"
                  ? "border-[var(--brand)]/50 dark:border-[var(--brand)]/50"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                    hoveredPanel === "forecast" ? "scale-125" : "scale-100"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
                Forecast panel
              </span>
            </div>

            {/* Bottom accent */}
            <div
              className={`absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                hoveredPanel === "forecast" ? "w-full" : "w-0"
              }`}
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>

          {/* Performance panel */}
          <div
            className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-500 ease-out hover:shadow-lg dark:border-neutral-800 dark:bg-black ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
            onMouseEnter={() => setHoveredPanel("performance")}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <Image
              src="/mock/mock5.jpeg"
              alt="Performance panel preview (mock)"
              width={1200}
              height={900}
              className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* slide overlay */}
            <div className="pointer-events-none absolute inset-0 translate-x-full bg-gradient-to-l from-black/10 via-transparent to-transparent transition-transform duration-700 group-hover:translate-x-0 dark:from-white/10" />

            <div
              className={`absolute left-4 top-4 rounded-full border bg-white/80 px-3 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur transition-all duration-300 dark:bg-black/60 dark:text-neutral-200 ${
                hoveredPanel === "performance"
                  ? "border-[var(--brand)]/50 dark:border-[var(--brand)]/50"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
                    hoveredPanel === "performance" ? "scale-125" : "scale-100"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
                Performance panel
              </span>
            </div>

            {/* Bottom accent */}
            <div
              className={`absolute inset-x-0 bottom-0 h-1 transition-all duration-500 ${
                hoveredPanel === "performance" ? "w-full" : "w-0"
              }`}
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>

        {/* footer actions */}
        <div
          className={`mt-10 flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <Link
            href="/product"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-[var(--brand)]/20 active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore product
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
            All visuals shown use illustrative data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
