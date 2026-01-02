"use client";

import { useState, useEffect, useRef } from "react";

const ALERT_TYPES = [
  {
    id: "threshold",
    title: "Threshold alerts",
    desc: "Get notified when forecasts cross price levels you define.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    example: {
      title: "BTC above $95,000",
      body: "24h forecast crossed your upper threshold",
      time: "2 min ago",
    },
  },
  {
    id: "confidence",
    title: "Confidence shifts",
    desc: "Alert when model confidence changes significantly—up or down.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    example: {
      title: "ETH confidence dropped",
      body: "Model confidence fell from 78% to 52%",
      time: "15 min ago",
    },
  },
  {
    id: "regime",
    title: "Regime changes",
    desc: "Know when market conditions shift between trending and ranging.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    example: {
      title: "S&P 500 regime shift",
      body: "Detected transition from ranging to trending",
      time: "1 hour ago",
    },
  },
  {
    id: "direction",
    title: "Direction flips",
    desc: "Alert when the forecast direction changes from bullish to bearish or vice versa.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    ),
    example: {
      title: "NASDAQ flipped bearish",
      body: "Daily forecast changed from +1.2% to -0.8%",
      time: "3 hours ago",
    },
  },
];

const DELIVERY_CHANNELS = [
  { name: "Email", icon: "✉️", available: true },
  { name: "Webhook", icon: "🔗", available: false, coming: true },
  { name: "SMS", icon: "📱", available: false, coming: true },
  { name: "Slack", icon: "💬", available: false, coming: true },
];

const AlertsSignals = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string>("threshold");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
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

  // Trigger notification animation when visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowNotification(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Cycle through alerts
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveAlert((prev) => {
        const currentIndex = ALERT_TYPES.findIndex((a) => a.id === prev);
        const nextIndex = (currentIndex + 1) % ALERT_TYPES.length;
        return ALERT_TYPES[nextIndex].id;
      });
      // Reset and show notification
      setShowNotification(false);
      setTimeout(() => setShowNotification(true), 100);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const currentAlert = ALERT_TYPES.find((a) => a.id === activeAlert);

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

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div
            className={`flex items-center gap-2 transition-all duration-700 ease-out ${
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
              Alerts & signals
            </p>
          </div>

          <h2
            className={`mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
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
              actionable signals
            </span>
            .
          </h2>

          <p
            className={`mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Set up alerts for the conditions that matter to you. Get notified
            when forecasts hit thresholds, confidence shifts, or market regimes
            change.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Alert types */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {ALERT_TYPES.map((alert, i) => (
                <button
                  key={alert.id}
                  onClick={() => {
                    setActiveAlert(alert.id);
                    setShowNotification(false);
                    setTimeout(() => setShowNotification(true), 100);
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                    activeAlert === alert.id
                      ? "border-[var(--brand)]/50 bg-white shadow-md dark:bg-black"
                      : "border-neutral-200 bg-white/60 hover:bg-white hover:shadow-sm dark:border-neutral-800 dark:bg-black/40 dark:hover:bg-black/60"
                  }`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon */}
                  <div
                    className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 ${
                      activeAlert === alert.id
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {alert.icon}
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {alert.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {alert.desc}
                  </p>

                  {/* Active indicator */}
                  {activeAlert === alert.id && (
                    <div
                      className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                  )}

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredCard === i && activeAlert !== alert.id
                        ? "w-full"
                        : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </button>
              ))}
            </div>

            {/* Delivery channels */}
            <div
              className={`mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Delivery channels
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DELIVERY_CHANNELS.map((channel) => (
                  <div
                    key={channel.name}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      channel.available
                        ? "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        : "border-neutral-100 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500"
                    }`}
                  >
                    <span>{channel.icon}</span>
                    <span>{channel.name}</span>
                    {channel.coming && (
                      <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                        soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Notification preview */}
          <div
            className={`flex items-center justify-center transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative w-full max-w-md">
              {/* Phone mockup */}
              <div className="relative mx-auto aspect-[9/16] w-64 overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-900 shadow-2xl dark:border-neutral-700">
                {/* Screen content */}
                <div className="h-full w-full bg-gradient-to-b from-neutral-800 to-neutral-900 p-4">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z" />
                      </svg>
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 4h-3V2h-4v2H7v18h10V4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Notification */}
                  <div
                    className={`mt-8 transform transition-all duration-500 ${
                      showNotification
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl">
                      {/* Notification header */}
                      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          N
                        </div>
                        <span className="text-xs font-medium text-white/80">
                          Nordict
                        </span>
                        <span className="ml-auto text-[10px] text-white/50">
                          {currentAlert?.example.time}
                        </span>
                      </div>

                      {/* Notification body */}
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                          {currentAlert?.example.title}
                        </p>
                        <p className="mt-1 text-xs text-white/70">
                          {currentAlert?.example.body}
                        </p>
                      </div>

                      {/* Quick actions */}
                      <div className="flex border-t border-white/10">
                        <button className="flex-1 py-2 text-xs font-medium text-[var(--brand)] transition-colors hover:bg-white/5">
                          View
                        </button>
                        <div className="w-px bg-white/10" />
                        <button className="flex-1 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Background app icons (decorative) */}
                  <div className="absolute bottom-6 inset-x-4 grid grid-cols-4 gap-4 opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-white/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
              </div>

              {/* Decorative glow */}
              <div
                className="absolute -bottom-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertsSignals;
