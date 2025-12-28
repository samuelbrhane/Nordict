"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

const ValidationNote = () => {
  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
          >
            <svg
              className="h-4 w-4"
              style={{ color: "var(--brand)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Walk-Forward Validation
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              All metrics use strict walk-forward validation: trained only on
              past data, tested on unseen future data. This prevents look-ahead
              bias and reflects real-world performance.
            </p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ValidationNote;
