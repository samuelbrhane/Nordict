"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

const PaymentMethod = () => {
  return (
    <AnimatedCard delay={100} className="h-full">
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Payment Method
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          How you pay
        </p>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-800">
              <span className="text-[10px] font-bold text-white">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                •••• 4242
              </p>
              <p className="text-xs text-neutral-500">Exp 12/26</p>
            </div>
          </div>
          <button
            className="text-xs font-medium hover:opacity-80"
            style={{ color: "var(--brand)" }}
          >
            Update
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          Next billing:{" "}
          <span className="font-medium text-neutral-900 dark:text-white">
            Jan 1, 2025
          </span>
        </p>
      </div>
    </AnimatedCard>
  );
};

export default PaymentMethod;
