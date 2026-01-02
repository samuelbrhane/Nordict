"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { LoadingSpinner } from "@/components/app";

const FinalCTA = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading]); // Add isLoading as dependency

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-24 text-white"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* background glow - animated */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000 ${
                isVisible ? "opacity-25 scale-100" : "opacity-0 scale-75"
              }`}
              style={{ backgroundColor: "var(--brand)" }}
            />
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

          <div className="relative mx-auto max-w-screen-2xl px-6 text-center">
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
                  {user ? "Welcome back" : "Now Available"}
                </span>
              </div>
            </div>

            {/* headline */}
            <h2
              className={`mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {user ? (
                <>
                  Continue exploring{" "}
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
                </>
              ) : (
                <>
                  Start using{" "}
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
                  </span>{" "}
                  today
                </>
              )}
            </h2>

            {/* subtext */}
            <p
              className={`mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {user ? (
                <>
                  View your{" "}
                  <span className="text-neutral-200">latest forecasts</span>,{" "}
                  <span className="text-neutral-200">track performance</span>,
                  and{" "}
                  <span className="text-neutral-200">explore new markets</span>.
                </>
              ) : (
                <>
                  Access{" "}
                  <span className="text-neutral-200">
                    probabilistic market forecasts
                  </span>
                  , <span className="text-neutral-200">confidence scoring</span>
                  , and{" "}
                  <span className="text-neutral-200">
                    transparent performance tracking
                  </span>
                  .
                </>
              )}
            </p>

            {/* actions */}
            <div
              className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {user ? (
                <Link
                  href="/app/dashboard"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3.5 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
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
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-3.5 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get started free
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
                    href="/login"
                    className="group inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-black/50 px-8 py-3.5 text-sm font-medium text-neutral-200 backdrop-blur transition-all duration-300 hover:bg-neutral-900 hover:border-neutral-600 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      Sign in
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* trust notes - only show for non-logged in users */}
            {!user && (
              <div
                className={`mt-10 flex flex-wrap items-center justify-center gap-6 transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                {[
                  { icon: "✓", text: "Free to get started" },
                  { icon: "✓", text: "No credit card required" },
                  { icon: "✓", text: "Cancel anytime" },
                ].map((item) => (
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
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default FinalCTA;
