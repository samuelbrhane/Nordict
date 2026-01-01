// components/app/sections/forecasts/ForecastsHeader.tsx

"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";
import { Horizon } from "@/lib/hooks/useDashboardKpi";

const HORIZONS: Horizon[] = ["24H", "30D", "12W", "12M"];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
];

interface ForecastsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (category: "all" | "favorites") => void;
  horizon: Horizon;
  onHorizonChange: (horizon: Horizon) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  lastUpdatedAgo?: string;
}

const ForecastsHeader = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  horizon,
  onHorizonChange,
  viewMode,
  onViewModeChange,
  lastUpdatedAgo,
}: ForecastsHeaderProps) => {
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = () => {
    onSearchChange(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchInput("");
    onSearchChange("");
  };

  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Forecasts
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Market predictions and signals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                {HORIZONS.map((h) => (
                  <button
                    key={h}
                    onClick={() => onHorizonChange(h)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      horizon === h
                        ? "text-black shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                    style={
                      horizon === h ? { backgroundColor: "var(--brand)" } : {}
                    }
                  >
                    {h}
                  </button>
                ))}
              </div>
              {lastUpdatedAgo && (
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {lastUpdatedAgo}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-sm transition-colors focus:border-[var(--brand)] focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800 sm:w-52"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Search
                </button>
                {search && (
                  <button
                    onClick={handleClear}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  }`}
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onViewModeChange("table")}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === "table"
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  }`}
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    onCategoryChange(cat.id as "all" | "favorites")
                  }
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                    category === cat.id
                      ? "border-[var(--brand)] bg-[rgba(4,236,58,0.1)] text-[var(--brand)]"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ForecastsHeader;
