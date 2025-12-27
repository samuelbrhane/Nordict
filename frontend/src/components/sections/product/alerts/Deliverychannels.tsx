"use client";

import { useState, useEffect, useRef } from "react";

const CHANNELS = [
  {
    id: "email",
    name: "Email",
    description: "Rich HTML emails with full alert context and quick actions.",
    status: "available",
    features: ["Formatted summaries", "One-click actions", "Digest options"],
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
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "JSON payloads to your endpoint for custom integrations.",
    status: "available",
    features: ["Full data payload", "Retry logic", "Signature verification"],
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
          d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        />
      </svg>
    ),
  },
  {
    id: "push",
    name: "Push Notifications",
    description: "Real-time mobile and desktop push via our apps.",
    status: "available",
    features: ["Instant delivery", "Rich notifications", "Quick actions"],
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
          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
        />
      </svg>
    ),
  },
  {
    id: "slack",
    name: "Slack",
    description: "Direct messages or channel posts with interactive buttons.",
    status: "coming",
    features: ["Channel integration", "Thread replies", "Bot commands"],
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
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
    ),
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Bot messages with inline keyboard actions.",
    status: "coming",
    features: ["Bot integration", "Group support", "Inline buttons"],
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
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    ),
  },
  {
    id: "sms",
    name: "SMS",
    description: "Text messages for critical alerts when you're offline.",
    status: "coming",
    features: ["Critical only", "Global coverage", "Reply actions"],
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
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
];

const DeliveryChannels = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(
    "email"
  );
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null);
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

  const activeChannel = CHANNELS.find((c) => c.id === selectedChannel);

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

      <div className="relative z-10 mx-auto max-w-7xl px-6">
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
              Delivery channels
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
            Get alerts{" "}
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
              where you are
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
            Choose how you want to receive alerts. Use multiple channels for
            different alert priorities.
          </p>
        </div>

        {/* Channels grid */}
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {CHANNELS.map((channel, i) => (
            <button
              key={channel.id}
              onClick={() =>
                setSelectedChannel(
                  selectedChannel === channel.id ? null : channel.id
                )
              }
              disabled={channel.status === "coming"}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                channel.status === "coming"
                  ? "border-neutral-200 bg-neutral-100 opacity-70 cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900"
                  : selectedChannel === channel.id
                  ? "border-[var(--brand)]/50 bg-white shadow-lg ring-1 ring-[var(--brand)]/20 dark:bg-black"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
              onMouseEnter={() => setHoveredChannel(i)}
              onMouseLeave={() => setHoveredChannel(null)}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                    channel.status === "coming"
                      ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500"
                      : selectedChannel === channel.id || hoveredChannel === i
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {channel.icon}
                </div>

                {/* Status badge */}
                {channel.status === "coming" ? (
                  <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                    Coming soon
                  </span>
                ) : (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Available
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                {channel.name}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {channel.description}
              </p>

              {/* Hover accent */}
              {channel.status !== "coming" && (
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                    selectedChannel === channel.id || hoveredChannel === i
                      ? "w-full"
                      : "w-0"
                  }`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Selected channel details */}
        {activeChannel && activeChannel.status !== "coming" && (
          <div
            className={`mt-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-800 dark:bg-black sm:p-8`}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: Features */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <div style={{ color: "var(--brand)" }}>
                      {activeChannel.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {activeChannel.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Channel features
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {activeChannel.features.map((feature, i) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                      >
                        <svg
                          className="h-3.5 w-3.5"
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
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Preview mock */}
              <div className="flex items-center justify-center">
                {activeChannel.id === "email" && (
                  <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          N
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 dark:text-white">
                            Nordict Alerts
                          </p>
                          <p className="text-xs text-neutral-500">
                            alerts@nordict.com
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        🎯 BTC Threshold Alert Triggered
                      </p>
                      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                        Your alert condition was met: Forecast exceeded +3%
                      </p>
                      <div className="mt-3 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-700">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Forecast</span>
                          <span
                            className="font-medium"
                            style={{ color: "var(--brand)" }}
                          >
                            +3.4%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-neutral-500">Confidence</span>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            72%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeChannel.id === "webhook" && (
                  <div className="w-full rounded-xl border border-neutral-200 bg-neutral-900 p-4 shadow-lg dark:border-neutral-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">
                        POST
                      </span>
                      <span className="font-mono text-xs text-neutral-400">
                        your-endpoint.com/webhook
                      </span>
                    </div>
                    <pre className="text-xs text-neutral-300 overflow-x-auto">
                      {`{
  "type": "threshold",
  "asset": "BTC",
  "forecast": 3.4,
  "confidence": 72,
  "triggered_at": "2024-12-15T10:00:03Z"
}`}
                    </pre>
                  </div>
                )}

                {activeChannel.id === "push" && (
                  <div className="relative">
                    <div className="w-64 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-black shrink-0"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          N
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 dark:text-white">
                            Nordict
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                            BTC forecast exceeded +3%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                          Dismiss
                        </button>
                        <button
                          className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Multi-channel tip */}
        <div
          className={`mt-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Pro tip: Use multiple channels strategically
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                Route high-priority alerts to push notifications for immediate
                attention. Use email for detailed digests. Send webhooks to your
                trading systems for automated logging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryChannels;
