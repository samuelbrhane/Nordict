"use client";

import { useState, useEffect, useRef } from "react";

const AboutStory = () => {
  const [isVisible, setIsVisible] = useState(false);
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
          className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              className="h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              The story
            </p>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            Why we're building{" "}
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
              Nordict
            </span>
          </h2>
        </div>

        {/* Story content */}
        <div
          className={`space-y-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
              >
                💡
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  The problem we kept seeing
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Every crypto "signal" service out there tells the same story:
                  vague predictions, no accountability, and zero transparency
                  about methodology. When they're right, they celebrate. When
                  they're wrong, they quietly move on. We wanted something
                  better.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
              >
                🔬
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  A different approach
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  What if predictions came with confidence scores? What if you
                  knew exactly how the model worked? What if performance was
                  tracked transparently, including the misses? That's what we
                  set out to build—a forecasting tool that treats users like
                  adults.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
              >
                🚀
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Where we're going
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Nordict is just getting started. The goal isn't to be the
                  loudest voice in crypto—it's to be the most reliable. We're
                  building this in public, shipping fast, and iterating based on
                  real user feedback. If you believe in transparent, data-driven
                  tools, we'd love for you to join the journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing note */}
        <div
          className={`mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Built with care
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                We're not a VC-backed startup chasing hype. We're builders who
                got tired of bad predictions and decided to create something
                better. If that resonates with you, we'd love to have you along
                for the ride.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
