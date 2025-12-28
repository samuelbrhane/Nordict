"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { RegimeData } from "@/config/performanceData";

interface RegimeBreakdownProps {
  regimes: RegimeData[];
}

const RegimeBreakdown = ({ regimes }: RegimeBreakdownProps) => {
  return (
    <AnimatedCard delay={250} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Performance by Regime
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Model accuracy in different conditions
        </p>

        <div className="mt-4 space-y-2">
          {regimes.map((regime) => (
            <div
              key={regime.regime}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    regime.status === "strong"
                      ? "bg-emerald-500"
                      : regime.status === "moderate"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {regime.regime}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {regime.periods} periods
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {regime.directional}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {regime.mae} MAE
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default RegimeBreakdown;
