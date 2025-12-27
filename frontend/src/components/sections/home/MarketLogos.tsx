"use client";

import { useEffect, useState, useRef } from "react";

const MARKETS = [
  { name: "Bitcoin", symbol: "BTC", icon: "₿", active: true },
  { name: "Ethereum", symbol: "ETH", icon: "Ξ", active: true },
  { name: "Solana", symbol: "SOL", icon: "◎", active: true },
  { name: "S&P 500", symbol: "SPX", icon: "S&P", active: true },
  { name: "NASDAQ", symbol: "NDX", icon: "NDX", active: true },
  { name: "Dow Jones", symbol: "DJI", icon: "DJI", active: true },
  { name: "EUR/USD", symbol: "EURUSD", icon: "€/$", active: false },
  { name: "GBP/USD", symbol: "GBPUSD", icon: "£/$", active: false },
  { name: "USD/JPY", symbol: "USDJPY", icon: "$/¥", active: false },
];

const MarketLogos = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  // Duplicate array for seamless loop
  const duplicatedMarkets = [...MARKETS, ...MARKETS];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-neutral-200 bg-neutral-50 py-8 dark:border-neutral-800 dark:bg-neutral-950"
    >
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
            isVisible ? "opacity-15" : "opacity-0"
          }`}
          style={{ backgroundColor: "var(--brand)" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Label */}
        <div
          className={`mb-6 flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Supported markets
          </p>
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--brand)" }}
          />
        </div>
      </div>

      {/* Scrolling container */}
      <div
        className={`relative transition-all duration-700 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-950" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-neutral-50 to-transparent dark:from-neutral-950" />

        {/* Scrolling track */}
        <div
          className={`flex w-max gap-6 ${isPaused ? "" : "animate-scroll"}`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedMarkets.map((market, i) => (
            <div
              key={`${market.symbol}-${i}`}
              className={`group flex items-center gap-3 rounded-2xl border px-5 py-3 transition-all duration-300 cursor-default ${
                market.active
                  ? "border-neutral-200 bg-white/80 hover:border-[var(--brand)]/30 hover:bg-white hover:shadow-sm dark:border-neutral-800 dark:bg-black/40 dark:hover:border-[var(--brand)]/30 dark:hover:bg-black/60"
                  : "border-neutral-200/60 bg-white/40 dark:border-neutral-800/60 dark:bg-black/20"
              }`}
            >
              {/* Icon */}
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ${
                  market.active
                    ? "bg-neutral-100 text-neutral-700 group-hover:bg-[var(--brand)]/15 group-hover:text-[var(--brand)] dark:bg-neutral-800 dark:text-neutral-300"
                    : "bg-neutral-100/60 text-neutral-400 dark:bg-neutral-800/60 dark:text-neutral-500"
                }`}
              >
                {market.icon}
              </span>

              {/* Text */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    market.active
                      ? "text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {market.name}
                </span>
                <span
                  className={`text-xs ${
                    market.active
                      ? "text-neutral-500 dark:text-neutral-400"
                      : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  {market.symbol}
                  {!market.active && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide">
                      soon
                    </span>
                  )}
                </span>
              </div>

              {/* Active indicator */}
              {market.active && (
                <span
                  className={`ml-1 h-1.5 w-1.5 rounded-full transition-transform duration-200 group-hover:scale-125`}
                  style={{ backgroundColor: "var(--brand)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div
        className={`mx-auto mt-6 max-w-7xl px-6 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
          More assets and FX pairs coming soon.{" "}
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
            Request an asset →
          </span>
        </p>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MarketLogos;
