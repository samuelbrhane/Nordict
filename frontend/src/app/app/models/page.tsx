"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

// Mock model versions data
const MODEL_VERSIONS = [
  {
    id: "v0.3",
    name: "v0.3",
    status: "production" as const,
    deployedAt: "Dec 1, 2024",
    trainedAt: "Nov 28, 2024",
    markets: ["BTC-USD", "ETH-USD", "SOL-USD", "AVAX-USD"],
    horizons: ["1D", "7D", "30D", "90D"],
    metrics: {
      directional: "72.4%",
      mae: "2.34%",
      calibration: "0.89",
    },
    changelog: [
      "Improved feature engineering for momentum indicators",
      "Added regime detection layer",
      "Extended 90D horizon support for major assets",
      "Better calibration through temperature scaling",
    ],
    architecture: "Transformer + LSTM ensemble",
    trainingData: "Jan 2020 – Nov 2024",
    parameters: "12.4M",
  },
  {
    id: "v0.2",
    name: "v0.2",
    status: "deprecated" as const,
    deployedAt: "Oct 15, 2024",
    trainedAt: "Oct 10, 2024",
    markets: [
      "BTC-USD",
      "ETH-USD",
      "SOL-USD",
      "AVAX-USD",
      "MATIC-USD",
      "LINK-USD",
    ],
    horizons: ["1D", "7D", "30D"],
    metrics: {
      directional: "69.2%",
      mae: "2.68%",
      calibration: "0.85",
    },
    changelog: [
      "Initial multi-horizon support",
      "Added confidence calibration",
      "Expanded to 6 crypto markets",
    ],
    architecture: "LSTM ensemble",
    trainingData: "Jan 2020 – Oct 2024",
    parameters: "8.2M",
  },
  {
    id: "v0.1",
    name: "v0.1",
    status: "deprecated" as const,
    deployedAt: "Aug 1, 2024",
    trainedAt: "Jul 25, 2024",
    markets: ["BTC-USD", "ETH-USD"],
    horizons: ["1D", "7D"],
    metrics: {
      directional: "65.8%",
      mae: "3.12%",
      calibration: "0.81",
    },
    changelog: [
      "Initial release",
      "Basic directional forecasting",
      "BTC and ETH support only",
    ],
    architecture: "LSTM",
    trainingData: "Jan 2020 – Jul 2024",
    parameters: "4.1M",
  },
];

// Mock training runs
const TRAINING_RUNS = [
  {
    id: 1,
    version: "v0.3",
    startedAt: "Nov 28, 2024 08:00",
    duration: "4h 32m",
    status: "completed",
    gpuHours: 18.2,
  },
  {
    id: 2,
    version: "v0.3-rc2",
    startedAt: "Nov 25, 2024 14:00",
    duration: "4h 15m",
    status: "completed",
    gpuHours: 17.0,
  },
  {
    id: 3,
    version: "v0.3-rc1",
    startedAt: "Nov 22, 2024 10:00",
    duration: "4h 28m",
    status: "failed",
    gpuHours: 3.2,
  },
  {
    id: 4,
    version: "v0.2",
    startedAt: "Oct 10, 2024 09:00",
    duration: "3h 45m",
    status: "completed",
    gpuHours: 15.0,
  },
];

const ModelsRegistryPage = () => {
  const [selectedVersion, setSelectedVersion] = useState(MODEL_VERSIONS[0]);

  const productionVersion = MODEL_VERSIONS.find(
    (v) => v.status === "production"
  );

  return (
    <AppLayout
      title="Model Registry"
      subtitle="Version history and deployment status"
    >
      <div className="space-y-6">
        {/* Production Status Banner */}
        {productionVersion && (
          <div
            className="rounded-2xl border-2 p-5"
            style={{
              borderColor: "var(--brand)",
              backgroundColor: "rgba(4, 236, 58, 0.05)",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
                >
                  <svg
                    className="h-6 w-6"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                      {productionVersion.name}
                    </h2>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      Production
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Deployed {productionVersion.deployedAt} ·{" "}
                    {productionVersion.markets.length} markets ·{" "}
                    {productionVersion.horizons.length} horizons
                  </p>
                </div>
              </div>
              <Link
                href={`/app/models/${productionVersion.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
              >
                View Details
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Version List */}
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              All Versions
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Click a version to see details
            </p>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {MODEL_VERSIONS.map((version) => (
              <button
                key={version.id}
                onClick={() => setSelectedVersion(version)}
                className={`flex w-full flex-col gap-4 p-5 text-left transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  selectedVersion.id === version.id
                    ? "bg-[rgba(4,236,58,0.05)]"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      version.status === "production"
                        ? "text-black"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                    style={
                      version.status === "production"
                        ? { backgroundColor: "var(--brand)" }
                        : {}
                    }
                  >
                    {version.name.replace("v", "")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {version.name}
                      </p>
                      {version.status === "production" && (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          Active
                        </span>
                      )}
                      {version.status === "deprecated" && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          Deprecated
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                      Deployed {version.deployedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {version.metrics.directional}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Directional
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {version.metrics.mae}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      MAE
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {version.markets.length}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Markets
                    </p>
                  </div>
                  <svg
                    className={`h-5 w-5 text-neutral-400 transition-transform ${
                      selectedVersion.id === version.id ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Version Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Changelog */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Changelog – {selectedVersion.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              What changed in this version
            </p>

            <ul className="mt-6 space-y-3">
              {selectedVersion.changelog.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "var(--brand)" }}
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
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href={`/app/models/${selectedVersion.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
                View full details
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Technical Specs – {selectedVersion.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Architecture and training details
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: "Architecture", value: selectedVersion.architecture },
                { label: "Parameters", value: selectedVersion.parameters },
                { label: "Training Data", value: selectedVersion.trainingData },
                { label: "Trained At", value: selectedVersion.trainedAt },
                {
                  label: "Calibration Score",
                  value: selectedVersion.metrics.calibration,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Market & Horizon Coverage */}
            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Markets Supported
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedVersion.markets.map((market) => (
                    <span
                      key={market}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Horizons Supported
                </p>
                <div className="mt-2 flex gap-1.5">
                  {selectedVersion.horizons.map((h) => (
                    <span
                      key={h}
                      className="rounded bg-[rgba(4,236,58,0.15)] px-2 py-0.5 text-xs font-medium text-[var(--brand)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Training Runs */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Recent Training Runs
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Model training history
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Version
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Started
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Duration
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    GPU Hours
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {TRAINING_RUNS.map((run) => (
                  <tr key={run.id}>
                    <td className="py-4">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {run.version}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {run.startedAt}
                    </td>
                    <td className="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {run.duration}
                    </td>
                    <td className="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {run.gpuHours}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          run.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {run.status === "completed" ? (
                          <svg
                            className="h-3 w-3"
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
                        ) : (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {run.status === "completed" ? "Completed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium text-neutral-900 dark:text-white">
                Model transparency:
              </span>{" "}
              We publish complete version history, training details, and
              performance metrics for all model versions. Deprecated versions
              remain accessible for audit and comparison purposes.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ModelsRegistryPage;
