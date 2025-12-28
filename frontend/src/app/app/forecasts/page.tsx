"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import { AnimatedCard } from "@/components/app/sections/dashboard";
import {
  ForecastsHeader,
  MarketCard,
  MarketTable,
  Pagination,
} from "@/components/app/sections/forecasts";
import { Market, Horizon, INITIAL_MARKETS } from "@/config/marketsData";

const ITEMS_PER_PAGE = 8;

const ForecastsOverviewPage = () => {
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("7D");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleFavorite = (symbol: string) => {
    setMarkets(
      markets.map((m) =>
        m.symbol === symbol ? { ...m, isFavorite: !m.isFavorite } : m
      )
    );
  };

  const filteredMarkets = markets.filter((m) => {
    if (
      search &&
      !m.symbol.toLowerCase().includes(search.toLowerCase()) &&
      !m.name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (category === "favorites") return m.isFavorite;
    if (category !== "all" && m.category !== category) return false;
    return true;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMarkets.length / ITEMS_PER_PAGE)
  );
  const paginatedMarkets = filteredMarkets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <ForecastsHeader
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          horizon={horizon}
          onHorizonChange={setHorizon}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedMarkets.map((market, index) => (
              <AnimatedCard key={market.symbol} delay={50 + index * 30}>
                <MarketCard
                  market={market}
                  horizon={horizon}
                  onToggleFavorite={toggleFavorite}
                />
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <MarketTable
            markets={paginatedMarkets}
            horizon={horizon}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {filteredMarkets.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-12 text-center dark:border-neutral-700">
            <p className="text-neutral-500 dark:text-neutral-400">
              No markets found
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMarkets.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </AppLayout>
  );
};

export default ForecastsOverviewPage;
