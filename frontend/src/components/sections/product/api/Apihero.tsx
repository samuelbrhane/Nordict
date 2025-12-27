"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const APIHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"python" | "javascript" | "curl">(
    "python"
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const codeExamples = {
    python: `import nordict

client = nordict.Client(api_key="your_key")

# Get latest forecast
forecast = client.forecasts.get(
    asset="BTC",
    horizon="24h"
)

print(f"Direction: {forecast.direction}")
print(f"Confidence: {forecast.confidence}%")`,
    javascript: `import Nordict from 'nordict';

const client = new Nordict({ apiKey: 'your_key' });

// Get latest forecast
const forecast = await client.forecasts.get({
  asset: 'BTC',
  horizon: '24h'
});

console.log(\`Direction: \${forecast.direction}\`);
console.log(\`Confidence: \${forecast.confidence}%\`);`,
    curl: `curl -X GET "https://api.nordict.com/v1/forecasts" \\
  -H "Authorization: Bearer your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset": "BTC",
    "horizon": "24h"
  }'`,
  };

  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-8 sm:pb-20 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 sm:h-[500px] sm:w-[500px] ${
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <div
          className={`mb-4 flex items-center gap-2 overflow-x-auto sm:mb-6 sm:gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <Link
            href="/"
            className="shrink-0 text-xs text-neutral-500 transition-colors hover:text-neutral-900 sm:text-sm dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <Link
            href="/product"
            className="shrink-0 text-xs text-neutral-500 transition-colors hover:text-neutral-900 sm:text-sm dark:text-neutral-400 dark:hover:text-white"
          >
            Product
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="shrink-0 text-xs text-neutral-700 sm:text-sm dark:text-neutral-300">
            API & Integrations
          </span>
        </div>

        {/* Badge */}
        <div
          className={`mb-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 backdrop-blur sm:mb-6 sm:gap-2 sm:px-4 sm:py-1.5 dark:border-neutral-800 dark:bg-neutral-900/60 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse sm:h-2 sm:w-2"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <span className="text-[10px] font-medium text-neutral-700 sm:text-xs dark:text-neutral-300">
            Deep Dive
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Left: Content */}
          <div>
            {/* Headline */}
            <h1
              className={`text-2xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Build with{" "}
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
                forecast data
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-4 text-sm leading-relaxed text-neutral-600 sm:mt-6 sm:text-base lg:text-lg dark:text-neutral-300 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Integrate Nordict forecasts directly into your trading systems,
              dashboards, and workflows. RESTful API with SDKs for Python and
              JavaScript.
            </p>

            {/* Key points */}
            <div
              className={`mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                { label: "RESTful API", desc: "Simple, predictable endpoints" },
                { label: "Webhooks", desc: "Real-time event delivery" },
                { label: "SDKs", desc: "Python & JavaScript libraries" },
                { label: "99.9% Uptime", desc: "Enterprise-grade reliability" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2 sm:gap-3 sm:rounded-xl sm:p-3 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded sm:h-5 sm:w-5 sm:rounded-md"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <svg
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3"
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
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-neutral-900 sm:text-sm dark:text-white">
                      {item.label}
                    </p>
                    <p className="hidden text-xs text-neutral-500 sm:block dark:text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-4 py-2.5 text-xs font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98] sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request API access
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 sm:w-4 sm:h-4"
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
                href="#endpoints"
                className="group inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  View endpoints
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 sm:w-4 sm:h-4"
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

          {/* Right: Code example */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-xl border border-neutral-200 bg-neutral-900 shadow-2xl overflow-hidden sm:rounded-2xl dark:border-neutral-700">
              {/* Tab bar */}
              <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-2 py-1.5 sm:px-4 sm:py-2">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {(["python", "javascript", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded px-2 py-1 text-[10px] font-medium transition-all duration-200 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs ${
                        activeTab === tab
                          ? "bg-neutral-700 text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {tab === "python" && "Python"}
                      {tab === "javascript" && "JS"}
                      {tab === "curl" && "cURL"}
                    </button>
                  ))}
                </div>

                {/* Window controls */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500 sm:h-3 sm:w-3" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
                  <div className="h-2 w-2 rounded-full bg-green-500 sm:h-3 sm:w-3" />
                </div>
              </div>

              {/* Code content */}
              <div className="max-h-48 overflow-auto p-2 sm:max-h-none sm:p-4">
                <pre className="text-[10px] leading-relaxed sm:text-sm">
                  <code className="text-neutral-300">
                    {codeExamples[activeTab].split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-5 shrink-0 text-neutral-600 select-none sm:w-8">
                          {i + 1}
                        </span>
                        <span className="break-all sm:break-normal">
                          {line.includes("import") || line.includes("from") ? (
                            <span className="text-purple-400">{line}</span>
                          ) : line.includes("=") && !line.includes("==") ? (
                            <span>
                              <span className="text-blue-400">
                                {line.split("=")[0]}
                              </span>
                              <span className="text-white">=</span>
                              <span className="text-neutral-300">
                                {line.split("=").slice(1).join("=")}
                              </span>
                            </span>
                          ) : line.includes("print") ||
                            line.includes("console.log") ? (
                            <span className="text-yellow-400">{line}</span>
                          ) : line.includes("#") || line.includes("//") ? (
                            <span className="text-neutral-500">{line}</span>
                          ) : line.includes('"') || line.includes("'") ? (
                            <span className="text-green-400">{line}</span>
                          ) : (
                            <span>{line}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Response preview */}
              <div className="border-t border-neutral-700 bg-neutral-800 px-2 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 mb-1.5 sm:gap-2 sm:mb-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-[9px] font-medium text-neutral-400 sm:text-xs">
                    Response
                  </span>
                </div>
                <pre className="text-[9px] text-neutral-400 sm:text-xs">
                  {`{
  "direction": "bullish",
  "confidence": 72,
  "forecast": "+2.4%"
}`}
                </pre>
              </div>
            </div>

            {/* Decorative glow */}
            <div
              className="absolute -bottom-8 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full blur-3xl opacity-30 sm:h-32 sm:w-64"
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIHero;
