"use client";

import { ThemeToggle } from "../layout";
import {
  MobileMenuButton,
  NotificationButton,
  PageTitle,
  UserMenu,
} from "./sections/header";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  isCollapsed: boolean;
  onOpenMobile: () => void;
}

const AppHeader = ({
  title,
  subtitle,
  isCollapsed,
  onOpenMobile,
}: AppHeaderProps) => {
  return (
    <header
      className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/95 md:px-6 ${
        isCollapsed ? "lg:pl-[88px]" : "lg:pl-[272px]"
      }`}
    >
      {/* Left side - Mobile menu + Title */}
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onOpenMobile} />
        <PageTitle title={title} subtitle={subtitle} />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationButton hasUnread />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
