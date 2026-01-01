"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface BacktestRun {
  id: number;
  market: string;
  horizon: string;
  model_version: string;
  test_start: string;
  test_end: string;
  mae: number;
  rmse: number;
  mape: number;
  directional_accuracy: number;
  total_predictions: number;
  run_at: string;
}

interface BacktestTableProps {
  runs: BacktestRun[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BacktestTable = ({
  runs,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
}: BacktestTableProps) => {
  if (isLoading) {
    return (
      <AnimatedCard delay={200}>
        <div className="h-80 animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800" />
      </AnimatedCard>
    );
  }

  if (runs.length === 0) {
    return (
      <AnimatedCard delay={200}>
        <div className="flex h-80 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-neutral-500 dark:text-neutral-400">
            No backtest runs found
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Backtest Runs
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {total} validation runs on historical data
            </p>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mt-4 space-y-3 sm:hidden">
          {runs.map((run) => (
            <div
              key={run.id}
              className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {run.market.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {run.market}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDate(run.run_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    MAE
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {(run.mae * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    RMSE
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {(run.rmse * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Predictions
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {run.total_predictions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="mt-4 hidden overflow-x-auto sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Market
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Period
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  MAE
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  RMSE
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Predictions
                </th>
                <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Run Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {runs.map((run) => (
                <tr
                  key={run.id}
                  className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {run.market.slice(0, 2)}
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {run.market}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-neutral-600 dark:text-neutral-300">
                    {formatDate(run.test_start)} – {formatDate(run.test_end)}
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-neutral-900 dark:text-white">
                    {(run.mae * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-neutral-900 dark:text-white">
                    {(run.rmse * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 text-right text-sm text-neutral-600 dark:text-neutral-300">
                    {run.total_predictions}
                  </td>
                  <td className="py-3 text-right text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(run.run_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default BacktestTable;
