"use client";

import { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <AppHeader
        title={title}
        subtitle={subtitle}
        isCollapsed={isCollapsed}
        onOpenMobile={() => setIsMobileOpen(true)}
      />

      {/* Main content */}
      <main
        className={`min-h-[calc(100vh-4rem)] transition-all duration-300 ${
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
