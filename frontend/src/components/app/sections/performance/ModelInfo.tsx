"use client";

import AnimatedCard from "../dashboard/AnimatedCard";
import { ModelVersion } from "@/config/performanceData";

interface ModelInfoProps {
  version: ModelVersion;
}

const ModelInfo = ({ version }: ModelInfoProps) => {
  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {version.label.replace("v", "").replace(" (Current)", "")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {version.label}
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Active
                </span>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Deployed {version.date} · Transformer + LSTM ensemble
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <div className="text-right">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Parameters
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                12.4M
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Training Data
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Jan 2020 – Nov 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ModelInfo;
