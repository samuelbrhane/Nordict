"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FAQS = [
  {
    question: "Can I try before I buy?",
    answer:
      "Yes! You get a 7-day free trial of Premium when you sign up. No credit card required to start. You'll have full access to all features during the trial period.",
  },
  {
    question: "What's the difference between Pro and Premium?",
    answer:
      "Pro gives you access to 10 markets, 5 alerts, and 2 forecast horizons (24H and 30D) with 30 days of historical data. Premium unlocks unlimited markets and alerts, all 4 forecast horizons (24H, 30D, 12W, 12M), and unlimited historical data.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Absolutely. Upgrade or downgrade anytime from your account settings. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle.",
  },
  {
    question: "How does annual billing work?",
    answer:
      "Annual plans are billed once per year and include a 20% discount compared to monthly billing. Pro is $86/year ($7/month) and Premium is $180/year ($15/month). You can switch from monthly to annual anytime.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a full refund within the first 30 days if you're not satisfied. After that, you can cancel anytime and continue using the service until the end of your billing period.",
  },
  {
    question: "When will Teams be available?",
    answer:
      "Teams is coming soon! It will include everything in Premium plus API access, team dashboards, role-based access, shared alerts, and audit logs for up to 10 team members at $49/month.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. All payments are processed securely through Stripe.",
  },
  {
    question: "What happens after my trial ends?",
    answer:
      "After your 7-day trial, you can choose to subscribe to Pro or Premium. If you don't subscribe, you'll lose access to forecasts until you choose a plan. We'll send you a reminder before your trial ends.",
  },
];

const PricingFAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

      <div className="relative z-10 mx-auto max-w-3xl px-6">
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
              FAQ
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
            Common{" "}
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
              questions
            </span>
          </h2>
        </div>

        {/* FAQ items */}
        <div
          className={`space-y-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i
                  ? "border-[var(--brand)]/30 bg-white shadow-md dark:bg-neutral-900"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    openIndex === i
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  style={{
                    backgroundColor:
                      openIndex === i ? "var(--brand)" : "transparent",
                  }}
                >
                  <svg
                    className={`h-4 w-4 transition-colors duration-200 ${
                      openIndex === i
                        ? "text-black"
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

              {/* Answer */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div
          className={`mt-10 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand)" }}
            >
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
