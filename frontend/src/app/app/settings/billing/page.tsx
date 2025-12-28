"use client";

import { useState } from "react";
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

import { PLANS, INVOICES } from "@/config/billingData";

const SettingsBillingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPlan = PLANS.find((p) => p.current)!;

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <CurrentPlan
          plan={currentPlan}
          onChangePlan={() => setIsModalOpen(true)}
        />
        <UsageSection />

        <div className="grid gap-6 lg:grid-cols-2">
          <PaymentMethod />
          <BillingContact />
        </div>

        <InvoiceHistory invoices={INVOICES} />
        <CancelSubscription />
      </div>

      <ChangePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlanId={currentPlan.id}
      />
    </AppLayout>
  );
};

export default SettingsBillingPage;
