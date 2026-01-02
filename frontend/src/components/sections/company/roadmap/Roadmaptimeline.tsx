"use client";

import { useState, useEffect, useRef } from "react";

const ROADMAP_ITEMS = [
  {
    status: "completed",
    label: "Shipped",
    items: [
      {
        title: "Forecasting Engine v1",
        description: "Core prediction models for 50+ markets",
        date: "Q4 2024",
      },
      {
        title: "Confidence Scoring",
        description: "0-100% confidence on every forecast",
        date: "Q4 2024",
      },
      {
        title: "Dashboard v1",
        description: "Web interface for viewing forecasts",
        date: "Q1 2025",
      },
      {
        title: "4 Forecast Horizons",
        description: "24H, 30D, 12W, and 12M predictions",
        date: "Q1 2025",
      },
      {
        title: "Alerts System",
        description: "Custom alerts with email notifications",
        date: "Q1 2025",
      },
      {
        title: "Pro & Premium Plans",
        description: "Subscription tiers with 7-day free trial",
        date: "Q1 2025",
      },
    ],
  },
  {
    status: "in-progress",
    label: "In Progress",
    items: [
      {
        title: "Confidence Bands",
        description: "50/75/95% prediction intervals",
        date: "Now",
      },
      {
        title: "REST API",
        description: "Full API access for Premium users",
        date: "Now",
      },
      {
        title: "Webhook Alerts",
        description: "Real-time notifications via webhooks",
        date: "Now",
      },
    ],
  },
  {
    status: "planned",
    label: "Planned",
    items: [
      {
        title: "Team Features",
        description: "Shared dashboards, roles, audit logs",
        date: "Q2 2025",
      },
      {
        title: "Mobile App",
        description: "iOS and Android apps",
        date: "Q2 2025",
      },
      {
        title: "Extended Market Coverage",
        description: "100+ markets including more asset classes",
        date: "Q3 2025",
      },
      {
        title: "Custom Alerts Builder",
        description: "Visual alert configuration UI",
        date: "Q3 2025",
      },
      {
        title: "Backtesting Playground",
        description: "Test strategies against historical forecasts",
        date: "Q3 2025",
      },
    ],
  },
];

const RoadmapTimeline = () => {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-[var(--brand)]",
          text: "text-black",
          border: "border-[var(--brand)]/30",
          cardBg: "bg-[var(--brand)]/5",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "in-progress":
        return {
          bg: "bg-amber-500",
          text: "text-black",
          border: "border-amber-300 dark:border-amber-700",
          cardBg: "bg-amber-50 dark:bg-amber-900/20",
          icon: (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        };
      case "planned":
        return {
          bg: "bg-neutral-300 dark:bg-neutral-700",
          text: "text-neutral-700 dark:text-neutral-300",
          border: "border-neutral-200 dark:border-neutral-800",
          cardBg: "bg-white dark:bg-neutral-900",
          icon: (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-neutral-300",
          text: "text-neutral-700",
          border: "border-neutral-200",
          cardBg: "bg-white",
          icon: null,
        };
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-20 dark:bg-black"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="space-y-12">
          {ROADMAP_ITEMS.map((section, sectionIndex) => {
            const styles = getStatusStyles(section.status);

            return (
              <div
                key={section.status}
                className={`transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${sectionIndex * 150}ms` }}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.bg} ${styles.text}`}
                  >
                    {styles.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {section.label}
                  </h2>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {section.items.length} items
                  </span>
                </div>

                {/* Items grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.title}
                      className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-md ${styles.border} ${styles.cardBg}`}
                      style={{
                        transitionDelay: `${
                          sectionIndex * 150 + itemIndex * 50
                        }ms`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                            {item.description}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                            section.status === "completed"
                              ? "bg-[var(--brand)]/20 text-[var(--brand)]"
                              : section.status === "in-progress"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                              : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                          }`}
                        >
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div
          className={`mt-12 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Roadmap is subject to change based on user feedback and priorities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoadmapTimeline;
