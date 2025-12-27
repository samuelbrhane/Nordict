"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface SubPageCTAProps {
  title?: string;
  highlight?: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  relatedLinks?: {
    label: string;
    href: string;
    description: string;
  }[];
}

const SubPageCTA = ({
  title = "Ready to explore",
  highlight = "further",
  description = "Get early access to Nordict and see how rigorous forecasting can support your decisions.",
  primaryCTA = {
    label: "Request early access",
    href: "/contact",
  },
  secondaryCTA = {
    label: "Back to Product",
    href: "/product",
  },
  relatedLinks = [],
}: SubPageCTAProps) => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-20"
    >
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-25" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-700/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h2
            className={`text-2xl font-semibold tracking-tight text-white sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
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
              {highlight}
            </span>
            ?
          </h2>

          {/* Description */}
          <p
            className={`mt-4 text-sm leading-relaxed text-neutral-400 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className={`mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Link
              href={primaryCTA.href}
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/40 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {primaryCTA.label}
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
              href={secondaryCTA.href}
              className="group inline-flex w-full items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/50 px-6 py-3 text-sm font-medium text-neutral-300 backdrop-blur transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-600 hover:text-white hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              <span className="flex items-center gap-2">
                {secondaryCTA.label}
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Related links */}
          {relatedLinks.length > 0 && (
            <div
              className={`mt-12 border-t border-neutral-800 pt-8 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Continue exploring
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[var(--brand)] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {link.description}
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 text-neutral-600 transition-all duration-200 group-hover:text-[var(--brand)] group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubPageCTA;
