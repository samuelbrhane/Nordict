"use client";

import { useState, useEffect, useRef } from "react";

const SDKS = [
  {
    id: "python",
    name: "Python",
    version: "1.2.0",
    install: "pip install nordict",
    status: "stable",
    features: ["Async support", "Type hints", "Pandas integration"],
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
      </svg>
    ),
    codeExample: `from nordict import Client

client = Client(api_key="your_key")

# Get forecast with type hints
forecast = client.forecasts.get(
    asset="BTC",
    horizon="24h"
)

# Convert to pandas DataFrame
df = client.forecasts.history(
    asset="BTC",
    days=30
).to_dataframe()`,
  },
  {
    id: "javascript",
    name: "JavaScript / TypeScript",
    version: "1.1.0",
    install: "npm install @nordict/sdk",
    status: "stable",
    features: ["TypeScript types", "Promise-based", "Tree-shakeable"],
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      </svg>
    ),
    codeExample: `import { Nordict } from '@nordict/sdk';

const client = new Nordict({ apiKey: 'your_key' });

// Fully typed responses
const forecast = await client.forecasts.get({
  asset: 'BTC',
  horizon: '24h'
});

// Stream real-time updates
client.forecasts.stream('BTC', (update) => {
  console.log('New forecast:', update);
});`,
  },
  {
    id: "rest",
    name: "REST API",
    version: "v1",
    install: "curl https://api.nordict.com/v1",
    status: "stable",
    features: ["Language agnostic", "HTTP standard", "OpenAPI spec"],
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    codeExample: `# Get latest forecast
curl -X GET "https://api.nordict.com/v1/forecasts/BTC" \\
  -H "Authorization: Bearer your_key" \\
  -H "Content-Type: application/json"

# Response
{
  "asset": "BTC",
  "direction": "bullish",
  "forecast": "+2.4%",
  "confidence": 72
}`,
  },
];

const COMING_SOON = [
  { name: "Go", icon: "🔵" },
  { name: "Rust", icon: "🦀" },
  { name: "Java", icon: "☕" },
];

const SDKs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSDK, setSelectedSDK] = useState("python");
  const [copiedInstall, setCopiedInstall] = useState(false);
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

  const activeSDK = SDKS.find((sdk) => sdk.id === selectedSDK);

  const handleCopyInstall = () => {
    if (activeSDK) {
      navigator.clipboard.writeText(activeSDK.install);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
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
              SDKs & Libraries
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
            Your language,{" "}
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
              our SDK
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
            Official client libraries with idiomatic APIs, full type support,
            and comprehensive documentation.
          </p>
        </div>

        {/* SDK selector */}
        <div
          className={`mt-10 flex flex-wrap gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {SDKS.map((sdk) => (
            <button
              key={sdk.id}
              onClick={() => setSelectedSDK(sdk.id)}
              className={`relative overflow-hidden rounded-xl border px-4 py-3 transition-all duration-300 ${
                selectedSDK === sdk.id
                  ? "border-[var(--brand)]/50 bg-[var(--brand)]/10 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`transition-colors duration-200 ${
                    selectedSDK === sdk.id
                      ? "text-[var(--brand)]"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {sdk.icon}
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      selectedSDK === sdk.id
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {sdk.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    v{sdk.version}
                  </p>
                </div>
              </div>

              {selectedSDK === sdk.id && (
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Selected SDK details */}
        {activeSDK && (
          <div
            className={`mt-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: Code example */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-900 overflow-hidden dark:border-neutral-700">
                {/* Install command */}
                <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-800 px-4 py-3">
                  <code className="text-sm text-neutral-300">
                    {activeSDK.install}
                  </code>
                  <button
                    onClick={handleCopyInstall}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                  >
                    {copiedInstall ? (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
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
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Code */}
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-neutral-300">
                      {activeSDK.codeExample.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="w-8 shrink-0 text-neutral-600 select-none">
                            {i + 1}
                          </span>
                          <span>
                            {line.includes("#") || line.includes("//") ? (
                              <span className="text-neutral-500">{line}</span>
                            ) : line.includes("import") ||
                              line.includes("from") ? (
                              <span className="text-purple-400">{line}</span>
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
              </div>

              {/* Right: Features & info */}
              <div className="space-y-4">
                {/* Features */}
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeSDK.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Documentation
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Status
                  </span>
                  <span
                    className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    Stable
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coming soon */}
        <div
          className={`mt-8 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                More languages coming soon
              </h4>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Request a language and we'll prioritize based on demand.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {COMING_SOON.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <span>{lang.icon}</span>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {lang.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SDKs;
