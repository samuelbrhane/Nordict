"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Not logged in → go to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if trial expired and no active subscription
    if (user) {
      const hasAccess = user.is_trial_active || user.is_subscription_active;

      // Allow access to upgrade/billing pages even without subscription
      const allowedPaths = ["/app/settings/billing", "/app/upgrade"];
      const isAllowedPath = allowedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (!hasAccess && !isAllowedPath) {
        router.push("/app/upgrade");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Block access if trial expired and no subscription (except allowed paths)
  if (user) {
    const hasAccess = user.is_trial_active || user.is_subscription_active;
    const allowedPaths = ["/app/settings/billing", "/app/upgrade"];
    const isAllowedPath = allowedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (!hasAccess && !isAllowedPath) {
      return null;
    }
  }

  return <>{children}</>;
}
