"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const ITEMS = [
  { title: "Walk-forward backtests", note: "Designed to reduce leakage" },
  { title: "Calibrated confidence", note: "Bands mean something" },
  { title: "Model versioning", note: "Compare releases over time" },
  { title: "Transparent metrics", note: "Performance you can verify" },
];

const TrustStrip = () => {
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
      className="relative overflow-hidden border-y border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black"
    >
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-25" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-6 py-10 lg:grid-cols-12">
        {/* Left: "interactive" image card */}
        <div
          className={`lg:col-span-5 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-black/40">
            <Image
              src="/mock/mock2.jpeg"
              alt="Forecast preview"
              width={900}
              height={650}
              className="h-auto w-full opacity-95 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
              priority={false}
            />

            {/* Sliding overlay (hover) */}
            <div className="pointer-events-none absolute inset-0 translate-x-full bg-gradient-to-l from-black/10 via-transparent to-transparent transition-transform duration-500 group-hover:translate-x-0 dark:from-white/10" />

            {/* Corner tag */}
            <div
              className={`absolute left-3 top-3 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs text-neutral-700 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-black/60 dark:text-neutral-200 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Forecast + confidence bands (mock)
            </div>
          </div>
        </div>

        {/* Right: content */}
        <div className="lg:col-span-7">
          {/* label */}
          <div
            className={`flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Rigor you can verify
            </p>
            <span className="hidden h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700 sm:block" />
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Built for transparent evaluation, not hype.
            </p>
          </div>

          {/* headline */}
          <h2
            className={`mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Forecasts are only useful when{" "}
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
              uncertainty is measurable
            </span>
            .
          </h2>

          {/* body */}
          <p
            className={`mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Modelis emphasizes{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              validation
            </span>
            ,{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              calibration
            </span>
            , and{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              traceability
            </span>{" "}
            so you can interpret signals with context—and audit results over
            time.
          </p>

          {/* items */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ITEMS.map((item, i) => (
              <div
                key={item.title}
                className={`group rounded-2xl border border-neutral-200 bg-white/60 p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:border-neutral-800 dark:bg-black/40 dark:hover:bg-black/60 cursor-default ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full transition-transform duration-200 ${
                      hoveredCard === i ? "scale-125" : "scale-100"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                      {item.note}
                    </p>
                  </div>
                </div>

                {/* animated underline */}
                <div
                  className={`mt-3 h-0.5 rounded-full transition-all duration-300 ease-out ${
                    hoveredCard === i ? "w-full" : "w-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
