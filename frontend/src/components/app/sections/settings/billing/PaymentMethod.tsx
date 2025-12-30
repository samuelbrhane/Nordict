"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../../dashboard";
import { createPortalSessionApi } from "@/context/auth/api";

const CARD_BRANDS: Record<string, { bg: string; text: string }> = {
  visa: { bg: "from-blue-600 to-blue-800", text: "VISA" },
  mastercard: { bg: "from-red-500 to-orange-500", text: "MC" },
  amex: { bg: "from-blue-400 to-blue-600", text: "AMEX" },
  discover: { bg: "from-orange-500 to-orange-600", text: "DISC" },
  default: { bg: "from-neutral-600 to-neutral-800", text: "CARD" },
};

const PaymentMethod = () => {
  const { user, tokens } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const subscription = user?.subscription;
  const hasCard = subscription?.stripe_card_last4;
  const cardBrand = subscription?.stripe_card_brand?.toLowerCase() || "default";
  const brandStyle = CARD_BRANDS[cardBrand] || CARD_BRANDS.default;

  const formatExpiry = () => {
    if (
      !subscription?.stripe_card_exp_month ||
      !subscription?.stripe_card_exp_year
    )
      return null;
    const month = String(subscription.stripe_card_exp_month).padStart(2, "0");
    const year = String(subscription.stripe_card_exp_year).slice(-2);
    return `${month}/${year}`;
  };

  const formatNextBilling = () => {
    if (!subscription?.next_billing_date) return null;
    const date = new Date(subscription.next_billing_date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleManageBilling = async () => {
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
    <AnimatedCard delay={100} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Payment Method
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Manage your payment details
        </p>

        <div className="mt-4 flex-1">
          {hasCard ? (
            <>
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r ${brandStyle.bg}`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {brandStyle.text}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      •••• {subscription.stripe_card_last4}
                    </p>
                    {formatExpiry() && (
                      <p className="text-xs text-neutral-500">
                        Expires {formatExpiry()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleManageBilling}
                  disabled={isLoading}
                  className="text-xs font-medium hover:opacity-80 disabled:opacity-50"
                  style={{ color: "var(--brand)" }}
                >
                  {isLoading ? "..." : "Update"}
                </button>
              </div>

              {formatNextBilling() && (
                <p className="mt-3 text-xs text-neutral-500">
                  Next billing:{" "}
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {formatNextBilling()}
                  </span>
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/50">
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                No payment method
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Add a card when you subscribe
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PaymentMethod;
