"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NAV_ITEMS,
  BOTTOM_NAV_ITEMS,
  NavItem,
} from "../../config/Appnavigation";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const AppSidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AppSidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/app/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some((child) => pathname === child.href);
  };

  const NavItemComponent = ({
    item,
    isBottom = false,
  }: {
    item: NavItem;
    isBottom?: boolean;
  }) => {
    const active = isActive(item.href);
    const childActive = isChildActive(item);
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;
    const showAsActive = active || childActive;

    return (
      <div>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.label)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              showAsActive
                ? "bg-[rgba(4,236,58,0.1)] text-neutral-900 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            <span
              className={`shrink-0 transition-colors duration-200 ${
                showAsActive
                  ? "text-[var(--brand)]"
                  : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
              }`}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
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
            onClick={onCloseMobile}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              showAsActive
                ? "bg-[rgba(4,236,58,0.1)] text-neutral-900 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            <span
              className={`shrink-0 transition-colors duration-200 ${
                showAsActive
                  ? "text-[var(--brand)]"
                  : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
              }`}
            >
              {item.icon}
            </span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        )}

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-8 mt-1 space-y-1 border-l border-neutral-200 pl-3 dark:border-neutral-700">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onCloseMobile}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    pathname === child.href
                      ? "font-medium text-[var(--brand)]"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/app/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-black"
            style={{ backgroundColor: "var(--brand)" }}
          >
            N
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              <span style={{ color: "var(--brand)" }}>ordict</span>
            </span>
          )}
        </Link>

        {/* Collapse button - desktop only */}
        <button
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 lg:block"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavItemComponent key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="border-t border-neutral-200 px-3 py-4 dark:border-neutral-800">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItemComponent key={item.label} item={item} isBottom />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-neutral-200 bg-white transition-transform duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-900 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 lg:block ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
