"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem as NavItemType } from "@/config/Appnavigation";

interface NavItemProps {
  item: NavItemType;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggleExpand: (label: string) => void;
  onCloseMobile: () => void;
}

const NavItem = ({
  item,
  isCollapsed,
  isExpanded,
  onToggleExpand,
  onCloseMobile,
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/app/dashboard") {
      return pathname === href;
    }

    if (href === "/app/forecasts") {
      return pathname === href;
    }

    if (href === "/app/forecast/compare") {
      return pathname === href;
    }

    if (href.startsWith("/app/forecast/") && !href.includes("compare")) {
      return (
        pathname.startsWith("/app/forecast/") &&
        pathname !== "/app/forecasts" &&
        !pathname.includes("compare")
      );
    }

    // Default - starts with
    return pathname.startsWith(href);
  };

  const isChildActive = () => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.href);
  };

  const active = isActive(item.href);
  const childActive = isChildActive();
  const hasChildren = item.children && item.children.length > 0;
  const showAsActive = active || childActive;

  // Handle child click - don't close mobile, keep expanded
  const handleChildClick = () => {
    // Only close mobile menu, dropdown stays open
    onCloseMobile();
  };

  // Handle parent click for items without children
  const handleParentClick = () => {
    onCloseMobile();
  };

  return (
    <div className="group/nav">
      {hasChildren ? (
        <button
          onClick={() => onToggleExpand(item.label)}
          className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            showAsActive
              ? "bg-[var(--brand)]/10 text-neutral-900 dark:text-white"
              : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-white"
          }`}
        >
          {/* Hover glow effect */}
          <span
            className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              showAsActive
                ? ""
                : "bg-gradient-to-r from-[var(--brand)]/5 to-transparent"
            }`}
          />

          {/* Active indicator bar */}
          {showAsActive && (
            <span
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all duration-200"
              style={{ backgroundColor: "var(--brand)" }}
            />
          )}

          <span
            className={`relative shrink-0 transition-all duration-200 ${
              showAsActive
                ? "text-[var(--brand)] scale-110"
                : "text-neutral-400 group-hover:text-[var(--brand)] group-hover:scale-110 dark:text-neutral-500"
            }`}
          >
            {item.icon}
          </span>
          {!isCollapsed && (
            <>
              <span className="relative flex-1 text-left">{item.label}</span>
              <svg
                className={`relative h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>
      ) : (
        <Link
          href={item.href}
          onClick={handleParentClick}
          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            showAsActive
              ? "bg-[var(--brand)]/10 text-neutral-900 dark:text-white"
              : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-white"
          }`}
        >
          {/* Hover glow effect */}
          <span
            className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              showAsActive
                ? ""
                : "bg-gradient-to-r from-[var(--brand)]/5 to-transparent"
            }`}
          />

          {/* Active indicator bar */}
          {showAsActive && (
            <span
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all duration-200"
              style={{ backgroundColor: "var(--brand)" }}
            />
          )}

          <span
            className={`relative shrink-0 transition-all duration-200 ${
              showAsActive
                ? "text-[var(--brand)] scale-110"
                : "text-neutral-400 group-hover:text-[var(--brand)] group-hover:scale-110 dark:text-neutral-500"
            }`}
          >
            {item.icon}
          </span>
          {!isCollapsed && <span className="relative">{item.label}</span>}
        </Link>
      )}

      {/* Children dropdown - no transition, just show/hide */}
      {hasChildren && !isCollapsed && isExpanded && (
        <div className="overflow-hidden">
          <div className="relative ml-8 mt-1 space-y-0.5 pl-3">
            {/* Vertical line */}
            <span
              className="absolute left-0 top-0 h-full w-px"
              style={{
                background: `linear-gradient(to bottom, var(--brand), transparent)`,
              }}
            />

            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={handleChildClick}
                className={`group/child relative block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  pathname === child.href
                    ? "font-medium text-[var(--brand)] bg-[var(--brand)]/5"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/50"
                }`}
              >
                {/* Active dot indicator */}
                {pathname === child.href && (
                  <span
                    className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}

                {/* Hover arrow */}
                <span
                  className={`absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200 ${
                    pathname !== child.href
                      ? "group-hover/child:opacity-100 group-hover/child:-left-1"
                      : ""
                  }`}
                  style={{ color: "var(--brand)" }}
                >
                  ›
                </span>

                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;
