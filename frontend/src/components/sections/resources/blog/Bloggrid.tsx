"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface BlogGridProps {
  activeCategory: string;
}

const ARTICLES = [
  {
    id: "understanding-confidence-scores",
    title: "Understanding Confidence Scores: A Practical Guide",
    excerpt:
      "What does a 73% confidence score actually mean? Learn how to interpret and act on our confidence metrics effectively.",
    category: "guides",
    date: "Dec 20, 2024",
    readTime: "8 min read",
    featured: true,
    author: {
      name: "Sarah Chen",
      role: "Head of Research",
      initials: "SC",
    },
  },
  {
    id: "backtesting-methodology",
    title: "How We Backtest Our Forecasting Models",
    excerpt:
      "A transparent look at our validation process, from walk-forward analysis to regime testing. No cherry-picking allowed.",
    category: "research",
    date: "Dec 15, 2024",
    readTime: "12 min read",
    featured: true,
    author: {
      name: "Alex Kumar",
      role: "ML Engineer",
      initials: "AK",
    },
  },
  {
    id: "q4-2024-performance",
    title: "Q4 2024 Performance Review",
    excerpt:
      "Quarterly transparency report: what we got right, what we got wrong, and what we learned. Full accuracy breakdown by asset and horizon.",
    category: "performance",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    featured: false,
    author: {
      name: "Marcus Wright",
      role: "Head of Product",
      initials: "MW",
    },
  },
  {
    id: "5-ways-traders-use-signals",
    title: "5 Ways Traders Use Nordict Signals",
    excerpt:
      "Real workflows from real users. From entry confirmation to position sizing, see how traders integrate forecasts into their process.",
    category: "guides",
    date: "Dec 5, 2024",
    readTime: "6 min read",
    featured: false,
    author: {
      name: "Sarah Chen",
      role: "Head of Research",
      initials: "SC",
    },
  },
  {
    id: "introducing-confidence-bands",
    title: "Introducing Confidence Bands",
    excerpt:
      "New feature: visualize forecast uncertainty with 50%, 75%, and 95% confidence intervals. Here's how they work.",
    category: "product",
    date: "Nov 28, 2024",
    readTime: "5 min read",
    featured: false,
    author: {
      name: "Marcus Wright",
      role: "Head of Product",
      initials: "MW",
    },
  },
  {
    id: "regime-detection-explained",
    title: "How We Detect Market Regimes",
    excerpt:
      "Bull, bear, or sideways? Our models adapt to market conditions. Here's the volatility clustering approach behind regime detection.",
    category: "research",
    date: "Nov 20, 2024",
    readTime: "15 min read",
    featured: false,
    author: {
      name: "Alex Kumar",
      role: "ML Engineer",
      initials: "AK",
    },
  },
  {
    id: "dca-timing-guide",
    title: "Using Forecasts for DCA Timing",
    excerpt:
      "Should you DCA on a fixed schedule or wait for signals? A data-driven look at timing your regular investments.",
    category: "guides",
    date: "Nov 15, 2024",
    readTime: "7 min read",
    featured: false,
    author: {
      name: "Sarah Chen",
      role: "Head of Research",
      initials: "SC",
    },
  },
  {
    id: "api-v2-launch",
    title: "API v2: What's New",
    excerpt:
      "Faster endpoints, webhook improvements, and new SDK support. Everything you need to know about our API update.",
    category: "product",
    date: "Nov 10, 2024",
    readTime: "4 min read",
    featured: false,
    author: {
      name: "Marcus Wright",
      role: "Head of Product",
      initials: "MW",
    },
  },
];

const BlogGrid = ({ activeCategory }: BlogGridProps) => {
  const [isVisible, setIsVisible] = useState(false);
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

  const filteredArticles =
    activeCategory === "all"
      ? ARTICLES
      : ARTICLES.filter((article) => article.category === activeCategory);

  const featuredArticles = filteredArticles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "guides":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "research":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
      case "product":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
      case "performance":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pb-20 dark:bg-black"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Featured articles */}
        {featuredArticles.length > 0 && (
          <div
            className={`mb-12 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">
              Featured
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredArticles.map((article, i) => (
                <Link
                  key={article.id}
                  //   href={`/blog/${article.id}`}
                  href={`/blog`}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Category badge */}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {getCategoryLabel(article.category)}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-[var(--brand)] transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        {article.author.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {article.author.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {article.date}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {article.readTime}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular articles grid */}
        {regularArticles.length > 0 && (
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-4">
              {activeCategory === "all"
                ? "All Posts"
                : getCategoryLabel(activeCategory)}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularArticles.map((article, i) => (
                <Link
                  key={article.id}
                  //   href={`/blog/${article.id}`}
                  href={`/blog`}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                  style={{ transitionDelay: `${(i + 2) * 50}ms` }}
                >
                  {/* Category badge */}
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {getCategoryLabel(article.category)}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-white group-hover:text-[var(--brand)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  {/* Hover accent */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div
            className={`text-center py-16 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(4,236,58,0.15)" }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: "var(--brand)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              No posts yet
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Check back soon for new content in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
