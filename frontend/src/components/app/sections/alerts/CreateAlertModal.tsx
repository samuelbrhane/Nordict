"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MarketSelectorModal from "../dashboard/forecastchart/MarketSelectorModal";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import { CreateAlertData } from "@/lib/hooks/useAlerts";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateAlertData) => Promise<unknown>;
  initialMarket?: { symbol: string; name: string; id: number };
}

const HORIZONS: { value: Horizon | "ANY"; label: string }[] = [
  { value: "ANY", label: "Any Horizon" },
  { value: "24H", label: "24 Hours" },
  { value: "30D", label: "30 Days" },
  { value: "12W", label: "12 Weeks" },
  { value: "12M", label: "12 Months" },
];

const CONDITION_TYPES = [
  {
    value: "direction_change",
    label: "Direction Changes",
    description: "Alert when forecast direction changes",
    needsValue: false,
  },
  {
    value: "direction_up",
    label: "Direction is Up",
    description: "Alert when forecast predicts upward movement",
    needsValue: false,
  },
  {
    value: "direction_down",
    label: "Direction is Down",
    description: "Alert when forecast predicts downward movement",
    needsValue: false,
  },
  {
    value: "confidence_above",
    label: "Confidence Above",
    description: "Alert when confidence exceeds threshold",
    needsValue: true,
    unit: "%",
    min: 0,
    max: 100,
  },
  {
    value: "confidence_below",
    label: "Confidence Below",
    description: "Alert when confidence drops below threshold",
    needsValue: true,
    unit: "%",
    min: 0,
    max: 100,
  },
  {
    value: "expected_move_above",
    label: "Expected Move Above",
    description: "Alert when expected price change exceeds threshold",
    needsValue: true,
    unit: "%",
    min: -100,
    max: 100,
  },
  {
    value: "expected_move_below",
    label: "Expected Move Below",
    description: "Alert when expected price change drops below threshold",
    needsValue: true,
    unit: "%",
    min: -100,
    max: 100,
  },
];

const CreateAlertModal = ({
  isOpen,
  onClose,
  onCreate,
  initialMarket,
}: CreateAlertModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMarket, setSelectedMarket] = useState<{
    symbol: string;
    name: string;
    id: number;
  } | null>(initialMarket || null);
  const [horizon, setHorizon] = useState<Horizon | "ANY">("ANY");
  const [conditionType, setConditionType] = useState(CONDITION_TYPES[0].value);
  const [conditionValue, setConditionValue] = useState<number>(50);
  const [isRecurring, setIsRecurring] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialMarket) {
      setSelectedMarket(initialMarket);
    }
  }, [initialMarket]);

  const selectedCondition = CONDITION_TYPES.find(
    (c) => c.value === conditionType
  );

  const handleSubmit = async () => {
    if (!selectedMarket || !selectedMarket.id) {
      setError("Please select a market");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data: CreateAlertData = {
        market: selectedMarket.id,
        horizon,
        condition_type: conditionType,
        is_recurring: isRecurring,
      };

      if (selectedCondition?.needsValue) {
        data.condition_value = conditionValue;
      }

      console.log("Submitting data:", data);

      await onCreate(data);
      onClose();

      // Reset form
      setSelectedMarket(null);
      setHorizon("ANY");
      setConditionType(CONDITION_TYPES[0].value);
      setConditionValue(50);
    } catch (err: any) {
      console.error("Failed to create alert:", err);
      setError(err?.message || "Failed to create alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      <MarketSelectorModal
        selected={selectedMarket || { symbol: "", name: "" }}
        onSelect={(market) => {
          console.log("Market selected:", market);
          setSelectedMarket(
            market as { symbol: string; name: string; id: number }
          );
          setIsMarketModalOpen(false);
        }}
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Create Alert
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
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

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="mt-6 space-y-5">
            {/* Market Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Market
              </label>
              <button
                onClick={() => setIsMarketModalOpen(true)}
                className="mt-1.5 flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                {selectedMarket ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-black"
                      style={{ backgroundColor: "var(--brand)" }}
                    >
                      {selectedMarket.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {selectedMarket.symbol}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {selectedMarket.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-neutral-500">Select a market...</span>
                )}
                <svg
                  className="h-5 w-5 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* Horizon */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Forecast Horizon
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {HORIZONS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setHorizon(h.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      horizon === h.value
                        ? "text-black"
                        : "border border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                    style={
                      horizon === h.value
                        ? { backgroundColor: "var(--brand)" }
                        : {}
                    }
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Condition
              </label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {CONDITION_TYPES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {selectedCondition && (
                <p className="mt-1.5 text-xs text-neutral-500">
                  {selectedCondition.description}
                </p>
              )}
            </div>

            {/* Condition Value */}
            {selectedCondition?.needsValue && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Threshold Value
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(Number(e.target.value))}
                    min={selectedCondition.min}
                    max={selectedCondition.max}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <span className="text-neutral-500">
                    {selectedCondition.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Options */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Recurring alert (trigger multiple times)
                </span>
              </label>
              <p className="mt-1.5 text-xs text-neutral-500">
                Email notifications controlled in Settings → Notifications
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedMarket}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {isSubmitting ? "Creating..." : "Create Alert"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CreateAlertModal;
