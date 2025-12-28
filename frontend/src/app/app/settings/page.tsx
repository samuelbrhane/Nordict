"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app";

const SettingsAccountPage = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Acme Trading Co.",
    timezone: "America/New_York",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsChangingPassword(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <AppLayout title="Account" subtitle="Manage your profile and security">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Profile Information
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Your personal details
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600"
              >
                Edit
              </button>
            )}
          </div>

          <div className="mt-6 flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-black"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-neutral-100 p-1.5 text-neutral-600 transition-colors hover:bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Form */}
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-neutral-900 dark:text-white">
                      {profile.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-neutral-900 dark:text-white">
                      {profile.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-2 text-sm text-neutral-900 dark:text-white">
                    {profile.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                ) : (
                  <p className="mt-2 text-sm text-neutral-900 dark:text-white">
                    {profile.company || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Timezone
                </label>
                {isEditing ? (
                  <select
                    value={profile.timezone}
                    onChange={(e) =>
                      setProfile({ ...profile, timezone: e.target.value })
                    }
                    className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Singapore">Singapore (SGT)</option>
                  </select>
                ) : (
                  <p className="mt-2 text-sm text-neutral-900 dark:text-white">
                    {profile.timezone.replace("_", " ").split("/")[1]} (
                    {profile.timezone.split("/")[0]})
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    {isSaving && (
                      <svg
                        className="h-4 w-4 animate-spin"
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
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Change Password
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Update your password regularly for better security
          </p>

          <div className="mt-6 max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
                className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={
                isChangingPassword ||
                !passwordForm.current ||
                !passwordForm.new ||
                !passwordForm.confirm
              }
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--brand)" }}
            >
              {isChangingPassword && (
                <svg
                  className="h-4 w-4 animate-spin"
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
              Update Password
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Active Sessions
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Devices where you're currently logged in
          </p>

          <div className="mt-6 space-y-3">
            {[
              {
                device: "Chrome on MacOS",
                location: "New York, US",
                lastActive: "Now",
                current: true,
              },
              {
                device: "Safari on iPhone",
                location: "New York, US",
                lastActive: "2 hours ago",
                current: false,
              },
            ].map((session, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-700">
                    <svg
                      className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {session.device}
                      </p>
                      {session.current && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-xs font-medium text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
            Danger Zone
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            Irreversible actions
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-200">
                Delete Account
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition-all hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsAccountPage;
