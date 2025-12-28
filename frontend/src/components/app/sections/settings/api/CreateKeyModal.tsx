"use client";

import { useState } from "react";
import { Permission, PERMISSIONS } from "@/config/apiData";

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, permissions: string[]) => string;
}

const CreateKeyModal = ({ isOpen, onClose, onCreate }: CreateKeyModalProps) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>(["forecasts:read"]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    const key = onCreate(name, permissions);
    setCreatedKey(key);
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setPermissions(["forecasts:read"]);
    setCreatedKey(null);
    onClose();
  };

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {createdKey ? "API Key Created" : "Create API Key"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
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
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-start gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
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
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Copy now – you won't see this again
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Your API Key
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  readOnly
                  value={createdKey}
                  className="block w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 pr-20 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium transition-all"
                  style={
                    copied
                      ? { backgroundColor: "var(--brand)", color: "black" }
                      : {}
                  }
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Key Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Production App"
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Permissions
                </label>
                <div className="mt-2 space-y-2">
                  {PERMISSIONS.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
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
                onClick={handleClose}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name || permissions.length === 0}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Create Key
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateKeyModal;
