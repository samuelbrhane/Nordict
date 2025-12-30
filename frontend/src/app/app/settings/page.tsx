"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppLayout, LoadingSpinner } from "@/components/app";
import {
  SettingsHeader,
  ProfileSection,
  PasswordSection,
  SessionsSection,
  DangerZone,
} from "@/components/app/sections/settings";

const SettingsAccountPage = () => {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const hasRefreshed = useRef(false);

  // Refresh ONCE when page mounts
  useEffect(() => {
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      setIsLoading(true);
      refreshUser().finally(() => setIsLoading(false));
    }
  }, []);

  // Show loading spinner
  if (isLoading) {
    return (
      <AppLayout title="" subtitle="">
        <LoadingSpinner text="Loading..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <SettingsHeader />
        <ProfileSection />
        <PasswordSection />
        <SessionsSection />
        <DangerZone />
      </div>
    </AppLayout>
  );
};

export default SettingsAccountPage;
