"use client";

import Link from "next/link";

interface SidebarLogoProps {
  isCollapsed: boolean;
  onCloseMobile: () => void;
}

const SidebarLogo = ({ isCollapsed, onCloseMobile }: SidebarLogoProps) => {
  return (
    <Link
      href="/app/dashboard"
      onClick={onCloseMobile}
      className="group flex items-center gap-2"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-black transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: "var(--brand)" }}
      >
        N
      </div>
      {!isCollapsed && (
        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          <span
            className="transition-colors duration-200 group-hover:brightness-110"
            style={{ color: "var(--brand)" }}
          >
            ordict
          </span>
        </span>
      )}
    </Link>
  );
};

export default SidebarLogo;
