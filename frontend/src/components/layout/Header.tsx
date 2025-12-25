"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS } from "@/config/navigation";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);

  // Close mobile menu when switching to desktop size
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileOpenIndex(null);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => {
            setMobileOpen(false);
            setMobileOpenIndex(null);
          }}
        >
          <Image
            src="/main_logo.png"
            alt="ChainForecast"
            width={46}
            height={46}
            priority
          />
          <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Chain<span className="text-(--brand)">Forecast</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item, index) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenIndex(index)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                <button
                  type="button"
                  className="group flex items-center gap-1 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-(--brand) dark:text-neutral-200 dark:hover:text-(--brand)"
                  aria-haspopup="menu"
                  aria-expanded={openIndex === index}
                >
                  {item.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-neutral-400 transition-all duration-200 group-hover:text-(--brand) ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  className={`absolute left-1/2 top-full pt-4 -translate-x-1/2 transition-all duration-200 ${
                    openIndex === index
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="w-64 overflow-hidden rounded-xl border border-neutral-200/50 bg-white/80 shadow-xl shadow-neutral-200/50 backdrop-blur-xl dark:border-neutral-700/50 dark:bg-neutral-900/80 dark:shadow-neutral-900/50">
                    <ul className="p-2">
                      {item.children.map((child, childIndex) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-all duration-150 hover:bg-(--brand)/10 hover:text-(--brand) dark:text-neutral-300 dark:hover:bg-(--brand)/10 dark:hover:text-(--brand)"
                            style={{
                              transitionDelay:
                                openIndex === index
                                  ? `${childIndex * 50}ms`
                                  : "0ms",
                            }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-colors duration-150 group-hover/item:bg-(--brand) dark:bg-neutral-600" />
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-(--brand) dark:text-neutral-200 dark:hover:text-(--brand)"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/get-started"
            className="rounded-md bg-(--brand) px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get started
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {/* hamburger icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden dark:border-neutral-800 dark:bg-black">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, index) => {
                if (item.children) {
                  const isOpen = mobileOpenIndex === index;
                  return (
                    <div
                      key={item.label}
                      className="overflow-hidden rounded-xl border border-neutral-200/50 dark:border-neutral-700/50"
                    >
                      <button
                        type="button"
                        className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-neutral-800 transition-colors duration-200 hover:text-(--brand) dark:text-neutral-100 dark:hover:text-(--brand)"
                        onClick={() =>
                          setMobileOpenIndex(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                      >
                        {item.label}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`text-neutral-400 transition-all duration-200 group-hover:text-(--brand) ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-neutral-200/50 bg-neutral-50/50 dark:border-neutral-700/50 dark:bg-neutral-900/50">
                          <ul className="p-2">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-all duration-150 hover:bg-(--brand)/10 hover:text-(--brand) dark:text-neutral-300 dark:hover:bg-(--brand)/10 dark:hover:text-(--brand)"
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileOpenIndex(null);
                                  }}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-colors duration-150 group-hover/item:bg-(--brand) dark:bg-neutral-600" />
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 transition-colors duration-200 hover:bg-(--brand)/10 hover:text-(--brand) dark:text-neutral-100 dark:hover:text-(--brand)"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileOpenIndex(null);
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 flex flex-col gap-3">
              {/* Sign in & Get started - side by side */}
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-center text-sm font-medium text-neutral-800 transition-colors duration-200 hover:border-(--brand) hover:text-(--brand) dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-(--brand) dark:hover:text-(--brand)"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileOpenIndex(null);
                  }}
                >
                  Sign in
                </Link>

                <Link
                  href="/get-started"
                  className="flex-1 rounded-xl bg-(--brand) px-4 py-3 text-center text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileOpenIndex(null);
                  }}
                >
                  Get started
                </Link>
              </div>

              {/* Theme toggle - compact with both icons */}
              <div className="flex justify-center">
                <div className="inline-flex overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={() => {
                      document.documentElement.classList.remove("dark");
                      localStorage.setItem("theme", "light");
                    }}
                    className="p-2.5 text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-(--brand) dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-(--brand)"
                    aria-label="Light mode"
                  >
                    {/* Sun icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  </button>
                  <div className="w-px bg-neutral-200 dark:bg-neutral-700" />
                  <button
                    type="button"
                    onClick={() => {
                      document.documentElement.classList.add("dark");
                      localStorage.setItem("theme", "dark");
                    }}
                    className="p-2.5 text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-(--brand) dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-(--brand)"
                    aria-label="Dark mode"
                  >
                    {/* Moon icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
