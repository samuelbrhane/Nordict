"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { BacktestRun } from "@/config/performanceData";

interface BacktestTableProps {
  runs: BacktestRun[];
}

const BacktestTable = ({ runs }: BacktestTableProps) => {
  return (
    <AnimatedCard delay={300} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Recent Backtest Runs
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Individual evaluation runs
        </p>

        {/* Mobile View */}
        <div className="mt-4 space-y-2 sm:hidden">
          {runs.map((run, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {run.date}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {run.version}
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(4, 236, 58, 0.15)",
                    color: "var(--brand)",
                  }}
                >
                  {run.horizon}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    MAE
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {run.mae}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Dir.
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {run.directional}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Cal.
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {run.calibration}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="mt-4 hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Date
                </th>
                <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  MAE
                </th>
                <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Dir.
                </th>
                <th className="pb-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Cal.
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {runs.map((run, i) => (
                <tr key={i}>
                  <td className="py-2.5">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {run.date}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {run.version}
                    </p>
                  </td>
                  <td className="py-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                    {run.mae}
                  </td>
                  <td className="py-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                    {run.directional}
                  </td>
                  <td className="py-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                    {run.calibration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default BacktestTable;
