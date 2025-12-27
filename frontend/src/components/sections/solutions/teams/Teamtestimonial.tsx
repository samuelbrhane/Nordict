"use client";

import { useState, useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "We cut our morning standup from 45 minutes to 15. Everyone opens the shared dashboard, we align on the forecasts, and get to work. No more debating whose analysis is right.",
    name: "Jennifer Walsh",
    role: "Head of Research",
    company: "Meridian Capital",
    teamSize: "12 analysts",
    metric: {
      label: "Standup time saved",
      value: "67%",
    },
    avatar: "JW",
  },
  {
    id: 2,
    quote:
      "The audit trail is a lifesaver. When compliance asks why we made a trade, I can show them exactly what forecasts we saw and when. Documentation that used to take days now takes minutes.",
    name: "Robert Chen",
    role: "Chief Compliance Officer",
    company: "Apex Trading Group",
    teamSize: "8-person trading desk",
    metric: {
      label: "Audit prep time",
      value: "-80%",
    },
    avatar: "RC",
  },
  {
    id: 3,
    quote:
      "Our APAC and US teams used to work in silos. Now with shared alerts and annotated forecasts, the handoff is seamless. It's like having one team across timezones.",
    name: "Priya Sharma",
    role: "Global Trading Director",
    company: "Vertex Partners",
    teamSize: "24/7 coverage, 3 shifts",
    metric: {
      label: "Handoff issues",
      value: "-90%",
    },
    avatar: "PS",
  },
];

const TeamTestimonial = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const current = TESTIMONIALS[activeTestimonial];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-950"
    >
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className="h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              From teams like yours
            </p>
          </div>
        </div>

        {/* Testimonial card */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
            {/* Quote mark */}
            <div
              className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full text-lg font-serif"
              style={{ backgroundColor: "var(--brand)", color: "black" }}
            >
              "
            </div>

            {/* Quote */}
            <blockquote className="mb-8">
              <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-xl">
                {current.quote}
              </p>
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {current.avatar}
                </div>

                <div>
                  <p className="text-base font-semibold text-neutral-900 dark:text-white">
                    {current.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {current.role}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {current.company} • {current.teamSize}
                  </p>
                </div>
              </div>

              {/* Metric */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {current.metric.label}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--brand)" }}
                >
                  {current.metric.value}
                </p>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === i
                      ? "w-8"
                      : "w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                  }`}
                  style={{
                    backgroundColor:
                      activeTestimonial === i ? "var(--brand)" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className={`mt-6 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            * Testimonials represent individual team experiences. Results vary
            by organization.
          </p>
        </div>

        {/* Trust indicators */}
        <div
          className={`mt-12 grid gap-6 sm:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            {
              value: "45+",
              label: "Teams onboarded",
              subtext: "research & trading desks",
            },
            {
              value: "340+",
              label: "Team members",
              subtext: "across all organizations",
            },
            {
              value: "98%",
              label: "Team retention",
              subtext: "after first 90 days",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p
                className="text-3xl font-bold"
                style={{ color: "var(--brand)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                {stat.label}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Enterprise callout */}
        <div
          className={`mt-10 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
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
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Enterprise deployment available
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Custom integrations, dedicated support, and on-premise
                  options.
                </p>
              </div>
            </div>
            <button
              className="shrink-0 rounded-xl px-6 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Talk to sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamTestimonial;
