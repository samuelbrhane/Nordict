"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";
import {
  SettingsHeader,
  ProfileSection,
  PasswordSection,
  SessionsSection,
  DangerZone,
} from "@/components/app/sections/settings";

const SettingsAccountPage = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Acme Trading Co.",
    timezone: "America/New_York",
  });

  return (
    <AppLayout title="" subtitle="">
      <div className="space-y-6">
        <SettingsHeader />
        <ProfileSection profile={profile} onProfileChange={setProfile} />
        <PasswordSection />
        <SessionsSection />
        <DangerZone />
      </div>
    </AppLayout>
  );
};

export default SettingsAccountPage;
