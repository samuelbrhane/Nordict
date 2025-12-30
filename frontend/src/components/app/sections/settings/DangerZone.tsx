"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../dashboard";

const DangerZone = () => {
  const { deleteAccount } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);

    // Validate
    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (confirmation !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount({ password, confirmation });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPassword("");
    setConfirmation("");
    setError(null);
  };

  return (
    <>
      <AnimatedCard delay={200}>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
          <h3 className="font-semibold text-red-900 dark:text-red-200">
            Danger Zone
          </h3>
          <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">
            Irreversible actions
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-200">
                Delete Account
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-fit rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-all hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Delete Account
                </h3>
                <p className="text-sm text-neutral-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm text-red-800 dark:text-red-200">
                This will permanently delete:
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-red-700 dark:text-red-300">
                <li>Your account and profile</li>
                <li>All your forecasts and alerts</li>
                <li>Your subscription and billing data</li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Enter your password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-red-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Type <span className="font-mono text-red-600">DELETE</span> to
                  confirm
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => {
                    setConfirmation(e.target.value);
                    setError(null);
                  }}
                  placeholder="DELETE"
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-red-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition-all hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DangerZone;
