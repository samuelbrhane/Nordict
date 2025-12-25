import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

import { Outfit } from "next/font/google";
const font = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ChainForecast — Probabilistic Market Forecasts",
  description:
    "ChainForecast provides multi-horizon market forecasts with confidence scoring, walk-forward backtesting, and transparent performance metrics to support data-driven trading and investment decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${font.className} antialiased bg-white text-neutral-900 dark:bg-black dark:text-neutral-100`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
