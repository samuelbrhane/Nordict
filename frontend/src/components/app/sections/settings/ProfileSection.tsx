"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileAvatar, ProfileField, ProfileActions } from ".";
import { TIMEZONES, getTimezoneLabel } from "@/config/timezones";
import { AnimatedCard } from "../dashboard";

const ProfileSection = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    first_name: "",
    last_name: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      setEditedProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        company: user.company || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        company: user.company || "",
      });
    }
    setError(null);
    setIsEditing(false);
  };

  const updateField =
    (field: keyof typeof editedProfile) => (value: string) => {
      setEditedProfile((prev) => ({ ...prev, [field]: value }));
    };

  if (!user) return null;

  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
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

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <ProfileAvatar
            firstName={editedProfile.first_name}
            lastName={editedProfile.last_name}
          />

          <div className="flex-1 space-y-3">
            {/* Name fields */}
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="First Name"
                value={
                  isEditing ? editedProfile.first_name : user.first_name || ""
                }
                isEditing={isEditing}
                onChange={updateField("first_name")}
              />
              <ProfileField
                label="Last Name"
                value={
                  isEditing ? editedProfile.last_name : user.last_name || ""
                }
                isEditing={isEditing}
                onChange={updateField("last_name")}
              />
            </div>

            {/* Email */}
            <ProfileField
              label="Email"
              value={user.email}
              isEditing={isEditing}
              disabled
              hint="Contact support to change your email"
            />

            {/* Company & Timezone */}
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileField
                label="Company"
                value={isEditing ? editedProfile.company : user.company || ""}
                isEditing={isEditing}
                onChange={updateField("company")}
                placeholder="Optional"
              />
              <ProfileField
                label="Timezone"
                value={getTimezoneLabel(user.timezone)}
                isEditing={false}
                disabled
                hint="Automatically detected from your browser"
              />
            </div>

            {/* Actions */}
            {isEditing && (
              <ProfileActions
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ProfileSection;
