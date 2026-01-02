"use client";

import { useEffect, useState, useRef } from "react";

const MARKETS = [
  // Crypto - Active (Top coins)
  { name: "Bitcoin", symbol: "BTC", icon: "₿", active: true },
  { name: "Ethereum", symbol: "ETH", icon: "Ξ", active: true },
  { name: "BNB", symbol: "BNB", icon: "BNB", active: true },
  { name: "Solana", symbol: "SOL", icon: "◎", active: true },
  { name: "XRP", symbol: "XRP", icon: "XRP", active: true },
  { name: "Cardano", symbol: "ADA", icon: "ADA", active: true },
  { name: "Dogecoin", symbol: "DOGE", icon: "Ð", active: true },
  { name: "Avalanche", symbol: "AVAX", icon: "AVAX", active: true },
  { name: "Polkadot", symbol: "DOT", icon: "DOT", active: true },
  { name: "Chainlink", symbol: "LINK", icon: "LINK", active: true },
  { name: "Shiba Inu", symbol: "SHIB", icon: "SHIB", active: true },
  { name: "Litecoin", symbol: "LTC", icon: "Ł", active: true },
  { name: "Uniswap", symbol: "UNI", icon: "UNI", active: true },
  { name: "Cosmos", symbol: "ATOM", icon: "ATOM", active: true },
  { name: "Stellar", symbol: "XLM", icon: "XLM", active: true },
  { name: "Ethereum Classic", symbol: "ETC", icon: "ETC", active: true },
  { name: "Filecoin", symbol: "FIL", icon: "FIL", active: true },
  { name: "NEAR Protocol", symbol: "NEAR", icon: "NEAR", active: true },
  { name: "Aptos", symbol: "APT", icon: "APT", active: true },
  { name: "Arbitrum", symbol: "ARB", icon: "ARB", active: true },
  { name: "Optimism", symbol: "OP", icon: "OP", active: true },
  { name: "Injective", symbol: "INJ", icon: "INJ", active: true },
  { name: "Sui", symbol: "SUI", icon: "SUI", active: true },
  { name: "Sei", symbol: "SEI", icon: "SEI", active: true },
  { name: "Celestia", symbol: "TIA", icon: "TIA", active: true },
  { name: "Render", symbol: "RENDER", icon: "RNDR", active: true },
  { name: "Fetch.ai", symbol: "FET", icon: "FET", active: true },
  { name: "Bittensor", symbol: "TAO", icon: "TAO", active: true },
  { name: "dogwifhat", symbol: "WIF", icon: "WIF", active: true },
  { name: "Pepe", symbol: "PEPE", icon: "PEPE", active: true },
  { name: "Immutable", symbol: "IMX", icon: "IMX", active: true },
  { name: "Stacks", symbol: "STX", icon: "STX", active: true },
  { name: "Maker", symbol: "MKR", icon: "MKR", active: true },
  { name: "Aave", symbol: "AAVE", icon: "AAVE", active: true },
  { name: "The Graph", symbol: "GRT", icon: "GRT", active: true },
  { name: "Synthetix", symbol: "SNX", icon: "SNX", active: true },
  { name: "Lido DAO", symbol: "LDO", icon: "LDO", active: true },
  { name: "Curve", symbol: "CRV", icon: "CRV", active: true },
  { name: "THORChain", symbol: "RUNE", icon: "RUNE", active: true },
  { name: "ENS", symbol: "ENS", icon: "ENS", active: true },
  { name: "The Sandbox", symbol: "SAND", icon: "SAND", active: true },
  { name: "Decentraland", symbol: "MANA", icon: "MANA", active: true },
  { name: "Axie Infinity", symbol: "AXS", icon: "AXS", active: true },
  { name: "Gala", symbol: "GALA", icon: "GALA", active: true },
  { name: "Flow", symbol: "FLOW", icon: "FLOW", active: true },
  { name: "Chiliz", symbol: "CHZ", icon: "CHZ", active: true },
  { name: "Enjin Coin", symbol: "ENJ", icon: "ENJ", active: true },
  { name: "STEPN", symbol: "GMT", icon: "GMT", active: true },
  { name: "ApeCoin", symbol: "APE", icon: "APE", active: true },
  { name: "Algorand", symbol: "ALGO", icon: "ALGO", active: true },

  // Indices - Coming soon
  { name: "S&P 500", symbol: "SPX", icon: "S&P", active: false },
  { name: "NASDAQ", symbol: "NDX", icon: "NDX", active: false },
  { name: "Dow Jones", symbol: "DJI", icon: "DJI", active: false },

  // Forex - Coming soon
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
  const duplicatedMarkets = [...MARKETS];

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

      <div className="mx-auto max-w-screen-2xl px-6">
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
        className={`mx-auto mt-6 max-w-screen-2xl px-6 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
          More assets and FX pairs coming soon.{" "}
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
