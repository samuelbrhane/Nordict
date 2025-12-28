"use client";

import { AppLayout } from "@/components/app";

const DashboardPage = () => {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="System overview and latest forecasts"
    >
      {/* Placeholder content */}
      <div className="grid gap-6">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Markets Tracked", value: "24", change: "+2" },
            { label: "Active Alerts", value: "8", change: "+1" },
            { label: "Avg Confidence", value: "72%", change: "+3%" },
            { label: "Last Update", value: "2m ago", change: null },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {stat.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.change && (
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--brand)" }}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top signals */}
          <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Top Forecast Signals
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Markets with strongest predicted movement
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  symbol: "BTC-USD",
                  direction: "up",
                  confidence: 78,
                  change: "+4.2%",
                },
                {
                  symbol: "ETH-USD",
                  direction: "up",
                  confidence: 72,
                  change: "+3.1%",
                },
                {
                  symbol: "SOL-USD",
                  direction: "down",
                  confidence: 68,
                  change: "-2.8%",
                },
                {
                  symbol: "AVAX-USD",
                  direction: "up",
                  confidence: 65,
                  change: "+1.9%",
                },
              ].map((signal) => (
                <div
                  key={signal.symbol}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        signal.direction === "up"
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      <svg
                        className={`h-5 w-5 ${
                          signal.direction === "up"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "rotate-180 text-red-600 dark:text-red-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {signal.symbol}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        7-day horizon
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        signal.direction === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {signal.change}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {signal.confidence}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline status */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              System Status
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Data pipeline health
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: "Data Ingestion", status: "healthy" },
                { label: "Model Inference", status: "healthy" },
                { label: "Alert Processing", status: "healthy" },
                { label: "API Services", status: "healthy" },
              ].map((service) => (
                <div
                  key={service.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">
                    {service.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--brand)" }}
                    />
                    <span className="text-sm capitalize text-neutral-500 dark:text-neutral-400">
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Next scheduled run
              </p>
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">
                12:00 UTC (in 45 min)
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
