"use client";

import { useState, useEffect, useRef } from "react";

const CODE_EXAMPLES = [
  {
    id: "forecast",
    label: "Get Forecast",
    language: "bash",
    code: `curl -X GET "https://api.nordict.com/v1/forecast" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset": "BTC",
    "horizon": "24h",
    "include_confidence": true
  }'`,
  },
  {
    id: "response",
    label: "Response",
    language: "json",
    code: `{
  "asset": "BTC",
  "horizon": "24h",
  "timestamp": "2024-12-15T10:00:00Z",
  "forecast": {
    "direction": "bullish",
    "expected_change": "+2.4%",
    "confidence": 0.72
  },
  "bands": {
    "p50": { "low": "+1.1%", "high": "+3.8%" },
    "p75": { "low": "-0.5%", "high": "+5.2%" },
    "p95": { "low": "-3.2%", "high": "+8.1%" }
  },
  "model_version": "v2.4.1"
}`,
  },
  {
    id: "python",
    label: "Python",
    language: "python",
    code: `import nordict

client = nordict.Client(api_key="YOUR_API_KEY")

# Get forecast with confidence bands
forecast = client.forecast.get(
    asset="BTC",
    horizon="24h",
    include_confidence=True
)

print(f"Direction: {forecast.direction}")
print(f"Confidence: {forecast.confidence:.0%}")
print(f"Expected: {forecast.expected_change}")`,
  },
];

const API_FEATURES = [
  {
    title: "RESTful endpoints",
    desc: "Clean, predictable API design following REST conventions.",
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
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    title: "Forecast history",
    desc: "Access historical forecasts and their actual outcomes.",
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Model metadata",
    desc: "Query model versions, training dates, and performance metrics.",
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Webhook support",
    desc: "Push alerts to your systems in real-time.",
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
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
];

const APIIntegrations = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("forecast");
  const [copied, setCopied] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
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

  const activeCode = CODE_EXAMPLES.find((c) => c.id === activeTab);

  const handleCopy = () => {
    if (activeCode) {
      navigator.clipboard.writeText(activeCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple syntax highlighting
  const highlightCode = (code: string, language: string) => {
    if (language === "json") {
      return code
        .replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
        .replace(/: ([\d.]+)/g, ': <span class="text-orange-400">$1</span>')
        .replace(/: (true|false)/g, ': <span class="text-blue-400">$1</span>');
    }
    if (language === "python") {
      return code
        .replace(
          /(import|from|as|print|def|return|if|else|for|in|True|False)/g,
          '<span class="text-purple-400">$1</span>'
        )
        .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/'([^']+)'/g, "<span class=\"text-green-400\">'$1'</span>")
        .replace(/(#.+)/g, '<span class="text-neutral-500">$1</span>')
        .replace(/(\.\w+)\(/g, '<span class="text-blue-400">$1</span>(')
        .replace(/(f")/g, '<span class="text-green-400">$1</span>');
    }
    if (language === "bash") {
      return code
        .replace(/(curl|GET|POST)/g, '<span class="text-purple-400">$1</span>')
        .replace(/(-X|-H|-d)/g, '<span class="text-orange-400">$1</span>')
        .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(
          /(https?:\/\/[^\s"]+)/g,
          '<span class="text-blue-400">$1</span>'
        );
    }
    return code;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 dark:bg-black"
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
              API & integrations
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
            Build on top of{" "}
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
            Programmatic access to forecasts, historical data, and model
            metadata. Integrate Nordict into your existing workflows and
            systems.
          </p>

          {/* Coming soon badge */}
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
            </span>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              API access coming soon for Pro plans
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-5 sm:mt-12 sm:gap-8 lg:grid-cols-5">
          {/* Left: Code preview (3 cols on lg) */}
          <div
            className={`hidden lg:block lg:col-span-3  transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-2xl dark:border-neutral-800">
              {/* Tab bar */}
              <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-2">
                <div className="flex gap-1">
                  {CODE_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => setActiveTab(example.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === example.id
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {example.label}
                    </button>
                  ))}
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-[var(--brand)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[var(--brand)]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="relative">
                {/* Line numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-neutral-800 bg-neutral-950/50">
                  <div className="flex flex-col py-4 text-right">
                    {activeCode?.code.split("\n").map((_, i) => (
                      <span
                        key={i}
                        className="px-3 text-xs leading-6 text-neutral-600"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code */}
                <pre className="overflow-x-auto p-4 pl-16">
                  <code
                    className="text-sm leading-6 text-neutral-300"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(
                        activeCode?.code || "",
                        activeCode?.language || ""
                      ),
                    }}
                  />
                </pre>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs text-neutral-500">
                    {activeCode?.language}
                  </span>
                </div>
                <span className="text-xs text-neutral-600">
                  api.nordict.com
                </span>
              </div>
            </div>
          </div>

          {/* Right: Features (2 cols on lg) - stacked vertically */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {API_FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-4 dark:border-neutral-800 dark:bg-neutral-900 cursor-default ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 sm:h-10 sm:w-10 sm:rounded-xl ${
                        hoveredFeature === i
                          ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      <div className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-0.5 text-[10px] leading-snug text-neutral-600 sm:mt-1 sm:text-xs sm:leading-relaxed dark:text-neutral-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${
                      hoveredFeature === i ? "w-full" : "w-0"
                    }`}
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIIntegrations;
