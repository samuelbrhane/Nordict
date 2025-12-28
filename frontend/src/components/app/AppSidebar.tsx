"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/Appnavigation";
import {
  SidebarLogo,
  CollapseButton,
  NavItem,
  MobileOverlay,
} from "./sections/sidebar";

// Get initially expanded items based on current path (runs once)
const getInitialExpandedItems = (pathname: string): string[] => {
  const expanded: string[] = [];
  NAV_ITEMS.forEach((item) => {
    if (item.children) {
      const isChildActive = item.children.some((child) =>
        pathname.startsWith(child.href)
      );
      if (isChildActive) {
        expanded.push(item.label);
      }
    }
  });
  return expanded;
};

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

  // Initialize expanded items once based on current route - no useEffect needed
  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    getInitialExpandedItems(pathname)
  );

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header - Logo & Collapse */}
      <div className="flex h-16 items-center justify-between px-4">
        <SidebarLogo isCollapsed={isCollapsed} onCloseMobile={onCloseMobile} />
        <CollapseButton isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isCollapsed={isCollapsed}
            isExpanded={expandedItems.includes(item.label)}
            onToggleExpand={toggleExpanded}
            onCloseMobile={onCloseMobile}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <MobileOverlay isOpen={isMobileOpen} onClose={onCloseMobile} />

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
