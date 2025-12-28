"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For individual exploration",
    features: [
      "2 markets",
      "7D horizon max",
      "1,000 API calls/month",
      "Email alerts only",
    ],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For active traders",
    features: [
      "10 markets",
      "All horizons (1D–90D)",
      "50,000 API calls/month",
      "All alert channels",
      "Performance analytics",
      "Priority support",
    ],
    current: true,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and institutions",
    features: [
      "Unlimited markets",
      "Custom horizons",
      "Unlimited API calls",
      "Webhook integrations",
      "Dedicated support",
      "Custom model training",
      "SLA guarantee",
    ],
    current: false,
  },
];

const INVOICES = [
  { id: "INV-2024-012", date: "Dec 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-011", date: "Nov 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: "$49.00", status: "paid" },
];

const SettingsBillingPage = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = PLANS.find((p) => p.current);

  return (
    <AppLayout title="Billing" subtitle="Manage your subscription and payments">
      <div className="space-y-6">
        {/* Current Plan */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: "var(--brand)",
            backgroundColor: "rgba(4, 236, 58, 0.05)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {currentPlan?.name} Plan
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-black"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Current
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {currentPlan?.description}
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {currentPlan?.price}
                </span>
                {currentPlan?.period}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
              >
                Change Plan
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--brand)]/20 pt-6">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Plan includes:
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {currentPlan?.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0"
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
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Current Usage
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Billing period: Dec 1 – Dec 31, 2024
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {/* API Calls */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  API Calls
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  12,847 / 50,000
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "25.7%",
                    backgroundColor: "var(--brand)",
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                25.7% used
              </p>
            </div>

            {/* Markets */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Markets Tracked
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  6 / 10
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "60%",
                    backgroundColor: "var(--brand)",
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                60% used
              </p>
            </div>

            {/* Alerts */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Active Alerts
                </p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  4 / 25
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "16%",
                    backgroundColor: "var(--brand)",
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                16% used
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment Method */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Payment Method
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              How you pay for your subscription
            </p>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    •••• •••• •••• 4242
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Expires 12/2026
                  </p>
                </div>
              </div>
              <button
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
                Update
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Next billing date:{" "}
                <span className="font-medium text-neutral-900 dark:text-white">
                  January 1, 2025
                </span>
              </p>
            </div>
          </div>

          {/* Billing Contact */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Billing Contact
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Where invoices are sent
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Email
                </span>
                <span className="text-sm text-neutral-900 dark:text-white">
                  billing@acmetrading.co
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Company
                </span>
                <span className="text-sm text-neutral-900 dark:text-white">
                  Acme Trading Co.
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Address
                </span>
                <span className="text-sm text-neutral-900 dark:text-white">
                  123 Wall St, New York
                </span>
              </div>
            </div>

            <button
              className="mt-4 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand)" }}
            >
              Edit billing details
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Invoice History
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Download past invoices
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Invoice
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Amount
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Status
                  </th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {INVOICES.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="py-4">
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {invoice.date}
                    </td>
                    <td className="py-4 text-sm text-neutral-900 dark:text-white">
                      {invoice.amount}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <svg
                          className="h-3 w-3"
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
                        Paid
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        className="text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: "var(--brand)" }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Cancel Subscription
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You can cancel anytime. Access continues until the end of the
                billing period.
              </p>
            </div>
            <button className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              Cancel subscription
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsUpgradeModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Choose a Plan
              </h2>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
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

            <div className="grid gap-4 p-6 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                    selectedPlan === plan.id ||
                    (selectedPlan === null && plan.current)
                      ? "border-[var(--brand)] bg-[rgba(4,236,58,0.05)]"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                  }`}
                >
                  {plan.popular && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      Popular
                    </span>
                  )}

                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {plan.description}
                  </p>
                  <p className="mt-4">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {plan.period}
                    </span>
                  </p>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0"
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
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.current && (
                    <p className="mt-4 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Current plan
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                disabled={
                  !selectedPlan ||
                  PLANS.find((p) => p.id === selectedPlan)?.current
                }
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {selectedPlan === "enterprise"
                  ? "Contact Sales"
                  : "Update Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default SettingsBillingPage;
