import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Forecasting Engine", href: "/product/engine" },
      { label: "Performance", href: "/product/performance" },
      { label: "Alerts", href: "/product/alerts" },
      { label: "API", href: "/product/api" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Methodology", href: "/resources/methodology" },
      { label: "Blog", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
              Nordict
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Multi-horizon market forecasts with calibrated confidence scoring
              and transparent performance tracking.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
                Crypto
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
                Indices
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
                FX (coming)
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-neutral-600 transition-colors hover:text-(--brand) dark:text-neutral-400 dark:hover:text-(--brand)"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Legal */}
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Legal
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-neutral-600 transition-colors hover:text-(--brand) dark:text-neutral-400 dark:hover:text-(--brand)"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-neutral-600 transition-colors hover:text-(--brand) dark:text-neutral-400 dark:hover:text-(--brand)"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-sm text-neutral-600 transition-colors hover:text-(--brand) dark:text-neutral-400 dark:hover:text-(--brand)"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nordict. All rights reserved.</p>

          <p className="text-xs leading-relaxed">
            Nordict is provided for informational purposes only and does not
            constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
