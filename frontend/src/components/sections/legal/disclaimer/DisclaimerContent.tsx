"use client";

import { useState, useEffect, useRef } from "react";
import { DISCLAIMER_SECTIONS } from "@/config/disclaimer";

const DisclaimerContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("general");
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
      const sectionElements = DISCLAIMER_SECTIONS.map((s) =>
        document.getElementById(s.id)
      );

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(DISCLAIMER_SECTIONS[i].id);
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
                {DISCLAIMER_SECTIONS.map((section) => (
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
                {DISCLAIMER_SECTIONS.map((section) => (
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
            {/* Important Warning Banner */}
            <div
              className={`mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mb-8 sm:rounded-2xl sm:p-5 dark:border-amber-900/50 dark:bg-amber-900/20 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 sm:h-10 sm:w-10 dark:bg-amber-900/40">
                  <svg
                    className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5 dark:text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-amber-800 sm:text-sm dark:text-amber-200">
                    Important Notice
                  </h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-amber-700 sm:text-xs dark:text-amber-300">
                    Nordict provides forecasts for informational purposes only.
                    Our predictions are not financial advice and should not be
                    the sole basis for any investment decisions. Cryptocurrency
                    trading involves substantial risk of loss. Please read this
                    disclaimer carefully.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="space-y-8 sm:space-y-12">
                {DISCLAIMER_SECTIONS.map((section, index) => (
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
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
                        style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
                      >
                        <div
                          className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5"
                          style={{ color: "var(--brand)" }}
                        >
                          {section.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="mb-2 text-base font-semibold text-neutral-900 sm:mb-3 sm:text-lg dark:text-white">
                          {section.title}
                        </h2>
                        <div className="text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400 whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                    {index < DISCLAIMER_SECTIONS.length - 1 && (
                      <div className="mt-8 border-b border-neutral-100 sm:mt-12 dark:border-neutral-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Acknowledgment section */}
            <div
              className={`mt-6 rounded-xl border border-neutral-200 bg-white p-4 sm:rounded-2xl sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10"
                  style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    style={{ color: "var(--brand)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm dark:text-white">
                    By Using Nordict, You Acknowledge
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[10px] text-neutral-600 sm:text-xs dark:text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-1 h-1 w-1 shrink-0 rounded-full sm:h-1.5 sm:w-1.5"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      You have read and understood this Disclaimer in its
                      entirety
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-1 h-1 w-1 shrink-0 rounded-full sm:h-1.5 sm:w-1.5"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      You understand that forecasts are not financial advice
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-1 h-1 w-1 shrink-0 rounded-full sm:h-1.5 sm:w-1.5"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      You accept all risks associated with cryptocurrency
                      trading
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-1 h-1 w-1 shrink-0 rounded-full sm:h-1.5 sm:w-1.5"
                        style={{ backgroundColor: "var(--brand)" }}
                      />
                      You will not hold Nordict liable for any trading losses
                    </li>
                  </ul>
                </div>
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
                Trade responsibly. If you have questions about this disclaimer,
                contact us at legal@nordict.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisclaimerContent;
