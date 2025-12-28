"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Market, ModelVersion, Horizon } from "@/config/performanceData";

interface PerformanceHeaderProps {
  markets: Market[];
  selectedMarket: Market;
  onMarketChange: (market: Market) => void;
  versions: ModelVersion[];
  selectedVersion: ModelVersion;
  onVersionChange: (version: ModelVersion) => void;
  horizons: Horizon[];
  selectedHorizon: Horizon;
  onHorizonChange: (horizon: Horizon) => void;
}

const PerformanceHeader = ({
  markets,
  selectedMarket,
  onMarketChange,
  versions,
  selectedVersion,
  onVersionChange,
  horizons,
  selectedHorizon,
  onHorizonChange,
}: PerformanceHeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const marketButtonRef = useRef<HTMLButtonElement>(null);
  const versionButtonRef = useRef<HTMLButtonElement>(null);
  const [marketPos, setMarketPos] = useState({ top: 0, left: 0 });
  const [versionPos, setVersionPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMarketOpen && marketButtonRef.current) {
      const rect = marketButtonRef.current.getBoundingClientRect();
      setMarketPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isMarketOpen]);

  useEffect(() => {
    if (isVersionOpen && versionButtonRef.current) {
      const rect = versionButtonRef.current.getBoundingClientRect();
      setVersionPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isVersionOpen]);

  const closeAll = () => {
    setIsMarketOpen(false);
    setIsVersionOpen(false);
  };

  const marketDropdown = isMarketOpen && mounted && (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={closeAll} />
      <div
        className="fixed z-[9999] w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        style={{ top: marketPos.top, left: marketPos.left }}
      >
        <div className="p-2">
          {markets.map((market) => (
            <button
              key={market.symbol}
              onClick={() => {
                onMarketChange(market);
                setIsMarketOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedMarket.symbol === market.symbol
                  ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {market.symbol}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const versionDropdown = isVersionOpen && mounted && (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={closeAll} />
      <div
        className="fixed z-[9999] w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        style={{ top: versionPos.top, left: versionPos.left }}
      >
        <div className="p-2">
          {versions.map((version) => (
            <button
              key={version.id}
              onClick={() => {
                onVersionChange(version);
                setIsVersionOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedVersion.id === version.id
                  ? "bg-[rgba(4,236,58,0.1)] font-medium text-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              <span>{version.label}</span>
              <span className="text-xs text-neutral-400">{version.date}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Performance
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Model accuracy and validation metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                All systems operational
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                ref={marketButtonRef}
                onClick={() => {
                  setIsMarketOpen(!isMarketOpen);
                  setIsVersionOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {selectedMarket.symbol}
                </span>
                <svg
                  className={`h-4 w-4 text-neutral-400 transition-transform ${
                    isMarketOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <button
                ref={versionButtonRef}
                onClick={() => {
                  setIsVersionOpen(!isVersionOpen);
                  setIsMarketOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {selectedVersion.label}
                </span>
                <svg
                  className={`h-4 w-4 text-neutral-400 transition-transform ${
                    isVersionOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex w-fit rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
              {horizons.map((horizon) => (
                <button
                  key={horizon.id}
                  onClick={() => onHorizonChange(horizon)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedHorizon.id === horizon.id
                      ? "text-black shadow-sm"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                  style={
                    selectedHorizon.id === horizon.id
                      ? { backgroundColor: "var(--brand)" }
                      : {}
                  }
                >
                  {horizon.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(marketDropdown, document.body)}
      {mounted && createPortal(versionDropdown, document.body)}
    </AnimatedCard>
  );
};

export default PerformanceHeader;
