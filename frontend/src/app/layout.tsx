import type { Metadata } from "next";
import "./globals.css";

import { Outfit } from "next/font/google";
const font = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nordict: AI-powered Market Forecasts",
  description:
    "Nordict provides AI-powered price forecasts with confidence bands, multi-model ensemble predictions, and transparent performance metrics including MAE, calibration scores, and walk-forward backtesting.",
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
        {children}
      </body>
    </html>
  );
}
