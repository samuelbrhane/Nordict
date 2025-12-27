"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const ProductHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      {/* Hero Section - Text Only */}
      <section className="relative overflow-hidden bg-white pt-8 pb-16 dark:bg-black">
        {/* Brand glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-1000 ${
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

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <div
            className={`mb-6 flex items-center gap-3 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3"
            }`}
          >
            <Link
              href="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Home
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Product
            </span>
          </div>

          {/* Badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--brand)" }}
            />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Platform Overview
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`max-w-4xl text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            The forecasting platform built for{" "}
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
              rigor
            </span>{" "}
            and{" "}
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
              transparency
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            Nordict combines{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              multi-horizon forecasts
            </span>
            ,{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              confidence scoring
            </span>
            , and{" "}
            <span className="font-medium text-neutral-900 dark:text-white">
              walk-forward backtesting
            </span>{" "}
            into a single platform—so every signal is auditable and every
            prediction comes with context.
          </p>

          {/* Key points */}
          <div
            className={`mt-8 flex flex-wrap gap-6 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {[
              "Probabilistic forecasts",
              "Calibrated confidence bands",
              "Live performance tracking",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  style={{
                    backgroundColor: "rgba(4,236,58,0.15)",
                    color: "var(--brand)",
                  }}
                >
                  ✓
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {point}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-3.5 text-sm font-medium text-black shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand)]/30 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Request early access
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="#demo-video"
              className="group inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
            >
              <span className="flex items-center gap-2">
                Watch demo
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        id="demo-video"
        className="relative overflow-hidden bg-neutral-50 py-16 dark:bg-neutral-950"
      >
        {/* Brand glow */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10 dark:opacity-15"
            style={{ backgroundColor: "var(--brand)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Section header */}
          <div
            className={`mb-8 text-center transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              See how it works
            </p>
            <h2 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
              Product overview
            </h2>
          </div>

          {/* Video container */}
          <div
            className={`relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 shadow-2xl shadow-neutral-900/10 dark:border-neutral-800 dark:shadow-black/30 transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            {/* Aspect ratio container */}
            <div className="relative h-137.5">
              {/* Video element */}
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                onEnded={handleVideoEnd}
                poster="/mock/mock3.jpeg"
                muted
              >
                {/* Replace with your actual video path */}
                <source src="/videos/product_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 transition-all duration-300 hover:bg-black/30"
                  onClick={handlePlayClick}
                >
                  {/* Play button */}
                  <button
                    className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[var(--brand)]/50 hover:bg-[var(--brand)]/20 sm:h-24 sm:w-24"
                    aria-label="Play video"
                  >
                    {/* Pulsing ring */}
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: "var(--brand)" }}
                    />

                    {/* Play icon */}
                    <svg
                      className="relative z-10 ml-1 h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>

                  {/* Duration badge */}
                  {/* <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    2:30
                  </div> */}
                </div>
              )}

              {/* Video controls overlay when playing */}
              {isPlaying && (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      }
                    }
                  }}
                />
              )}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--brand)" }}
                />
                <span className="text-sm text-neutral-300">
                  Product walkthrough
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                Recorded Dec 2024
              </span>
            </div>
          </div>

          {/* Caption */}
          <p
            className={`mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            A quick overview of Nordict's forecasting dashboard, confidence
            bands, and performance tracking.
          </p>
        </div>
      </section>
    </>
  );
};

export default ProductHero;
