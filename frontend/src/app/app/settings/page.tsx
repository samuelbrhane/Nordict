"use client";

import { AppLayout } from "@/components/app";
import {
  SettingsHeader,
  ProfileSection,
  PasswordSection,
  SessionsSection,
  DangerZone,
} from "@/components/app/sections/settings";

const SettingsAccountPage = () => {
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
