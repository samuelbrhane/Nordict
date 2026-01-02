"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const ProductCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-black py-32"
    >
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary glow */}
        <div
          className={`absolute h-[600px] w-[600px] rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-30" : "opacity-0"
          }`}
          style={{
            backgroundColor: "var(--brand)",
            left: `calc(30% + ${mousePosition.x * 30}px)`,
            top: `calc(40% + ${mousePosition.y * 30}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Secondary glow */}
        <div
          className={`absolute h-[400px] w-[400px] rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-20" : "opacity-0"
          }`}
          style={{
            backgroundColor: "var(--brand)",
            right: `calc(20% + ${mousePosition.x * -20}px)`,
            bottom: `calc(30% + ${mousePosition.y * -20}px)`,
            transform: "translate(50%, 50%)",
            transitionDelay: "200ms",
          }}
        />

        {/* Tertiary glow */}
        <div
          className={`absolute h-[300px] w-[300px] rounded-full blur-3xl transition-all duration-1000 ${
            isVisible ? "opacity-15" : "opacity-0"
          }`}
          style={{
            backgroundColor: "#ffffff",
            left: `calc(60% + ${mousePosition.x * 15}px)`,
            top: `calc(20% + ${mousePosition.y * 15}px)`,
            transform: "translate(-50%, -50%)",
            transitionDelay: "400ms",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-700/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div
            className={`mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/60 px-4 py-2 backdrop-blur transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </span>
            <span className="text-sm font-medium text-neutral-300">
              Early access now open
            </span>
          </div>

          {/* Headline */}
          <h2
            className={`text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Ready to see forecasting done{" "}
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
              differently
            </span>
            ?
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Join the waitlist for early access to Nordict. Get{" "}
            <span className="text-neutral-200">probabilistic forecasts</span>,{" "}
            <span className="text-neutral-200">calibrated confidence</span>, and{" "}
            <span className="text-neutral-200">
              transparent performance tracking
            </span>
            —before the public launch.
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              href="/contact"
              className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-8 py-4 text-base font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/40 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Request early access
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
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
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/pricing"
              className="group inline-flex w-full items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/50 px-8 py-4 text-base font-medium text-neutral-200 backdrop-blur transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-600 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              <span className="flex items-center gap-2">
                View pricing
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
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

          {/* Trust indicators */}
          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            {[
              { icon: "✓", text: "No credit card required" },
              { icon: "✓", text: "Cancel anytime" },
              { icon: "✓", text: "Early users shape the roadmap" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-sm text-neutral-500"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
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

          {/* Bottom links */}
          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-neutral-800 pt-8 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <Link
              href="/resources/methodology"
              className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Read methodology</span>
              <svg
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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

            <Link
              href="/company/about"
              className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>About us</span>
              <svg
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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

            <Link
              href="/company/contact"
              className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Contact</span>
              <svg
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCTA;
