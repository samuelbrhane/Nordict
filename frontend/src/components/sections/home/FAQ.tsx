"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "Is this financial advice?",
    a: "No. Nordict provides data-driven forecasts and analytics for informational purposes only. It does not constitute investment advice.",
  },
  {
    q: "How often are forecasts updated?",
    a: "Forecasts are updated on scheduled intervals depending on the asset and horizon, typically hourly and daily.",
  },
  {
    q: "What does confidence mean?",
    a: "Confidence represents calibrated probability bands around forecasts, indicating uncertainty rather than a single point estimate.",
  },
  {
    q: "What data sources do you use?",
    a: "We use historical market data from reputable providers and apply normalization, validation, and quality checks before modeling.",
  },
  {
    q: "Is API access available?",
    a: "API access is planned for upcoming plans and will allow programmatic access to forecasts, history, and model metadata.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
          className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left column - header (sticky on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  FAQ
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
                Common questions,{" "}
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
                  answered clearly
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
                Transparency matters. If you have additional questions, feel
                free to reach out.
              </p>

              {/* CTA moved here */}
              <div
                className={`mt-6 transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <span>Have more questions?</span>
                  <span
                    className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium text-black transition-all duration-200 group-hover:scale-105"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Contact us
                    <svg
                      className="ml-1.5 w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
              </div>
            </div>
          </div>

          {/* Right column - accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {FAQS.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={item.q}
                    className={`transition-all duration-500 ease-out ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${300 + index * 80}ms` }}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="group w-full text-left"
                    >
                      <div
                        className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 dark:bg-black ${
                          isOpen
                            ? "border-[var(--brand)]/30 shadow-md"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Question number */}
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition-colors duration-200 ${
                              isOpen
                                ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 sm:text-base pr-8">
                              {item.q}
                            </h3>

                            {/* animated answer */}
                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                isOpen
                                  ? "grid-rows-[1fr] opacity-100 mt-3"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* icon */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                              isOpen
                                ? "bg-[var(--brand)] rotate-45"
                                : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                            }`}
                          >
                            <svg
                              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                                isOpen
                                  ? "text-black"
                                  : "text-neutral-500 dark:text-neutral-400"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Bottom accent when open */}
                        <div
                          className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-300 ${
                            isOpen ? "w-full" : "w-0"
                          }`}
                          style={{ backgroundColor: "var(--brand)" }}
                        />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <p
              className={`mt-6 text-xs text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              More technical details are available in the{" "}
              <Link
                href="/resources/methodology"
                className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                methodology section
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
