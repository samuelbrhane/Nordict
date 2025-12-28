"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
  status: "active" | "revoked";
}

const MOCK_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production App",
    keyPrefix: "nrd_live_7x8k",
    createdAt: "Dec 1, 2024",
    lastUsed: "2 hours ago",
    permissions: ["forecasts:read", "alerts:read", "alerts:write"],
    status: "active",
  },
  {
    id: "2",
    name: "Development",
    keyPrefix: "nrd_test_3m2n",
    createdAt: "Nov 15, 2024",
    lastUsed: "3 days ago",
    permissions: ["forecasts:read"],
    status: "active",
  },
  {
    id: "3",
    name: "Old Integration",
    keyPrefix: "nrd_live_9p4q",
    createdAt: "Oct 1, 2024",
    lastUsed: "Nov 20, 2024",
    permissions: ["forecasts:read", "alerts:read"],
    status: "revoked",
  },
];

const PERMISSIONS = [
  {
    id: "forecasts:read",
    label: "Read Forecasts",
    description: "Access forecast data and predictions",
  },
  {
    id: "alerts:read",
    label: "Read Alerts",
    description: "View alert configurations",
  },
  {
    id: "alerts:write",
    label: "Manage Alerts",
    description: "Create, update, delete alerts",
  },
  {
    id: "performance:read",
    label: "Read Performance",
    description: "Access performance metrics",
  },
];

const SettingsApiPage = () => {
  const [keys, setKeys] = useState(MOCK_KEYS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([
    "forecasts:read",
  ]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: String(keys.length + 1),
      name: newKeyName,
      keyPrefix: `nrd_live_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: "Just now",
      lastUsed: null,
      permissions: newKeyPermissions,
      status: "active",
    };
    setKeys([newKey, ...keys]);
    setCreatedKey(`nrd_live_${Math.random().toString(36).substring(2, 34)}`);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(
      keys.map((key) =>
        key.id === keyId ? { ...key, status: "revoked" as const } : key
      )
    );
  };

  const handleDeleteKey = (keyId: string) => {
    setKeys(keys.filter((key) => key.id !== keyId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setNewKeyName("");
    setNewKeyPermissions(["forecasts:read"]);
    setCreatedKey(null);
  };

  return (
    <AppLayout title="API Keys" subtitle="Manage programmatic access">
      <div className="space-y-6">
        {/* Usage Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              API Calls (This Month)
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">
              12,847
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              of 50,000 included
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
              <div
                className="h-full rounded-full"
                style={{
                  width: "25.7%",
                  backgroundColor: "var(--brand)",
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Active Keys
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">
              {keys.filter((k) => k.status === "active").length}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              of 10 allowed
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Avg Response Time
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">
              124ms
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              ↓ 8ms from last month
            </p>
          </div>
        </div>

        {/* API Keys List */}
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                API Keys
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Keys for programmatic access to the API
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
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

          {keys.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                    key.status === "revoked" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        key.status === "active"
                          ? "bg-[rgba(4,236,58,0.15)]"
                          : "bg-neutral-100 dark:bg-neutral-800"
                      }`}
                    >
                      <svg
                        className={`h-5 w-5 ${
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
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {key.name}
                        </p>
                        {key.status === "revoked" && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Revoked
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-sm text-neutral-500 dark:text-neutral-400">
                        {key.keyPrefix}••••••••
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>Created {key.createdAt}</span>
                        <span>·</span>
                        <span>Last used: {key.lastUsed || "Never"}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
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
                        onClick={() => handleRevokeKey(key.id)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-red-800 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-red-950/50"
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
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Create your first API key to get started
              </p>
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(4, 236, 58, 0.15)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                API Documentation
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Learn how to integrate Nordict forecasts into your application.
                Our REST API provides access to all forecast data, alerts, and
                performance metrics.
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
                View Documentation
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
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {createdKey ? "API Key Created" : "Create API Key"}
              </h2>
              <button
                onClick={closeModal}
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

            {createdKey ? (
              <div className="px-6 py-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Copy your key now
                      </p>
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                        This is the only time you'll see the full key. Store it
                        securely.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Your API Key
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      readOnly
                      value={createdKey}
                      className="block w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-24 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(createdKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                      style={
                        copiedKey
                          ? { backgroundColor: "var(--brand)", color: "black" }
                          : {}
                      }
                    >
                      {copiedKey ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5 px-6 py-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Key Name
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production App"
                      className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Permissions
                    </label>
                    <div className="mt-2 space-y-2">
                      {PERMISSIONS.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                        >
                          <input
                            type="checkbox"
                            checked={newKeyPermissions.includes(perm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewKeyPermissions([
                                  ...newKeyPermissions,
                                  perm.id,
                                ]);
                              } else {
                                setNewKeyPermissions(
                                  newKeyPermissions.filter((p) => p !== perm.id)
                                );
                              }
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                          />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {perm.label}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {perm.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
                  <button
                    onClick={closeModal}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyName || newKeyPermissions.length === 0}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Create Key
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default SettingsApiPage;
