"use client";

import { useState, useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "I used to check prices 10 times a day and stress about every dip. Now I get one weekly digest, glance at the portfolio score, and actually enjoy my weekends again.",
    name: "David Park",
    role: "Long-term Holder",
    experience: "Investing since 2017",
    metric: {
      label: "Check frequency",
      value: "1x/week",
    },
    avatar: "DP",
  },
  {
    id: 2,
    quote:
      "The DCA timing signals paid for the subscription in the first month. I shifted my weekly buy by 3 days based on the forecast and caught a 6% better entry.",
    name: "Rachel Torres",
    role: "DCA Investor",
    experience: "3-year investment horizon",
    metric: {
      label: "Avg. entry improvement",
      value: "+4.2%",
    },
    avatar: "RT",
  },
  {
    id: 3,
    quote:
      "During the last drawdown, everyone was panicking. The forecast showed confidence recovering while price was still falling. Held my position and it paid off.",
    name: "Michael Andersen",
    role: "Portfolio Manager",
    experience: "Managing family portfolio",
    metric: {
      label: "Drawdown held through",
      value: "-32%",
    },
    avatar: "MA",
  },
];

const InvestorTestimonial = () => {
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
      className="relative overflow-hidden bg-white py-20 dark:bg-black"
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
              From investors like you
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
          <div className="relative rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
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
                    {current.experience}
                  </p>
                </div>
              </div>

              {/* Metric */}
              <div className="rounded-xl border border-neutral-200 bg-white px-5 py-3 dark:border-neutral-700 dark:bg-neutral-800">
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
            * Testimonials represent individual experiences. Investment results
            vary.
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
              value: "1,800+",
              label: "Long-term investors",
              subtext: "using Nordict weekly",
            },
            {
              value: "92%",
              label: "Report less stress",
              subtext: "about market volatility",
            },
            {
              value: "3.2x",
              label: "Longer hold times",
              subtext: "vs. before using Nordict",
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
      </div>
    </section>
  );
};

export default InvestorTestimonial;
