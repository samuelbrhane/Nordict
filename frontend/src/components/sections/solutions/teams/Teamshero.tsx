"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TeamsHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      initials: "JK",
      name: "James K.",
      role: "Lead Analyst",
      status: "online",
    },
    { initials: "SR", name: "Sarah R.", role: "Researcher", status: "online" },
    { initials: "MT", name: "Mike T.", role: "Portfolio Mgr", status: "away" },
    { initials: "AL", name: "Anna L.", role: "Risk Analyst", status: "online" },
  ];

  const recentActivity = [
    {
      user: "JK",
      action: "Created alert",
      target: "BTC > 75% confidence",
      time: "2m ago",
    },
    {
      user: "SR",
      action: "Shared view",
      target: "Weekly outlook report",
      time: "15m ago",
    },
    {
      user: "AL",
      action: "Commented on",
      target: "ETH risk assessment",
      time: "1h ago",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-20 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-10 dark:opacity-20" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        {/* Breadcrumb */}
        <div
          className={`mb-6 flex items-center gap-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <Link
            href="/"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-500 transition-colors  dark:text-neutral-400 dark:hover:text-white">
            Solutions
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            For Teams
          </span>
        </div>

        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Solutions
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <div>
            {/* Headline */}
            <h1
              className={`text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Research{" "}
              <span
                className="inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand) 0%, rgba(4,236,58,0.7) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                together
              </span>
              , decide faster
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Shared dashboards, collaborative alerts, and unified views help
              your team{" "}
              <span className="font-medium text-neutral-900 dark:text-white">
                stay aligned on market outlook
              </span>{" "}
              without endless meetings.
            </p>

            {/* Key benefits */}
            <div
              className={`mt-8 space-y-3 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {[
                "Shared dashboards with live forecasts",
                "Team alerts and notification channels",
                "Role-based permissions and access",
                "Audit logs and compliance features",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                  >
                    <svg
                      className="h-3 w-3"
                      style={{ color: "var(--brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <Link
                href="#features"
                className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  Explore features
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Team workspace mockup */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Team Workspace
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Acme Research Group
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {teamMembers.map((member, i) => (
                    <div
                      key={member.initials}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-50 text-xs font-bold dark:border-neutral-900"
                      style={{
                        backgroundColor:
                          i === 0
                            ? "var(--brand)"
                            : i === 1
                            ? "#3b82f6"
                            : i === 2
                            ? "#8b5cf6"
                            : "#f59e0b",
                        color: i === 0 ? "black" : "white",
                        zIndex: 4 - i,
                      }}
                      title={member.name}
                    >
                      {member.initials}
                      {member.status === "online" && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-50 bg-green-500 dark:border-neutral-900" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team members list */}
              <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                  Team Members
                </p>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            member.status === "online"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {member.name}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                  Recent Activity
                </p>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: "var(--brand)",
                          color: "black",
                        }}
                      >
                        {activity.user}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {activity.action}
                          </span>{" "}
                          <span className="text-neutral-500">
                            {activity.target}
                          </span>
                        </p>
                        <p className="text-xs text-neutral-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div
              className="absolute -bottom-8 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamsHero;
