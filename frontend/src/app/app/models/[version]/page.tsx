"use client";

import { use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app";

// Mock model versions data
const MODEL_VERSIONS: Record<
  string,
  {
    id: string;
    name: string;
    status: "production" | "deprecated" | "beta";
    deployedAt: string;
    trainedAt: string;
    markets: string[];
    horizons: string[];
    metrics: {
      directional: string;
      mae: string;
      rmse: string;
      calibration: string;
      sharpe: string;
    };
    changelog: string[];
    architecture: string;
    trainingData: string;
    parameters: string;
    features: string[];
    hyperparameters: {
      learningRate: string;
      batchSize: string;
      epochs: string;
      dropout: string;
      optimizer: string;
    };
    perMarketMetrics: {
      market: string;
      directional: string;
      mae: string;
      calibration: string;
    }[];
  }
> = {
  "v0.3": {
    id: "v0.3",
    name: "v0.3",
    status: "production",
    deployedAt: "Dec 1, 2024",
    trainedAt: "Nov 28, 2024",
    markets: ["BTC-USD", "ETH-USD", "SOL-USD", "AVAX-USD"],
    horizons: ["1D", "7D", "30D", "90D"],
    metrics: {
      directional: "72.4%",
      mae: "2.34%",
      rmse: "3.21%",
      calibration: "0.89",
      sharpe: "1.45",
    },
    changelog: [
      "Improved feature engineering for momentum indicators",
      "Added regime detection layer",
      "Extended 90D horizon support for major assets",
      "Better calibration through temperature scaling",
      "Reduced inference latency by 40%",
      "Added attention mechanism for multi-scale patterns",
    ],
    architecture: "Transformer + LSTM ensemble",
    trainingData: "Jan 2020 – Nov 2024",
    parameters: "12.4M",
    features: [
      "Price momentum (multi-scale)",
      "Volume profile",
      "Volatility indicators",
      "Market regime classification",
      "Cross-asset correlations",
      "Sentiment indicators",
      "On-chain metrics (crypto)",
      "Macro indicators",
    ],
    hyperparameters: {
      learningRate: "1e-4",
      batchSize: "256",
      epochs: "150",
      dropout: "0.2",
      optimizer: "AdamW",
    },
    perMarketMetrics: [
      {
        market: "BTC-USD",
        directional: "74.2%",
        mae: "2.12%",
        calibration: "0.91",
      },
      {
        market: "ETH-USD",
        directional: "71.8%",
        mae: "2.45%",
        calibration: "0.88",
      },
      {
        market: "SOL-USD",
        directional: "70.5%",
        mae: "2.58%",
        calibration: "0.86",
      },
      {
        market: "AVAX-USD",
        directional: "69.8%",
        mae: "2.68%",
        calibration: "0.85",
      },
    ],
  },
  "v0.2": {
    id: "v0.2",
    name: "v0.2",
    status: "deprecated",
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
      rmse: "3.54%",
      calibration: "0.85",
      sharpe: "1.28",
    },
    changelog: [
      "Initial multi-horizon support",
      "Added confidence calibration",
      "Expanded to 6 crypto markets",
    ],
    architecture: "LSTM ensemble",
    trainingData: "Jan 2020 – Oct 2024",
    parameters: "8.2M",
    features: [
      "Price momentum",
      "Volume profile",
      "Volatility indicators",
      "Cross-asset correlations",
    ],
    hyperparameters: {
      learningRate: "5e-4",
      batchSize: "128",
      epochs: "100",
      dropout: "0.3",
      optimizer: "Adam",
    },
    perMarketMetrics: [
      {
        market: "BTC-USD",
        directional: "70.5%",
        mae: "2.48%",
        calibration: "0.86",
      },
      {
        market: "ETH-USD",
        directional: "68.1%",
        mae: "2.82%",
        calibration: "0.84",
      },
      {
        market: "SOL-USD",
        directional: "67.2%",
        mae: "2.95%",
        calibration: "0.83",
      },
      {
        market: "AVAX-USD",
        directional: "66.8%",
        mae: "3.05%",
        calibration: "0.82",
      },
      {
        market: "MATIC-USD",
        directional: "65.5%",
        mae: "3.12%",
        calibration: "0.81",
      },
      {
        market: "LINK-USD",
        directional: "64.8%",
        mae: "3.25%",
        calibration: "0.80",
      },
    ],
  },
  "v0.1": {
    id: "v0.1",
    name: "v0.1",
    status: "deprecated",
    deployedAt: "Aug 1, 2024",
    trainedAt: "Jul 25, 2024",
    markets: ["BTC-USD", "ETH-USD"],
    horizons: ["1D", "7D"],
    metrics: {
      directional: "65.8%",
      mae: "3.12%",
      rmse: "4.05%",
      calibration: "0.81",
      sharpe: "1.05",
    },
    changelog: [
      "Initial release",
      "Basic directional forecasting",
      "BTC and ETH support only",
    ],
    architecture: "LSTM",
    trainingData: "Jan 2020 – Jul 2024",
    parameters: "4.1M",
    features: ["Price momentum", "Volume profile", "Basic volatility"],
    hyperparameters: {
      learningRate: "1e-3",
      batchSize: "64",
      epochs: "50",
      dropout: "0.4",
      optimizer: "Adam",
    },
    perMarketMetrics: [
      {
        market: "BTC-USD",
        directional: "67.2%",
        mae: "2.95%",
        calibration: "0.82",
      },
      {
        market: "ETH-USD",
        directional: "64.5%",
        mae: "3.28%",
        calibration: "0.80",
      },
    ],
  },
};

const ModelVersionDetailPage = ({
  params,
}: {
  params: Promise<{ version: string }>;
}) => {
  const { version: rawVersion } = use(params);
  const version = decodeURIComponent(rawVersion);

  const model = MODEL_VERSIONS[version];

  if (!model) {
    return (
      <AppLayout title="Model Not Found" subtitle="">
        <div className="rounded-2xl border border-neutral-200 bg-white py-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <svg
            className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Model version "{version}" not found
          </p>
          <Link
            href="/app/models"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--brand)" }}
          >
            ← Back to Registry
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Model ${model.name}`}
      subtitle={`${model.architecture} · ${model.parameters} parameters`}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/app/models"
            className="text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            Models
          </Link>
          <svg
            className="h-4 w-4 text-neutral-300 dark:text-neutral-600"
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
          <span className="font-medium text-neutral-900 dark:text-white">
            {model.name}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${
                model.status === "production"
                  ? "text-black"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
              style={
                model.status === "production"
                  ? { backgroundColor: "var(--brand)" }
                  : {}
              }
            >
              {model.name.replace("v", "")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  {model.name}
                </h2>
                {model.status === "production" && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Production
                  </span>
                )}
                {model.status === "deprecated" && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    Deprecated
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Deployed {model.deployedAt} · Trained {model.trainedAt}
              </p>
            </div>
          </div>

          <Link
            href="/app/performance/compare"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
            Compare Versions
          </Link>
        </div>

        {/* Overall Metrics */}
        <div className="grid gap-4 sm:grid-cols-5">
          {[
            { label: "Directional", value: model.metrics.directional },
            { label: "MAE", value: model.metrics.mae },
            { label: "RMSE", value: model.metrics.rmse },
            { label: "Calibration", value: model.metrics.calibration },
            { label: "Sharpe", value: model.metrics.sharpe },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-white">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Changelog */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Changelog
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              What's new in this version
            </p>

            <ul className="mt-6 space-y-3">
              {model.changelog.map((item, i) => (
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
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Input Features
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Data signals used by the model
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {model.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Per-Market Metrics */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Per-Market Performance
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Metrics broken down by market
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Market
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Directional
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    MAE
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Calibration
                  </th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {model.perMarketMetrics.map((item) => (
                  <tr key={item.market}>
                    <td className="py-4">
                      <Link
                        href={`/app/forecasts/${item.market}`}
                        className="font-medium text-neutral-900 hover:underline dark:text-white"
                      >
                        {item.market}
                      </Link>
                    </td>
                    <td className="py-4">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {item.directional}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {item.mae}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${parseFloat(item.calibration) * 100}%`,
                              backgroundColor: "var(--brand)",
                            }}
                          />
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.calibration}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/app/forecasts/${item.market}`}
                        className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hyperparameters & Technical Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hyperparameters */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Hyperparameters
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Training configuration
            </p>

            <div className="mt-6 space-y-3">
              {Object.entries(model.hyperparameters).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                >
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </span>
                  <code className="rounded bg-neutral-200 px-2 py-0.5 text-sm font-mono text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Coverage
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Supported markets and horizons
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Markets ({model.markets.length})
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.markets.map((market) => (
                    <Link
                      key={market}
                      href={`/app/forecasts/${market}`}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      {market}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Horizons ({model.horizons.length})
                </p>
                <div className="mt-2 flex gap-2">
                  {model.horizons.map((h) => (
                    <span
                      key={h}
                      className="rounded-lg bg-[rgba(4,236,58,0.15)] px-3 py-1.5 text-sm font-medium text-[var(--brand)]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Training Data
                </p>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {model.trainingData}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ModelVersionDetailPage;
