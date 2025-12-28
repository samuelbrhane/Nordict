"use client";

import Link from "next/link";
import { ThemeToggle } from "../layout";

const AuthHeader = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Logo - links back to landing */}
        <Link href="/" className="group flex items-center">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-xl font-bold text-black shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: "var(--brand)" }}
          >
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 ml-2">
            <span style={{ color: "var(--brand)" }}>Nordict</span>
          </span>
        </Link>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AuthHeader;
