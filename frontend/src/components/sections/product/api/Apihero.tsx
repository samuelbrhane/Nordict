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
            API & Integrations
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
              className={`mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
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
              className={`mt-8 grid gap-4 sm:grid-cols-2 transition-all duration-700 ease-out ${
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
                  className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
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
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
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
                  Request API access
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
                href="#endpoints"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  View endpoints
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

          {/* Right: Code example */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-2xl border border-neutral-200 bg-neutral-900 shadow-2xl overflow-hidden dark:border-neutral-700">
              {/* Tab bar */}
              <div className="flex items-center gap-1 border-b border-neutral-700 bg-neutral-800 px-4 py-2">
                {(["python", "javascript", "curl"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-neutral-700 text-white"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {tab === "python" && "Python"}
                    {tab === "javascript" && "JavaScript"}
                    {tab === "curl" && "cURL"}
                  </button>
                ))}

                {/* Window controls */}
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Code content */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code className="text-neutral-300">
                    {codeExamples[activeTab].split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 shrink-0 text-neutral-600 select-none">
                          {i + 1}
                        </span>
                        <span>
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
              <div className="border-t border-neutral-700 bg-neutral-800 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-xs font-medium text-neutral-400">
                    Response
                  </span>
                </div>
                <pre className="text-xs text-neutral-400">
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
              className="absolute -bottom-8 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIHero;
