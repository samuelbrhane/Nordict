// app/app/forecasts/page.tsx

"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import AnimatedCard from "@/components/app/sections/dashboard/AnimatedCard";
import ForecastsHeader from "@/components/app/sections/forecasts/ForecastsHeader";
import MarketCard from "@/components/app/sections/forecasts/MarketCard";
import MarketTable from "@/components/app/sections/forecasts/MarketTable";
import Pagination from "@/components/app/sections/forecasts/Pagination";
import { Horizon } from "@/lib/hooks/useDashboardKpi";
import {
  useMarketsWithForecasts,
  useToggleFavorite,
} from "@/lib/hooks/useMarketsWithForecasts";

const ITEMS_PER_PAGE = 12;

const ForecastsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "favorites">("all");
  const [horizon, setHorizon] = useState<Horizon>("24H");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useMarketsWithForecasts({
    horizon,
    search,
    category,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  const { toggleFavorite } = useToggleFavorite();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: "all" | "favorites") => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (symbol: string) => {
    try {
      await toggleFavorite(symbol);
      refetch();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const markets = data?.results || [];
  const pagination = data?.pagination;

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        {/* <ForecastsHeader
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          horizon={horizon}
          onHorizonChange={setHorizon}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        /> */}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-emerald-500" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {markets.map((market, index) => (
              <AnimatedCard key={market.symbol} delay={50 + index * 30}>
                <MarketCard
                  market={market}
                  horizon={horizon}
                  onToggleFavorite={handleToggleFavorite}
                />
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <MarketTable
            markets={markets}
            horizon={horizon}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {!isLoading && markets.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center dark:border-neutral-700">
            <p className="text-neutral-500 dark:text-neutral-400">
              No markets found
            </p>
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total_count}
            itemsPerPage={pagination.page_size}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default ForecastsPage;
