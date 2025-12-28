"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS } from "@/config/navigation";
import { ThemeToggle } from "../layout";

const Header = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header background
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-neutral-200 bg-white/95 backdrop-blur-lg shadow-sm dark:border-neutral-800 dark:bg-neutral-950/95"
          : "border-transparent bg-white/80 backdrop-blur dark:bg-neutral-950/80"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center"
          onClick={() => {
            setMobileOpen(false);
            setMobileOpenIndex(null);
          }}
        >
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-2xl font-bold text-black shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: "var(--brand)" }}
          >
            N
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100  ml-2">
            <span style={{ color: "var(--brand)" }}>ordict</span>
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
                  className="group flex items-center gap-1 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-[var(--brand)] dark:text-neutral-200 dark:hover:text-[var(--brand)]"
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
                    className={`text-neutral-400 transition-all duration-200 group-hover:text-[var(--brand)] ${
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
                  <div className="w-64 overflow-hidden rounded-xl border border-neutral-200/50 bg-white/95 shadow-xl shadow-neutral-200/50 backdrop-blur-xl dark:border-neutral-700/50 dark:bg-neutral-900/95 dark:shadow-neutral-900/50">
                    <ul className="p-2">
                      {item.children.map((child, childIndex) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-all duration-150 hover:bg-[rgba(4,236,58,0.1)] hover:text-[var(--brand)] dark:text-neutral-300 dark:hover:bg-[rgba(4,236,58,0.1)] dark:hover:text-[var(--brand)]"
                            style={{
                              transitionDelay:
                                openIndex === index
                                  ? `${childIndex * 50}ms`
                                  : "0ms",
                            }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-all duration-150 group-hover/item:bg-[var(--brand)] group-hover/item:scale-125 dark:bg-neutral-600" />
                            <span className="transition-colors">
                              {child.label}
                            </span>
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
                className="text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-[var(--brand)] dark:text-neutral-200 dark:hover:text-[var(--brand)]"
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
            className="text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:shadow-md hover:shadow-[var(--brand)]/20 active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="relative z-10">Get started</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button - Animated hamburger */}
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 lg:hidden dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <div className="flex h-4 w-5 flex-col items-center justify-center">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "translate-y-[3px] rotate-45" : "-translate-y-1"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "-translate-y-[3px] -rotate-45" : "translate-y-1"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Panel - Animated */}
      <div
        className={`overflow-hidden border-t transition-all duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "max-h-[calc(100vh-4rem)] border-neutral-200 dark:border-neutral-800"
            : "max-h-0 border-transparent"
        }`}
      >
        <div className="bg-white dark:bg-black">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, index) => {
                if (item.children) {
                  const isOpen = mobileOpenIndex === index;
                  return (
                    <div
                      key={item.label}
                      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                        isOpen
                          ? "border-neutral-300 dark:border-neutral-600"
                          : "border-neutral-200/50 dark:border-neutral-700/50"
                      }`}
                      style={{
                        transitionDelay: mobileOpen ? `${index * 50}ms` : "0ms",
                        opacity: mobileOpen ? 1 : 0,
                        transform: mobileOpen
                          ? "translateY(0)"
                          : "translateY(-8px)",
                      }}
                    >
                      <button
                        type="button"
                        className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-neutral-800 transition-colors duration-200 hover:text-[var(--brand)] dark:text-neutral-100 dark:hover:text-[var(--brand)]"
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
                          className={`text-neutral-400 transition-all duration-200 group-hover:text-[var(--brand)] ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-neutral-200/50 bg-neutral-50/50 dark:border-neutral-700/50 dark:bg-neutral-900/50">
                          <ul className="p-2">
                            {item.children.map((child, childIndex) => (
                              <li
                                key={child.href}
                                style={{
                                  transitionDelay: isOpen
                                    ? `${childIndex * 50}ms`
                                    : "0ms",
                                }}
                              >
                                <Link
                                  href={child.href}
                                  className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-all duration-150 hover:bg-[rgba(4,236,58,0.1)] hover:text-[var(--brand)] dark:text-neutral-300 dark:hover:bg-[rgba(4,236,58,0.1)] dark:hover:text-[var(--brand)]"
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileOpenIndex(null);
                                  }}
                                >
                                  <span
                                    className="h-1.5 w-1.5 rounded-full transition-all duration-150 group-hover/item:scale-125"
                                    style={{ backgroundColor: "var(--brand)" }}
                                  />
                                  <span className="transition-colors">
                                    {child.label}
                                  </span>
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
                    className="rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 transition-all duration-200 hover:bg-[rgba(4,236,58,0.1)] hover:text-[var(--brand)] dark:text-neutral-100 dark:hover:text-[var(--brand)]"
                    style={{
                      transitionDelay: mobileOpen ? `${index * 50}ms` : "0ms",
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen
                        ? "translateY(0)"
                        : "translateY(-8px)",
                    }}
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
            <div
              className="mt-4 flex flex-col gap-3 transition-all duration-300"
              style={{
                transitionDelay: mobileOpen ? "200ms" : "0ms",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
              }}
            >
              {/* Sign in & Get started - side by side */}
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-center text-sm font-medium text-neutral-800 transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand)] dark:border-neutral-700 dark:text-neutral-100 dark:hover:border-[var(--brand)] dark:hover:text-[var(--brand)]"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileOpenIndex(null);
                  }}
                >
                  Sign in
                </Link>

                <Link
                  href="/get-started"
                  className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-medium text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: "var(--brand)" }}
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
                    className="p-2.5 text-neutral-500 transition-all duration-200 hover:bg-[rgba(4,236,58,0.1)] hover:text-[var(--brand)] dark:text-neutral-400 dark:hover:bg-[rgba(4,236,58,0.1)] dark:hover:text-[var(--brand)]"
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
                    className="p-2.5 text-neutral-500 transition-all duration-200 hover:bg-[rgba(4,236,58,0.1)] hover:text-[var(--brand)] dark:text-neutral-400 dark:hover:bg-[rgba(4,236,58,0.1)] dark:hover:text-[var(--brand)]"
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
      </div>
    </header>
  );
};

export default Header;
