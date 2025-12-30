"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../../dashboard";
import { createPortalSessionApi } from "@/context/auth/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CancelSubscription = () => {
  const { user, tokens, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCancelled =
    user?.subscription?.cancelled_at !== null &&
    user?.subscription?.cancelled_at !== undefined;

  const handleOpenPortal = async () => {
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

  const handleCancel = async () => {
    if (!tokens?.access) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/billing/cancel/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      setSuccess(data.message);
      setShowConfirm(false);
      await refreshUser();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!tokens?.access) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/billing/reactivate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.access}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reactivate subscription");
      }

      setSuccess(data.message);
      await refreshUser();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reactivate");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm dark:border-red-700 dark:bg-neutral-800">
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm dark:border-green-700 dark:bg-neutral-800">
            <span className="text-green-800 dark:text-green-200">
              {success}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Manage Subscription
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Update payment method, view invoices, or cancel your subscription
        </p>

        {/* Billing Portal Button */}
        <div className="mt-4">
          <button
            onClick={handleOpenPortal}
            disabled={isLoading}
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-50 sm:w-auto dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            {isLoading ? "Loading..." : "Open Billing Portal"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-200 dark:border-neutral-700" />

        {/* Cancel/Reactivate Section */}
        {isCancelled ? (
          // Cancelled state
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Cancellation Scheduled
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Your subscription will end on{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {formatDate(user?.subscription?.next_billing_date)}
              </span>
              . You&apos;ll keep access until then.
            </p>
            <button
              onClick={handleReactivate}
              disabled={isLoading}
              className="mt-3 rounded-lg border border-green-600 bg-transparent px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/50"
            >
              {isLoading ? "Processing..." : "Reactivate Subscription"}
            </button>
          </div>
        ) : showConfirm ? (
          // Confirmation state
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Are you sure you want to cancel?
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              You&apos;ll keep access until{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {formatDate(user?.subscription?.next_billing_date)}
              </span>
              . You can reactivate anytime before then.
            </p>
            <div className="mt-3 flex gap-3">
              {/* Yes, Cancel - Outline button */}
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="rounded-lg border border-red-500 bg-transparent px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                {isLoading ? "Cancelling..." : "Yes, Cancel Subscription"}
              </button>
              {/* Keep Subscription - Neutral outline */}
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Keep Subscription
              </button>
            </div>
          </div>
        ) : (
          // Default state
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              If you cancel, you&apos;ll keep access until the end of your
              current billing period.
            </p>
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 rounded-lg border border-red-500 bg-transparent px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default CancelSubscription;
