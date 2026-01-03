"use client";

import { Header, Footer } from ".";
import { useAuth } from "@/context/auth/AuthProvider";
import { LoadingSpinner } from "../app";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
