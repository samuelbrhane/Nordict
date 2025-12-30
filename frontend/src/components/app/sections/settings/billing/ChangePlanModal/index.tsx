"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PLANS } from "@/config/plans";
import { createCheckoutSessionApi, changePlanApi } from "@/context/auth/api";
import ModalHeader from "./ModalHeader";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import ModalFooter from "./ModalFooter";
import { ChangePlanModalProps } from "./types";

const ChangePlanModal = ({ isOpen, onClose }: ChangePlanModalProps) => {
  const { user, tokens, refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOnTrial = user?.is_trial_active ?? false;
  const hasSubscription = user?.is_subscription_active ?? false;
  const currentPlanId = isOnTrial ? null : user?.subscription?.plan;
  const currentBillingCycle = user?.subscription?.billing_cycle;

  // Returns the type of change for messaging purposes
  const getChangeType = (
    newPlan: string,
    newCycle: string
  ): "upgrade" | "downgrade" | "same_plan_cycle" | "same" => {
    if (!currentPlanId || !currentBillingCycle) return "upgrade";

    if (newPlan === currentPlanId && newCycle === currentBillingCycle) {
      return "same";
    }

    const planTier: Record<string, number> = { pro: 1, premium: 2 };
    const currentTier = planTier[currentPlanId] || 0;
    const newTier = planTier[newPlan] || 0;

    if (currentTier === newTier) {
      return "same_plan_cycle"; // Same plan, different cycle (Pro Monthly → Pro Yearly)
    }

    return newTier > currentTier ? "upgrade" : "downgrade";
  };

  // Returns boolean for component props that expect boolean
  const isUpgrade = (newPlan: string, newCycle: string): boolean => {
    const changeType = getChangeType(newPlan, newCycle);
    // "same_plan_cycle" is treated as upgrade (user pays more upfront)
    return changeType === "upgrade" || changeType === "same_plan_cycle";
  };

  const handleSelectPlan = async () => {
    if (!selectedPlan || selectedPlan === "teams" || !tokens?.access) return;

    if (
      selectedPlan === currentPlanId &&
      billingCycle === currentBillingCycle
    ) {
      setError("You're already on this plan");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (hasSubscription && !isOnTrial) {
        // Change existing subscription
        const response = await changePlanApi(
          tokens.access,
          selectedPlan,
          billingCycle
        );

        console.log("ChangePlan response:", response); // Debug log

        // Check if we need to redirect to checkout
        if (response.checkout_url) {
          console.log("Redirecting to checkout:", response.checkout_url);
          window.location.href = response.checkout_url;
          return;
        }

        // Instant change (no checkout needed)
        setSuccessMessage(response.message || "Plan updated successfully!");
        await refreshUser();

        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 3000);
      } else {
        // New subscription - go to checkout
        const response = await createCheckoutSessionApi(
          tokens.access,
          selectedPlan,
          billingCycle
        );

        console.log("Checkout response:", response); // Debug log

        if (response.checkout_url) {
          window.location.href = response.checkout_url;
        }
      }
    } catch (err) {
      console.error("Error:", err); // Debug log
      setError(
        err instanceof Error ? err.message : "Failed to process request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (!selectedPlan) return "Select a Plan";
    if (selectedPlan === currentPlanId && billingCycle === currentBillingCycle)
      return "Current Plan";
    if (!hasSubscription || isOnTrial) return "Continue to Payment";

    const changeType = getChangeType(selectedPlan, billingCycle);

    switch (changeType) {
      case "upgrade":
        return "Upgrade Now";
      case "same_plan_cycle":
        return "Extend Subscription";
      case "downgrade":
        return "Downgrade Plan";
      default:
        return "Continue";
    }
  };

  const isButtonDisabled =
    !selectedPlan ||
    (selectedPlan === currentPlanId && billingCycle === currentBillingCycle) ||
    selectedPlan === "teams";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <ModalHeader
          hasSubscription={hasSubscription}
          isOnTrial={isOnTrial}
          trialDaysRemaining={user?.trial_days_remaining}
          currentPlanId={currentPlanId}
          currentBillingCycle={currentBillingCycle}
          onClose={onClose}
        />

        {/* Messages */}
        {successMessage && (
          <div className="mx-6 mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-300">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <BillingToggle billingCycle={billingCycle} onChange={setBillingCycle} />

        {/* Plans Grid */}
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrentPlan =
              plan.id === currentPlanId && billingCycle === currentBillingCycle;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isSelected={selectedPlan === plan.id}
                isCurrentPlan={isCurrentPlan}
                hasSubscription={hasSubscription}
                isUpgrade={isUpgrade(plan.id, billingCycle)}
                onSelect={setSelectedPlan}
              />
            );
          })}
        </div>

        <ModalFooter
          hasSubscription={hasSubscription}
          isOnTrial={isOnTrial}
          selectedPlan={selectedPlan}
          isUpgrade={
            selectedPlan ? isUpgrade(selectedPlan, billingCycle) : false
          }
          isLoading={isLoading}
          isDisabled={isButtonDisabled}
          buttonText={getButtonText()}
          onCancel={onClose}
          onSubmit={handleSelectPlan}
        />
      </div>
    </div>
  );
};

export default ChangePlanModal;
