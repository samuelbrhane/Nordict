"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth/AuthProvider";

const RoadmapCTA = () => {
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

      <div className="relative z-10 mx-auto max-w-2xl px-6">
        {/* Main CTA card */}
        <div
          className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-10 transition-all duration-700 ease-out ${
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
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-7 w-7"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>

            {/* Headline */}
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
              Have a feature request?
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              This roadmap is shaped by user feedback. If there's something
              you'd like to see, we'd love to hear about it.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!isLoading && (
                <>
                  <Link
                    href="/contact"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Share your ideas
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

                  {!user && (
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                    >
                      Start free trial
                    </Link>
                  )}

                  {user && (
                    <Link
                      href="/app/dashboard"
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                    >
                      Go to Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Follow updates - commented out for now */}
        {/*
        <div
          className={`mt-8 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Get notified when we ship
          </p>
          <div className="flex justify-center gap-3">
            
              href="https://twitter.com/nordict"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
            >
              <svg
                className="h-4 w-4"
                style={{ color: "var(--brand)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow @nordict
            </a>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700"
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
              Read the blog
            </Link>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default RoadmapCTA;
