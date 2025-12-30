"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../../dashboard";
import { createPortalSessionApi } from "@/context/auth/api";

const BillingContact = () => {
  const { user, tokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const subscription = user?.subscription;
  const hasBillingInfo = subscription?.stripe_customer_id;

  const handleEditBilling = async () => {
    if (!tokens?.access) return;

    setIsLoading(true);
    try {
      const { portal_url } = await createPortalSessionApi(tokens.access);
      window.location.href = portal_url;
    } catch (err) {
      console.error("Failed to open billing portal:", err);
      setIsLoading(false);
    }
  };

  return (
    <AnimatedCard delay={150} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Billing Contact
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Where invoices are sent
        </p>

        <div className="mt-4 flex-1">
          {hasBillingInfo ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Email</span>
                  <span className="text-xs text-neutral-900 dark:text-white">
                    {user?.email}
                  </span>
                </div>
                {user?.company && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Company</span>
                    <span className="text-xs text-neutral-900 dark:text-white">
                      {user.company}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Name</span>
                  <span className="text-xs text-neutral-900 dark:text-white">
                    {user?.full_name}
                  </span>
                </div>
              </div>

              <button
                onClick={handleEditBilling}
                disabled={isLoading}
                className="mt-3 text-xs font-medium hover:opacity-80 disabled:opacity-50"
                style={{ color: "var(--brand)" }}
              >
                {isLoading ? "Loading..." : "Edit in billing portal"}
              </button>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                No billing info
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Added when you subscribe
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default BillingContact;
