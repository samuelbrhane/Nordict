"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import { ApiKey } from "@/config/apiData";

interface ApiKeysListProps {
  keys: ApiKey[];
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
}

const ApiKeysList = ({ keys, onRevoke, onDelete }: ApiKeysListProps) => {
  return (
    <AnimatedCard delay={100}>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {keys.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {keys.map((key) => (
              <div
                key={key.id}
                className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${
                  key.status === "revoked" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      key.status === "active"
                        ? "bg-[rgba(4,236,58,0.15)]"
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}
                  >
                    <svg
                      className={`h-4 w-4 ${
                        key.status === "active"
                          ? "text-[var(--brand)]"
                          : "text-neutral-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {key.name}
                      </p>
                      {key.status === "revoked" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Revoked
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      {key.keyPrefix}••••••••
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                      <span>Created {key.createdAt}</span>
                      <span>·</span>
                      <span>Last: {key.lastUsed || "Never"}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {key.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {key.status === "active" ? (
                    <button
                      onClick={() => onRevoke(key.id)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-red-800 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      onClick={() => onDelete(key.id)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-neutral-700 dark:text-red-400 dark:hover:bg-red-950/50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              No API keys yet
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Create your first key to get started
            </p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default ApiKeysList;
