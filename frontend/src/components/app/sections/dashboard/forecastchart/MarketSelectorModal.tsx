"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Star, Loader2, Grid3X3, List } from "lucide-react";
import { api } from "@/lib/api";

interface Market {
  id: number;
  symbol: string;
  name: string;
  category: string;
  is_featured: boolean;
}

interface MarketsResponse {
  results: Market[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

interface MarketSelectorModalProps {
  selected: { symbol: string; name: string };
  onSelect: (market: { symbol: string; name: string }) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MarketSelectorModal = ({
  selected,
  onSelect,
  isOpen,
  onClose,
}: MarketSelectorModalProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    MarketsResponse["pagination"] | null
  >(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const PAGE_SIZE = 12;

  // Fetch markets with search and pagination
  const fetchMarkets = useCallback(
    async (pageNum: number, searchQuery: string) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          page_size: PAGE_SIZE.toString(),
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await api.get<MarketsResponse>(
          `/api/v1/markets/?${params.toString()}&with_forecasts=true`
        );

        setMarkets(response.results);
        setPagination(response.pagination);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch markets:", error);
        setMarkets([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      fetchMarkets(1, searchQuery);
    }
  }, [isOpen, searchQuery, fetchMarkets]);

  // 3. Handle search submit
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  // Handle market selection
  const handleSelect = (market: Market) => {
    onSelect(market);
    onClose();
  };
  // Add this function after handleSearch
  const handlePageChange = (newPage: number) => {
    fetchMarkets(newPage, searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
      setSearchQuery("");
      setPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Select Market
          </h2>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-neutral-200 p-1 dark:border-neutral-600">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-600 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-600 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by symbol or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Search
            </button>
          </div>
          {searchQuery && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Results for: "{searchQuery}"
              </span>
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                }}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400">
                No markets found
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <MarketGrid
              markets={markets}
              selected={selected}
              onSelect={handleSelect}
            />
          ) : (
            <MarketTable
              markets={markets}
              selected={selected}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
            <Pagination
              currentPage={page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total_count}
              itemsPerPage={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// Market Grid Component
// =============================================================================

const MarketGrid = ({
  markets,
  selected,
  onSelect,
}: {
  markets: Market[];
  selected: { symbol: string; name: string };
  onSelect: (market: Market) => void;
}) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
    {markets.map((market) => {
      const isSelected = selected.symbol === market.symbol;
      return (
        <button
          key={market.symbol}
          onClick={() => onSelect(market)}
          className={`group relative flex flex-col items-center rounded-xl border p-4 transition-all ${
            isSelected
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
          }`}
        >
          {/* Featured badge */}
          {market.is_featured && (
            <Star
              className="absolute right-2 top-2 h-3.5 w-3.5 text-amber-400"
              fill="currentColor"
            />
          )}

          {/* Icon */}
          <div
            className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-black transition-transform group-hover:scale-110"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {market.symbol.slice(0, 2)}
          </div>

          {/* Info */}
          <p
            className={`text-sm font-semibold ${
              isSelected
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-neutral-900 dark:text-white"
            }`}
          >
            {market.symbol}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {market.name}
          </p>

          {/* Selected indicator */}
          {isSelected && (
            <div
              className="absolute bottom-2 right-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--brand)" }}
            />
          )}
        </button>
      );
    })}
  </div>
);

// =============================================================================
// Market Table Component
// =============================================================================
const MarketTable = ({
  markets,
  selected,
  onSelect,
}: {
  markets: Market[];
  selected: { symbol: string; name: string };
  onSelect: (market: Market) => void;
}) => (
  <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Market
          </th>
          <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Featured
          </th>
          <th className="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {markets.map((market) => {
          const isSelected = selected.symbol === market.symbol;
          return (
            <tr
              key={market.symbol}
              onClick={() => onSelect(market)}
              className={`cursor-pointer transition-colors ${
                isSelected
                  ? "bg-emerald-50 dark:bg-emerald-900/20"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {market.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-neutral-900 dark:text-white"
                      }`}
                    >
                      {market.symbol}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {market.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-center">
                {market.is_featured && (
                  <Star
                    className="mx-auto h-4 w-4 text-amber-400"
                    fill="currentColor"
                  />
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {isSelected && (
                  <div
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// =============================================================================
// Pagination Component
// =============================================================================

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      {/* Info */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Showing {startItem}-{endItem} of {totalItems} markets
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-neutral-400 dark:text-neutral-500"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`h-8 min-w-[2rem] rounded-lg text-sm font-medium transition-all ${
                currentPage === pageNum
                  ? "text-black"
                  : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              }`}
              style={
                currentPage === pageNum
                  ? { backgroundColor: "var(--brand)" }
                  : {}
              }
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-neutral-700"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MarketSelectorModal;
