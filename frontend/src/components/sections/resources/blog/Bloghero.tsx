"use client";

import { useEffect, useState } from "react";

interface BlogHeroProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Posts" },
  { id: "guides", label: "Guides" },
  { id: "research", label: "Research" },
  { id: "product", label: "Product" },
  { id: "performance", label: "Performance" },
];

const BlogHero = ({ activeCategory, setActiveCategory }: BlogHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-12 dark:bg-black">
      {/* Brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-10 dark:opacity-20" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        {/* Badge */}
        <div
          className={`flex justify-center mb-6 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Blog
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-2xl mx-auto">
          <h1
            className={`text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Insights &{" "}
            <span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 0%, rgba(4,236,58,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              updates
            </span>
          </h1>

          <p
            className={`mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Deep dives into our methodology, performance reviews, product
            updates, and practical guides for using forecasts effectively.
          </p>
        </div>

        {/* Category filters */}
        <div
          className={`mt-8 flex justify-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5 dark:border-neutral-800 dark:bg-neutral-900">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-white text-neutral-900 shadow-md dark:bg-black dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {category.label}
                {activeCategory === category.id && (
                  <div
                    className="absolute inset-x-2 bottom-1 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
