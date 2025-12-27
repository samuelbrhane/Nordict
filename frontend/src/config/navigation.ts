export type NavItem = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    children: [
      { label: "Overview", href: "/product" },
      { label: "Forecasting Engine", href: "/product/engine" },
      { label: "Performance", href: "/product/performance" },
      { label: "Alerts", href: "/product/alerts" },
      { label: "API & Integrations", href: "/product/api" },
    ],
  },
  {
    label: "Solutions",
    children: [
      { label: "For Traders", href: "/solutions/traders" },
      { label: "For Investors", href: "/solutions/investors" },
      { label: "For Teams", href: "/solutions/teams" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    children: [
      { label: "Methodology", href: "/resources/methodology" },
      { label: "Blog", href: "/blog" },
      // { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "About", href: "/about" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
