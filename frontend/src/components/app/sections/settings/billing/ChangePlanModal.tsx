"use client";

import { useState } from "react";
import { Plan, PLANS } from "@/config/billingData";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: string;
}

const ChangePlanModal = ({
  isOpen,
  onClose,
  currentPlanId,
}: ChangePlanModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectiveSelected = selectedPlan || currentPlanId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Choose a Plan
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg
              className="h-5 w-5"
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
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                effectiveSelected === plan.id
                  ? "border-[var(--brand)] bg-[rgba(4,236,58,0.05)]"
                  : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {plan.popular && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-xs font-medium text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Popular
                </span>
              )}

              <h4 className="font-semibold text-neutral-900 dark:text-white">
                {plan.name}
              </h4>
              <p className="mt-0.5 text-xs text-neutral-500">
                {plan.description}
              </p>
              <p className="mt-3">
                <span className="text-xl font-bold text-neutral-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-xs text-neutral-500">{plan.period}</span>
              </p>

              <ul className="mt-3 space-y-1.5">
                {plan.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-1.5 text-xs"
                  >
                    <svg
                      className="mt-0.5 h-3 w-3 shrink-0"
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
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-xs text-neutral-500">
                    +{plan.features.length - 4} more
                  </li>
                )}
              </ul>

              {plan.current && (
                <p className="mt-3 text-center text-xs font-medium text-neutral-500">
                  Current
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </button>
          <button
            disabled={!selectedPlan || selectedPlan === currentPlanId}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {selectedPlan === "enterprise" ? "Contact Sales" : "Update Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
