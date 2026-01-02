"use client";

import { useState, useEffect, useRef } from "react";

const UPDATE_SCHEDULES = [
  {
    horizon: "24 Hours",
    range: "24H",
    frequency: "Every 6 hours",
    description:
      "Refreshed four times daily to capture short-term market movements.",
    dataLag: "< 5 min",
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
    horizon: "30 Days",
    range: "30D",
    frequency: "Daily",
    description:
      "Updated once per day to balance responsiveness with stability.",
    dataLag: "< 1 hour",
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
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    horizon: "12 Weeks",
    range: "12W",
    frequency: "Daily",
    description:
      "Updated once per day. Longer horizons benefit from stable daily updates.",
    dataLag: "< 1 hour",
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    horizon: "12 Months",
    range: "12M",
    frequency: "Daily",
    description:
      "Updated once per day for long-term strategic forecasts with maximum stability.",
    dataLag: "< 1 hour",
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
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
  },
];

const DATA_SOURCES = [
  {
    name: "Price Data",
    freshness: "Real-time",
    sources: "Major exchanges",
    status: "live",
  },
  {
    name: "Volume Data",
    freshness: "Real-time",
    sources: "Aggregated feeds",
    status: "live",
  },
  {
    name: "Order Book",
    freshness: "Near real-time",
    sources: "Top 5 exchanges",
    status: "live",
  },
  {
    name: "On-chain (Crypto)",
    freshness: "~10 min lag",
    sources: "Node providers",
    status: "delayed",
  },
];

const UpdateFrequency = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSchedule, setHoveredSchedule] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
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

  // Update time every second for the live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
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
              Update frequency & data freshness
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
            Fresh data,{" "}
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
              appropriate cadence
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
            Different horizons need different update frequencies. More frequent
            isn't always better. It's about matching cadence to decision
            timescale.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left: Update schedules */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Forecast Update Schedule
                </h3>
                {/* Live clock */}
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}{" "}
                    UTC
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {UPDATE_SCHEDULES.map((schedule, i) => (
                  <div
                    key={schedule.horizon}
                    className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-default ${
                      hoveredSchedule === i
                        ? "border-[var(--brand)]/50 bg-[var(--brand)]/5 shadow-md"
                        : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
                    }`}
                    onMouseEnter={() => setHoveredSchedule(i)}
                    onMouseLeave={() => setHoveredSchedule(null)}
                  >
                    {/* Top row: Icon + Title + Frequency */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                          hoveredSchedule === i
                            ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {schedule.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {schedule.horizon}
                          </h4>
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                            style={{ backgroundColor: "var(--brand)" }}
                          >
                            {schedule.frequency}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                          {schedule.description}
                        </p>
                      </div>
                    </div>

                    {/* Data lag - separate row on mobile */}
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Data lag
                      </span>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {schedule.dataLag}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                        <span>Last update</span>
                        <span>Next update</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            backgroundColor: "var(--brand)",
                            width: `${((i + 1) * 20) % 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hover accent */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                        hoveredSchedule === i ? "w-full" : "w-0"
                      }`}
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Data freshness */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-black sm:p-8">
              <h3 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-white">
                Data Source Freshness
              </h3>

              <div className="space-y-3">
                {DATA_SOURCES.map((source, i) => (
                  <div
                    key={source.name}
                    className={`flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900 transition-all duration-300 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${500 + i * 80}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          source.status === "live" ? "animate-pulse" : ""
                        }`}
                        style={{
                          backgroundColor:
                            source.status === "live"
                              ? "var(--brand)"
                              : "#f59e0b",
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {source.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {source.sources}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            source.status === "live"
                              ? "var(--brand)"
                              : "#f59e0b",
                        }}
                      >
                        {source.freshness}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info box */}
              <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: "var(--brand)" }}
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      Why some data is delayed
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      On-chain data requires block confirmations for accuracy.
                      We prioritize correctness over speed for data that
                      influences longer-horizon forecasts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom cards */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  99.7%
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Data pipeline uptime
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  {"<"}30s
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Avg. processing time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateFrequency;
