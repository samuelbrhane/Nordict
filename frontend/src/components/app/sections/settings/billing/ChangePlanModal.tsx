"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PLANS, PlanConfig } from "@/config/plans";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePlanModal = ({ isOpen, onClose }: ChangePlanModalProps) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isOnTrial = user?.is_trial_active;
  const currentPlanId = isOnTrial ? null : user?.effective_plan;
  const effectiveSelected = selectedPlan || currentPlanId || "";

  const getPrice = (plan: PlanConfig) => {
    if (billingCycle === "yearly") {
      return Math.floor(plan.yearlyPrice / 12);
    }
    return plan.price;
  };

  const getSavings = (plan: PlanConfig) => {
    const monthlyTotal = plan.price * 12;
    const yearlyTotal = plan.yearlyPrice;
    return Math.floor(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  const handleSelectPlan = async () => {
    if (
      !selectedPlan ||
      selectedPlan === currentPlanId ||
      selectedPlan === "teams"
    )
      return;

    setIsLoading(true);

    // TODO: Integrate with Stripe/payment provider
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Selected plan:", selectedPlan, "Billing:", billingCycle);

    setIsLoading(false);
    onClose();
  };

  const isPlanSelectable = (plan: PlanConfig) => {
    if (plan.id === "teams") return false; // Coming soon
    if (plan.id === currentPlanId) return false; // Current plan
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {isOnTrial ? "Choose Your Plan" : "Change Plan"}
            </h2>
            {isOnTrial && (
              <p className="text-sm text-neutral-500">
                {user?.trial_days_remaining} days left in your trial
              </p>
            )}
          </div>
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

        {/* Billing Toggle */}
        <div className="flex justify-center border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div className="inline-flex items-center rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentPlanId;
            const isSelected = effectiveSelected === plan.id;
            const isTeams = plan.id === "teams";
            const isSelectable = isPlanSelectable(plan);

            return (
              <div
                key={plan.id}
                onClick={() => isSelectable && setSelectedPlan(plan.id)}
                className={`relative rounded-xl border-2 p-4 transition-all ${
                  isTeams
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60 dark:border-neutral-700 dark:bg-neutral-800/50"
                    : isCurrentPlan
                    ? "cursor-default border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800/50"
                    : isSelected
                    ? "cursor-pointer border-[var(--brand)] bg-[rgba(4,236,58,0.05)]"
                    : "cursor-pointer border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                }`}
              >
                {/* Badges */}
                {isTeams && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs font-medium text-white dark:bg-neutral-600">
                    Coming Soon
                  </span>
                )}

                {plan.highlighted && !isCurrentPlan && !isTeams && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-xs font-medium text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Popular
                  </span>
                )}

                {isCurrentPlan && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                    Current
                  </span>
                )}

                <h4 className="font-semibold text-neutral-900 dark:text-white">
                  {plan.name}
                </h4>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {plan.description}
                </p>

                <p className="mt-3">
                  {isTeams ? (
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-neutral-900 dark:text-white">
                        €{getPrice(plan)}
                      </span>
                      <span className="text-xs text-neutral-500">/month</span>
                    </>
                  )}
                </p>

                {billingCycle === "yearly" && !isTeams && (
                  <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                    €{plan.yearlyPrice}/year · Save {getSavings(plan)}%
                  </p>
                )}

                {/* All Features */}
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-xs"
                    >
                      <svg
                        className="mt-0.5 h-3 w-3 shrink-0"
                        style={{ color: isTeams ? "#9ca3af" : "var(--brand)" }}
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
                </ul>

                {/* Contact Sales for Teams */}
                {isTeams && (
                  <p className="mt-3 text-center text-xs text-neutral-500">
                    Contact us for pricing
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <p className="text-xs text-neutral-500">
            {isOnTrial
              ? "You won't be charged until your trial ends"
              : "Changes take effect immediately"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectPlan}
              disabled={
                !selectedPlan ||
                selectedPlan === currentPlanId ||
                selectedPlan === "teams" ||
                isLoading
              }
              className="rounded-lg px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {isLoading
                ? "Processing..."
                : isOnTrial
                ? "Start Subscription"
                : "Update Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
