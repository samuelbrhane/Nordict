"use client";

import { useState } from "react";
import AnimatedCard from "../dashboard/AnimatedCard";

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  timezone: string;
}

interface ProfileSectionProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

const ProfileSection = ({ profile, onProfileChange }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onProfileChange(editedProfile);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Profile Information
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Your personal details
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Edit
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl text-xl font-bold text-black"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        firstName: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                    {profile.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        lastName: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                    {profile.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {profile.email}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.company}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        company: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                    {profile.company || "—"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Timezone
                </label>
                {isEditing ? (
                  <select
                    value={editedProfile.timezone}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        timezone: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="America/New_York">Eastern (ET)</option>
                    <option value="America/Chicago">Central (CT)</option>
                    <option value="America/Denver">Mountain (MT)</option>
                    <option value="America/Los_Angeles">Pacific (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                    {profile.timezone.split("/")[1]?.replace("_", " ")}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  {isSaving && (
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ProfileSection;
