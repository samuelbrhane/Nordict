"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth/AuthProvider";

const MethodologyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { user, isLoading } = useAuth();

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
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Main CTA card */}
        <div
          className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Brand glow */}
          <div
            className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--brand)" }}
          />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div
              className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{
                backgroundColor: "rgba(4,236,58,0.15)",
                transitionDelay: "200ms",
              }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>

            {/* Headline */}
            <h2
              className={`text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              See it in{" "}
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
                action
              </span>
            </h2>

            {/* Description */}
            <p
              className={`mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base max-w-xl mx-auto transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {user
                ? "You understand how it works. Now explore your forecasts, confidence scores, and performance data."
                : "Now that you understand how it works, try it yourself. Start with a 7-day free trial of Premium."}
            </p>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap justify-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              {!isLoading && (
                <>
                  {user ? (
                    <Link
                      href="/app/dashboard"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Go to Dashboard
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
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Start free trial
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
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </Link>

                      <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                      >
                        View pricing
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Trust note - only for non-logged in */}
            {!user && !isLoading && (
              <p
                className={`mt-6 text-xs text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "550ms" }}
              >
                No credit card required • 7-day free trial
              </p>
            )}
          </div>
        </div>

        {/* Related links */}
        <div
          className={`mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Continue exploring
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Forecasting Engine",
                description: "How predictions are generated",
                href: "/product/engine",
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                ),
              },

              {
                title: "Pricing",
                description: "Pro & Premium plans",
                href: "/pricing",
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                ),
              },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 group-hover:bg-[var(--brand)]/15"
                    style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
                  >
                    <div
                      className="transition-colors duration-200"
                      style={{ color: "var(--brand)" }}
                    >
                      {link.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-[var(--brand)] transition-colors">
                      {link.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologyCTA;
