"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AlertsHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNotification, setActiveNotification] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cycle through notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      type: "Threshold",
      title: "BTC crossed $45,000",
      subtitle: "Price alert triggered",
      time: "Just now",
    },
    {
      type: "Confidence",
      title: "ETH confidence jumped to 78%",
      subtitle: "High conviction signal",
      time: "2 min ago",
    },
    {
      type: "Direction",
      title: "SOL forecast flipped bearish",
      subtitle: "Direction change detected",
      time: "5 min ago",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-20 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-10 dark:opacity-20" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Breadcrumb */}
        <div
          className={`mb-6 flex items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <Link
            href="/"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <Link
            href="/product"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Product
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Alerts & Signals
          </span>
        </div>

        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Deep Dive
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <div>
            {/* Headline */}
            <h1
              className={`text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Turn forecasts into{" "}
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
                actionable alerts
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Don't stare at dashboards. Set up alerts for the conditions that
              matter to you and get notified when forecasts suggest it's time to{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                pay attention
              </span>
              —not necessarily time to trade.
            </p>

            {/* Key points */}
            <div
              className={`mt-8 space-y-3 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                "Threshold alerts for price levels and forecast values",
                "Confidence shift notifications when conviction changes",
                "Direction flip alerts when forecasts reverse",
                "Deliver via email, webhook, or push notification",
              ].map((point, i) => (
                <div key={point} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <svg
                      className="h-3 w-3"
                      style={{ color: "var(--brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Important note */}
            <div
              className={`mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
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
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">
                    Decision support, not trading signals.
                  </span>{" "}
                  Alerts help you stay informed—they're not recommendations to
                  buy or sell.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request access
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
                href="#alert-types"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  Explore alerts
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Visual - Phone mockup with notifications */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative mx-auto max-w-[280px]">
              {/* Phone frame */}
              <div className="relative rounded-[3rem] border-4 border-neutral-800 bg-neutral-900 p-2 shadow-2xl dark:border-neutral-700">
                {/* Screen */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-950">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3">
                    <span className="text-xs font-medium text-white">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z" />
                      </svg>
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Notification area */}
                  <div className="px-4 pb-8 pt-4 min-h-[400px]">
                    {/* Header */}
                    <div className="mb-6 text-center">
                      <div
                        className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        <svg
                          className="h-6 w-6 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Nordict Alerts
                      </h3>
                      <p className="text-xs text-neutral-400">
                        3 new notifications
                      </p>
                    </div>

                    {/* Notifications stack */}
                    <div className="space-y-3">
                      {notifications.map((notif, i) => (
                        <div
                          key={notif.title}
                          className={`rounded-2xl border p-4 transition-all duration-500 ${
                            activeNotification === i
                              ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 scale-[1.02] shadow-lg"
                              : "border-neutral-700 bg-neutral-800/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  activeNotification === i
                                    ? "animate-pulse"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor:
                                    activeNotification === i
                                      ? "var(--brand)"
                                      : "#6b7280",
                                }}
                              />
                              <span
                                className={`text-xs font-medium ${
                                  activeNotification === i
                                    ? "text-[var(--brand)]"
                                    : "text-neutral-400"
                                }`}
                              >
                                {notif.type}
                              </span>
                            </div>
                            <span className="text-xs text-neutral-500">
                              {notif.time}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-medium text-white">
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {notif.subtitle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-800" />
              </div>

              {/* Decorative glow */}
              <div
                className="absolute -bottom-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl opacity-40"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertsHero;
