"use client";

import { useState, useEffect, useRef } from "react";

const LIMITATIONS = [
  {
    id: "blackswan",
    title: "Black Swan Events",
    description:
      "Our models learn from historical patterns. Events without precedent—exchange hacks, regulatory surprises, geopolitical shocks—can't be predicted from past data.",
    example:
      "The FTX collapse, Terra/Luna crash, or sudden regulatory bans are examples of events no model could have predicted in advance.",
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
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    id: "lowconf",
    title: "Low Confidence Periods",
    description:
      "Sometimes our models simply don't know. During regime transitions or unusual market conditions, confidence scores drop. Low confidence means low predictability.",
    example:
      "When confidence is below 50%, the forecast is barely better than a coin flip. We show this clearly—don't ignore it.",
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
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    id: "shortterm",
    title: "Very Short Timeframes",
    description:
      "Our shortest horizon is 4 hours. We don't attempt to predict minute-by-minute moves—that's dominated by noise, not signal.",
    example:
      "If you're scalping or trading on 1-minute charts, our forecasts won't help. They're designed for 4h+ decision-making.",
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
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "smallcaps",
    title: "Low Liquidity Assets",
    description:
      "Illiquid assets with thin order books behave differently. A single large order can move price 10%—no model predicts that.",
    example:
      "We focus on assets with sufficient liquidity and trading history. New tokens or micro-caps aren't in our coverage.",
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
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    id: "manipulation",
    title: "Market Manipulation",
    description:
      "Coordinated pump-and-dumps, wash trading, or spoofing create artificial patterns. Our models can be fooled by bad actors, just like human traders.",
    example:
      "If a whale group coordinates a pump on Telegram, our model sees bullish signals—but those signals are artificial.",
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
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    ),
  },
  {
    id: "correlation",
    title: "Correlation ≠ Causation",
    description:
      "Our models find statistical patterns, not causal relationships. A pattern that worked for 5 years can stop working without warning if the underlying dynamics change.",
    example:
      "Past performance doesn't guarantee future results. This isn't a disclaimer—it's a fundamental truth of statistical modeling.",
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
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
];

const Limitations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-700 ease-out ${
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
              Limitations
            </p>
          </div>

          <h2
            className={`text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            What we{" "}
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
              can't
            </span>{" "}
            predict
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base max-w-2xl mx-auto transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Honesty about limitations is as important as confidence in
            strengths. Here's where our models fall short.
          </p>
        </div>

        {/* Limitations list */}
        <div
          className={`space-y-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {LIMITATIONS.map((limitation) => (
            <div
              key={limitation.id}
              className={`rounded-2xl border transition-all duration-300 ${
                expandedId === limitation.id
                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === limitation.id ? null : limitation.id
                  )
                }
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    expandedId === limitation.id
                      ? "bg-amber-200 text-amber-700 dark:bg-amber-800 dark:text-amber-300"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                  }`}
                >
                  {limitation.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {limitation.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                    {limitation.description}
                  </p>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    expandedId === limitation.id
                      ? "rotate-180 bg-amber-200 dark:bg-amber-800"
                      : ""
                  }`}
                >
                  <svg
                    className={`h-4 w-4 transition-colors duration-200 ${
                      expandedId === limitation.id
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  expandedId === limitation.id
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-4">
                      {limitation.description}
                    </p>
                    <div className="rounded-xl bg-amber-100 p-4 dark:bg-amber-900/30">
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
                            Example
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            {limitation.example}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div
          className={`mt-10 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Why we share this
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                Being upfront about limitations isn't weakness—it's how we build
                trust. If we only showed you the wins, you wouldn't have the
                full picture. Use our forecasts as one input among many, not as
                the sole basis for decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Limitations;
