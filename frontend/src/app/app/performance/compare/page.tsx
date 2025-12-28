"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

const MODEL_VERSIONS = [
  {
    id: "v0.3",
    label: "v0.3 (Current)",
    date: "Dec 2024",
    status: "production",
  },
  { id: "v0.2", label: "v0.2", date: "Oct 2024", status: "deprecated" },
  { id: "v0.1", label: "v0.1", date: "Aug 2024", status: "deprecated" },
];

// Mock comparison data
const COMPARISON_DATA: Record<
  string,
  Record<
    string,
    {
      mae: string;
      rmse: string;
      directional: string;
      calibration: string;
      sharpe: string;
    }
  >
> = {
  "v0.3": {
    overall: {
      mae: "2.34%",
      rmse: "3.21%",
      directional: "72.4%",
      calibration: "0.89",
      sharpe: "1.45",
    },
    "BTC-USD": {
      mae: "2.12%",
      rmse: "2.98%",
      directional: "74.2%",
      calibration: "0.91",
      sharpe: "1.58",
    },
    "ETH-USD": {
      mae: "2.45%",
      rmse: "3.32%",
      directional: "71.8%",
      calibration: "0.88",
      sharpe: "1.42",
    },
  },
  "v0.2": {
    overall: {
      mae: "2.68%",
      rmse: "3.54%",
      directional: "69.2%",
      calibration: "0.85",
      sharpe: "1.28",
    },
    "BTC-USD": {
      mae: "2.48%",
      rmse: "3.28%",
      directional: "70.5%",
      calibration: "0.86",
      sharpe: "1.35",
    },
    "ETH-USD": {
      mae: "2.82%",
      rmse: "3.68%",
      directional: "68.1%",
      calibration: "0.84",
      sharpe: "1.22",
    },
  },
  "v0.1": {
    overall: {
      mae: "3.12%",
      rmse: "4.05%",
      directional: "65.8%",
      calibration: "0.81",
      sharpe: "1.05",
    },
    "BTC-USD": {
      mae: "2.95%",
      rmse: "3.82%",
      directional: "67.2%",
      calibration: "0.82",
      sharpe: "1.12",
    },
    "ETH-USD": {
      mae: "3.28%",
      rmse: "4.21%",
      directional: "64.5%",
      calibration: "0.80",
      sharpe: "0.98",
    },
  },
};

// Mock period-by-period comparison
const PERIOD_COMPARISON = [
  {
    period: "Dec W4",
    v03Wins: true,
    v03Directional: "75.0%",
    v02Directional: "68.2%",
  },
  {
    period: "Dec W3",
    v03Wins: true,
    v03Directional: "73.5%",
    v02Directional: "70.1%",
  },
  {
    period: "Dec W2",
    v03Wins: false,
    v03Directional: "69.8%",
    v02Directional: "71.4%",
  },
  {
    period: "Dec W1",
    v03Wins: true,
    v03Directional: "74.2%",
    v02Directional: "69.8%",
  },
  {
    period: "Nov W4",
    v03Wins: true,
    v03Directional: "72.1%",
    v02Directional: "67.5%",
  },
  {
    period: "Nov W3",
    v03Wins: true,
    v03Directional: "71.8%",
    v02Directional: "68.9%",
  },
];

const PerformanceComparePage = () => {
  const [versionA, setVersionA] = useState(MODEL_VERSIONS[0]);
  const [versionB, setVersionB] = useState(MODEL_VERSIONS[1]);
  const [isDropdownAOpen, setIsDropdownAOpen] = useState(false);
  const [isDropdownBOpen, setIsDropdownBOpen] = useState(false);

  const dataA = COMPARISON_DATA[versionA.id]?.overall;
  const dataB = COMPARISON_DATA[versionB.id]?.overall;

  const calculateDiff = (
    a: string,
    b: string,
    lowerIsBetter: boolean = false
  ) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const diff = numA - numB;
    const isImprovement = lowerIsBetter ? diff < 0 : diff > 0;
    const diffStr = diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
    return { diff: diffStr, isImprovement };
  };

  return (
    <AppLayout
      title="Model Comparison"
      subtitle="Compare performance across model versions"
    >
      <div className="space-y-6">
        {/* Version Selectors */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Version A */}
          <div className="relative">
            <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Version A
            </label>
            <button
              onClick={() => {
                setIsDropdownAOpen(!isDropdownAOpen);
                setIsDropdownBOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="font-medium text-neutral-900 dark:text-white">
                {versionA.label}
              </span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  isDropdownAOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownAOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="p-2">
                  {MODEL_VERSIONS.filter((v) => v.id !== versionB.id).map(
                    (version) => (
                      <button
                        key={version.id}
                        onClick={() => {
                          setVersionA(version);
                          setIsDropdownAOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          versionA.id === version.id
                            ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <span>{version.label}</span>
                        {version.status === "production" && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="mt-6 text-neutral-400">vs</span>

          {/* Version B */}
          <div className="relative">
            <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Version B
            </label>
            <button
              onClick={() => {
                setIsDropdownBOpen(!isDropdownBOpen);
                setIsDropdownAOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
            >
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              <span className="font-medium text-neutral-900 dark:text-white">
                {versionB.label}
              </span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  isDropdownBOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownBOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                <div className="p-2">
                  {MODEL_VERSIONS.filter((v) => v.id !== versionA.id).map(
                    (version) => (
                      <button
                        key={version.id}
                        onClick={() => {
                          setVersionB(version);
                          setIsDropdownBOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          versionB.id === version.id
                            ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        }`}
                      >
                        <span>{version.label}</span>
                        {version.status === "production" && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Active
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metric Delta Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Metric Comparison
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Overall performance differences
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Metric
                  </th>
                  <th className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center justify-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      {versionA.id}
                    </span>
                  </th>
                  <th className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-neutral-400" />
                      {versionB.id}
                    </span>
                  </th>
                  <th className="pb-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Difference
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  {
                    label: "MAE",
                    keyA: dataA?.mae,
                    keyB: dataB?.mae,
                    lowerIsBetter: true,
                  },
                  {
                    label: "RMSE",
                    keyA: dataA?.rmse,
                    keyB: dataB?.rmse,
                    lowerIsBetter: true,
                  },
                  {
                    label: "Directional Accuracy",
                    keyA: dataA?.directional,
                    keyB: dataB?.directional,
                    lowerIsBetter: false,
                  },
                  {
                    label: "Calibration Score",
                    keyA: dataA?.calibration,
                    keyB: dataB?.calibration,
                    lowerIsBetter: false,
                  },
                  {
                    label: "Sharpe Ratio",
                    keyA: dataA?.sharpe,
                    keyB: dataB?.sharpe,
                    lowerIsBetter: false,
                  },
                ].map((row) => {
                  const { diff, isImprovement } = calculateDiff(
                    row.keyA || "0",
                    row.keyB || "0",
                    row.lowerIsBetter
                  );
                  return (
                    <tr key={row.label}>
                      <td className="py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        {row.label}
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {row.keyA}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {row.keyB}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-medium ${
                            isImprovement
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isImprovement ? (
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
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                          ) : (
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
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          )}
                          {diff}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Win/Loss by Period */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Win/Loss by Period
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Which version performed better each week
            </p>

            <div className="mt-6 space-y-2">
              {PERIOD_COMPARISON.map((period) => (
                <div
                  key={period.period}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {period.period}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      <span
                        className={`text-sm ${
                          period.v03Wins
                            ? "font-semibold text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {period.v03Directional}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-neutral-400" />
                      <span
                        className={`text-sm ${
                          !period.v03Wins
                            ? "font-semibold text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {period.v02Directional}
                      </span>
                    </div>
                    {period.v03Wins ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        A
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                        B
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[rgba(4,236,58,0.1)] p-3">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {versionA.id} win rate
              </span>
              <span className="font-semibold" style={{ color: "var(--brand)" }}>
                {Math.round(
                  (PERIOD_COMPARISON.filter((p) => p.v03Wins).length /
                    PERIOD_COMPARISON.length) *
                    100
                )}
                %
              </span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Version Recommendation
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Why the current production version is chosen
            </p>

            <div className="mt-6 rounded-xl border-2 border-[var(--brand)] bg-[rgba(4,236,58,0.05)] p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
                >
                  <svg
                    className="h-5 w-5"
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
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    v0.3 is the active production model
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-start gap-2">
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
                      3.2% improvement in directional accuracy
                    </li>
                    <li className="flex items-start gap-2">
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
                      Lower MAE across all market conditions
                    </li>
                    <li className="flex items-start gap-2">
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
                      Better calibration score (0.89 vs 0.85)
                    </li>
                    <li className="flex items-start gap-2">
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
                      Wins 83% of weekly comparison periods
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href="/app/models"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
                View model registry
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
        </div>
      </div>
    </AppLayout>
  );
};

export default PerformanceComparePage;
