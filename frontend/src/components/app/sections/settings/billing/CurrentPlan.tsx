"use client";

import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../../dashboard";
import { getPlanById } from "@/config/plans";

interface CurrentPlanProps {
  onChangePlan: () => void;
}

const CurrentPlan = ({ onChangePlan }: CurrentPlanProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const isOnTrial = user.is_trial_active;
  const trialDaysLeft = user.trial_days_remaining;

  // During trial, user has Premium features
  // After trial, show their actual subscription plan
  const planId = isOnTrial ? "premium" : user.effective_plan;
  const plan = getPlanById(planId);

  // If no valid plan (expired trial, no subscription), show upgrade prompt
  if (!plan) {
    return (
      <AnimatedCard delay={0}>
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-red-900 dark:text-red-200">
                No Active Subscription
              </h1>
              <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">
                Your trial has ended. Choose a plan to continue using Nordict.
              </p>
            </div>
            <button
              onClick={onChangePlan}
              className="w-fit rounded-lg px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Choose Plan
            </button>
          </div>
        </div>
      </AnimatedCard>
    );
  }

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
                {isOnTrial ? "Premium Trial" : `${plan.name} Plan`}
              </h1>
              {isOnTrial ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {trialDaysLeft} days left
                </span>
              ) : (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Active
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {isOnTrial
                ? "Full access to all Premium features during your trial"
                : plan.description}
            </p>
            <p className="mt-1">
              {isOnTrial ? (
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Free during trial · Choose a plan before it ends
                </span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    €{plan.price}
                  </span>
                  <span className="text-sm text-neutral-500">/month</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onChangePlan}
            className={`w-fit rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isOnTrial
                ? "text-black hover:opacity-90"
                : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
            style={isOnTrial ? { backgroundColor: "var(--brand)" } : undefined}
          >
            {isOnTrial ? "Choose Plan" : "Change Plan"}
          </button>
        </div>

        {/* Trial Progress Bar */}
        {isOnTrial && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">
                Trial progress
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {7 - trialDaysLeft} of 7 days used
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${((7 - trialDaysLeft) / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-4 border-t border-[var(--brand)]/20 pt-4">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {isOnTrial ? "You have access to:" : "Includes:"}
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
