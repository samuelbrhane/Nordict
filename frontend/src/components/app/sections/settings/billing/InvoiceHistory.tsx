"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import { Invoice } from "@/config/billingData";

interface InvoiceHistoryProps {
  invoices: Invoice[];
}

const InvoiceHistory = ({ invoices }: InvoiceHistoryProps) => {
  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Invoices
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Download past invoices
        </p>

        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {invoice.id}
                  </p>
                  <p className="text-xs text-neutral-500">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {invoice.amount}
                </span>
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
                <button
                  className="text-xs font-medium hover:opacity-80"
                  style={{ color: "var(--brand)" }}
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default InvoiceHistory;
