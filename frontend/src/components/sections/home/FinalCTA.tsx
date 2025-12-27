"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const FinalCTA = () => {
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
      className="relative overflow-hidden bg-black py-24 text-white"
    >
      {/* background glow - animated */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-25 scale-100" : "opacity-0 scale-75"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
        {/* Secondary glow for depth */}
        <div
          className={`absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-15 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* label */}
        <div
          className={`mb-6 flex justify-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/50 px-4 py-1.5 backdrop-blur">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-xs font-medium text-neutral-300">
              Early Access Open
            </span>
          </div>
        </div>

        {/* headline */}
        <h2
          className={`mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Join early access to{" "}
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

        {/* subtext */}
        <p
          className={`mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Get early access to{" "}
          <span className="text-neutral-200">
            probabilistic market forecasts
          </span>
          , <span className="text-neutral-200">confidence scoring</span>, and{" "}
          <span className="text-neutral-200">
            transparent performance tracking
          </span>
          .
        </p>

        {/* actions */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3.5 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Request early access
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
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>

          <Link
            href="/resources/methodology"
            className="group inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-black/50 px-8 py-3.5 text-sm font-medium text-neutral-200 backdrop-blur transition-all duration-300 hover:bg-neutral-900 hover:border-neutral-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              View methodology
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* trust notes */}
        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            { icon: "✓", text: "No credit card required" },
            { icon: "✓", text: "Early users shape the roadmap" },
            { icon: "✓", text: "Cancel anytime" },
          ].map((item, i) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-xs text-neutral-500"
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                style={{
                  backgroundColor: "rgba(4,236,58,0.15)",
                  color: "var(--brand)",
                }}
              >
                {item.icon}
              </span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
