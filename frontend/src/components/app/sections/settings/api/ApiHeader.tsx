"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

interface ApiHeaderProps {
  onCreateClick: () => void;
}

const ApiHeader = ({ onCreateClick }: ApiHeaderProps) => {
  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
              API Keys
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Manage programmatic access
            </p>
          </div>
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Key
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ApiHeader;
