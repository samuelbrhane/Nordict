"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth/AuthProvider";

const AboutCTA = () => {
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
      className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-950"
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Main CTA card */}
        <div
          className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Brand glow */}
          <div
            className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--brand)" }}
          />

          <div className="relative z-10 text-center">
            {/* Headline */}
            <h2
              className={`text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {user ? (
                <>
                  Continue the{" "}
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
                    journey
                  </span>
                </>
              ) : (
                <>
                  Join the{" "}
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
                    journey
                  </span>
                </>
              )}
            </h2>

            {/* Description */}
            <p
              className={`mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base max-w-lg mx-auto transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {user
                ? "Thanks for being part of Nordict. Explore your forecasts and help us build something great."
                : "Nordict is being built in public. Start your free trial, explore the methodology, or just say hello."}
            </p>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap justify-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {!isLoading && (
                <>
                  {user ? (
                    <>
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

                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                      >
                        Get in touch
                      </Link>
                    </>
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
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-8 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                      >
                        Get in touch
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
                style={{ transitionDelay: "450ms" }}
              >
                No credit card required • 7-day free trial
              </p>
            )}
          </div>
        </div>

        {/* Follow section - commented out for now */}
        {/*
        <div
          className={`mt-10 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Follow the build
          </p>
          <div className="flex justify-center gap-4">
            
              href="https://twitter.com/nordict"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg
                className="h-4 w-4"
                style={{ color: "var(--brand)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @nordict
            </a>

            
              href="https://github.com/nordict"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg
                className="h-4 w-4"
                style={{ color: "var(--brand)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </a>

            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg
                className="h-4 w-4"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              Blog
            </Link>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default AboutCTA;
