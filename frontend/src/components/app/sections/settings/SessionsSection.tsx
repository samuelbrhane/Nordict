"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { AnimatedCard } from "../dashboard";

interface Session {
  id: number;
  device: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  last_active_display: string;
  is_current: boolean;
}

const SessionsSection = () => {
  const { user, getSessions, revokeSession, revokeAllSessions, logout } =
    useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSessions = user?.plan_limits?.max_sessions;

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (session: Session) => {
    setRevokingId(session.id);
    setError(null);

    try {
      await revokeSession(session.id);

      // If revoking current session, log out
      if (session.is_current) {
        logout();
        return;
      }

      setSessions((prev) => prev.filter((s) => s.id !== session.id));
    } catch (err) {
      setError("Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    setError(null);

    try {
      await revokeAllSessions();
      // Revoke all includes current, so log out
      logout();
    } catch (err) {
      setError("Failed to revoke sessions");
      setRevokingAll(false);
    }
  };

  const getDeviceIcon = (os: string) => {
    const lowerOs = os.toLowerCase();
    if (
      lowerOs.includes("ios") ||
      lowerOs.includes("iphone") ||
      lowerOs.includes("ipad")
    ) {
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-4 w-4"
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
    );
  };

  const otherSessions = sessions.filter((s) => !s.is_current);

  return (
    <AnimatedCard delay={150}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Active Sessions
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {maxSessions
                ? `${sessions.length} of ${maxSessions} devices used`
                : "Devices where you're logged in"}
            </p>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Devices where you're logged in
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAll}
              disabled={revokingAll}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
            >
              {revokingAll ? "Signing out..." : "Sign out all devices"}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              No active sessions
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                    {getDeviceIcon(session.os)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {session.device}
                      </p>
                      {session.is_current && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-xs font-medium text-black"
                          style={{ backgroundColor: "var(--brand)" }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {session.location ||
                        session.ip_address ||
                        "Unknown location"}{" "}
                      · {session.last_active_display}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(session)}
                  disabled={revokingId === session.id}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400"
                >
                  {revokingId === session.id
                    ? "Revoking..."
                    : session.is_current
                    ? "Sign out"
                    : "Revoke"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default SessionsSection;
