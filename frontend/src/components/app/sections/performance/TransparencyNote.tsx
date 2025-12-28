"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

const TransparencyNote = () => {
  return (
    <AnimatedCard delay={350}>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
        <div className="flex items-start gap-2.5">
          <svg
            className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-medium text-neutral-900 dark:text-white">
              Transparency:
            </span>{" "}
            All metrics are computed consistently with no cherry-picking.
            Historical data is immutable.
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default TransparencyNote;
