"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

const BillingContact = () => {
  return (
    <AnimatedCard delay={150} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Billing Contact
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Where invoices are sent
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Email</span>
            <span className="text-xs text-neutral-900 dark:text-white">
              billing@acmetrading.co
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Company</span>
            <span className="text-xs text-neutral-900 dark:text-white">
              Acme Trading Co.
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Address</span>
            <span className="text-xs text-neutral-900 dark:text-white">
              123 Wall St, NY
            </span>
          </div>
        </div>

        <button
          className="mt-3 text-xs font-medium hover:opacity-80"
          style={{ color: "var(--brand)" }}
        >
          Edit details
        </button>
      </div>
    </AnimatedCard>
  );
};

export default BillingContact;
