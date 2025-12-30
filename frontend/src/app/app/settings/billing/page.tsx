"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { AppLayout, LoadingSpinner } from "@/components/app";
import {
  CurrentPlan,
  UsageSection,
  PaymentMethod,
  CancelSubscription,
  ChangePlanModal,
} from "@/components/app/sections/settings/billing";

const SettingsBillingPage = () => {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRefreshed = useRef(false);

  const isOnTrial = user?.is_trial_active;
  const hasActiveSubscription = user?.is_subscription_active;

  // Refresh ONCE when page mounts
  useEffect(() => {
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      setIsLoading(true);
      refreshUser().finally(() => setIsLoading(false));
    }
  }, []);

  // Handle URL params (success/canceled from Stripe checkout)
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      setIsLoading(true);
      refreshUser().finally(() => setIsLoading(false));
      setSuccessMessage("Payment successful! Your subscription is now active.");
      window.history.replaceState({}, "", "/app/settings/billing");
      setTimeout(() => setSuccessMessage(null), 5000);
    }

    if (canceled === "true") {
      window.history.replaceState({}, "", "/app/settings/billing");
      setIsLoading(false);
    }
  }, [searchParams]);

  // Refresh when returning from another tab (Stripe Portal)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsLoading(true);
        refreshUser().finally(() => setIsLoading(false));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <LoadingSpinner text="Loading..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="rounded-2xl border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
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
              <p className="font-medium text-green-800 dark:text-white">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <CurrentPlan onChangePlan={() => setIsModalOpen(true)} />

        <UsageSection />

        <PaymentMethod />

        {hasActiveSubscription && <CancelSubscription />}

        {isOnTrial && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  Choose a plan before your trial ends
                </h3>
                <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">
                  You have {user?.trial_days_remaining} days left. Select a plan
                  to continue using Nordict.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-fit rounded-lg px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--brand)" }}
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </div>

      <ChangePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppLayout>
  );
};

export default SettingsBillingPage;
