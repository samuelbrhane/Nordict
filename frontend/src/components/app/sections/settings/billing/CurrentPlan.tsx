"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import { Plan } from "@/config/billingData";

interface CurrentPlanProps {
  plan: Plan;
  onChangePlan: () => void;
}

const CurrentPlan = ({ plan, onChangePlan }: CurrentPlanProps) => {
  return (
    <AnimatedCard delay={0}>
      <div
        className="rounded-2xl border-2 p-4"
        style={{
          borderColor: "var(--brand)",
          backgroundColor: "rgba(4, 236, 58, 0.05)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {plan.name} Plan
              </h1>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Current
              </span>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {plan.description}
            </p>
            <p className="mt-1">
              <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                {plan.price}
              </span>
              <span className="text-sm text-neutral-500">{plan.period}</span>
            </p>
          </div>
          <button
            onClick={onChangePlan}
            className="w-fit rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Change Plan
          </button>
        </div>

        <div className="mt-4 border-t border-[var(--brand)]/20 pt-4">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Includes:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {plan.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 rounded-full bg-white/50 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300"
              >
                <svg
                  className="h-3 w-3"
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
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CurrentPlan;
