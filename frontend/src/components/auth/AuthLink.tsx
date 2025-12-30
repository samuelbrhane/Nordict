import Link from "next/link";

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
}

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <div className="mt-6 text-center">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
        style={{ color: "var(--brand)" }}
      >
        {children}
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </Link>
    </div>
  );
}
