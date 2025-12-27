"use client";

import { useState, useEffect, useRef } from "react";
import { PRIVACY_SECTIONS } from "@/config/privacy";

const PrivacyContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = PRIVACY_SECTIONS.map((s) =>
        document.getElementById(s.id)
      );

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(PRIVACY_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-12 sm:py-20 dark:bg-neutral-950"
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent dark:via-neutral-700/60" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-12">
          {/* Sidebar - Table of Contents */}
          <aside
            className={`hidden lg:block transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Table of Contents
              </p>
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
                {PRIVACY_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-[var(--brand)]/10 font-medium text-[var(--brand)]"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Table of Contents */}
          <div
            className={`lg:hidden mb-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <details className="group rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white">
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  Table of Contents
                </span>
                <svg
                  className="h-4 w-4 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
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
              </summary>
              <nav className="border-t border-neutral-200 px-2 py-2 max-h-64 overflow-y-auto dark:border-neutral-800">
                {PRIVACY_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left rounded-lg px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </details>
          </div>

          {/* Main Content */}
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
              {/* GDPR/CCPA Badge */}
              <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-medium text-neutral-600 sm:text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  <svg
                    className="h-3 w-3"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  GDPR Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-medium text-neutral-600 sm:text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  <svg
                    className="h-3 w-3"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  CCPA Compliant
                </span>
              </div>

              <div className="space-y-8 sm:space-y-12">
                {PRIVACY_SECTIONS.map((section, index) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className={`scroll-mt-28 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${300 + index * 50}ms`,
                      transitionDuration: "700ms",
                      transitionTimingFunction: "ease-out",
                    }}
                  >
                    <h2 className="mb-3 text-base font-semibold text-neutral-900 sm:mb-4 sm:text-lg dark:text-white">
                      {section.title}
                    </h2>
                    <div className="text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400 whitespace-pre-line">
                      {section.content}
                    </div>
                    {index < PRIVACY_SECTIONS.length - 1 && (
                      <div className="mt-8 border-b border-neutral-100 sm:mt-12 dark:border-neutral-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom note */}
            <div
              className={`mt-6 text-center transition-all duration-700 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <p className="text-[10px] text-neutral-500 sm:text-xs dark:text-neutral-400">
                Your privacy matters. If you have any concerns, please don't
                hesitate to contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyContent;
