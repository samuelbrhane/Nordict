"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/app";
import {
  CurrentPlan,
  UsageSection,
  PaymentMethod,
  BillingContact,
  InvoiceHistory,
  CancelSubscription,
  ChangePlanModal,
} from "@/components/app/sections/settings/billing";

const SettingsBillingPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOnTrial = user?.is_trial_active;
  const hasActiveSubscription = user?.is_subscription_active;
  const showBillingSections =
    hasActiveSubscription || process.env.NODE_ENV === "development";

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <CurrentPlan onChangePlan={() => setIsModalOpen(true)} />

        <UsageSection />

        {/* Payment & Billing sections */}
        {showBillingSections && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <PaymentMethod />
              <BillingContact />
            </div>

            {/* <InvoiceHistory /> */}
            <CancelSubscription />
          </>
        )}

        {/* Show upgrade prompt for trial users */}
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
