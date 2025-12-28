"use client";

import { useState } from "react";
import {
  Market,
  HORIZONS,
  CONDITION_TYPES,
  ConditionType,
} from "@/config/alertsData";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (alert: {
    market: string;
    horizon: string;
    conditionType: string;
    value: number;
  }) => void;
  markets: Market[];
}

const CreateAlertModal = ({
  isOpen,
  onClose,
  onCreate,
  markets,
}: CreateAlertModalProps) => {
  const [newAlert, setNewAlert] = useState({
    market: markets[0]?.symbol || "BTC-USD",
    horizon: "7D",
    conditionType: "confidence_above",
    value: 75,
  });

  if (!isOpen) return null;

  const selectedCondition = CONDITION_TYPES.find(
    (c) => c.id === newAlert.conditionType
  );

  const handleCreate = () => {
    onCreate(newAlert);
    setNewAlert({
      market: markets[0]?.symbol || "BTC-USD",
      horizon: "7D",
      conditionType: "confidence_above",
      value: 75,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Create Alert
          </h2>
          <button
            onClick={onClose}
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

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Market
            </label>
            <select
              value={newAlert.market}
              onChange={(e) =>
                setNewAlert({ ...newAlert, market: e.target.value })
              }
              className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              {markets.map((market) => (
                <option key={market.symbol} value={market.symbol}>
                  {market.symbol} – {market.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Horizon
            </label>
            <div className="mt-2 flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {HORIZONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setNewAlert({ ...newAlert, horizon: h })}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    newAlert.horizon === h
                      ? "text-black"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  style={
                    newAlert.horizon === h
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Condition
            </label>
            <select
              value={newAlert.conditionType}
              onChange={(e) =>
                setNewAlert({ ...newAlert, conditionType: e.target.value })
              }
              className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              {CONDITION_TYPES.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {selectedCondition?.unit && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Threshold
              </label>
              <div className="relative mt-2">
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  {selectedCondition.unit}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand)" }}
          >
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlertModal;
