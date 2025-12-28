"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { USER_MENU_ITEMS, SIGN_OUT_ITEM } from "./userMenuItems";

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userInitial?: string;
}

const UserMenu = ({
  userName = "Samuel",
  userEmail = "samuel@example.com",
  userInitial = "S",
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    // TODO: Implement sign out
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-black"
          style={{ backgroundColor: "var(--brand)" }}
        >
          {userInitial}
        </div>
        <svg
          className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {/* User info */}
          <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {userName}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {userEmail}
            </p>
          </div>

          {/* Menu items - rendered with loop */}
          <div className="p-2">
            {USER_MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-neutral-200 p-2 dark:border-neutral-700">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              {SIGN_OUT_ITEM.icon}
              {SIGN_OUT_ITEM.label}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
