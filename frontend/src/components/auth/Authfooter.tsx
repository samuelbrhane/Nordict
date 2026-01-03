import Link from "next/link";

const AuthFooter = () => {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-screen-2xl px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Copyright */}
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © 2025 – {new Date().getFullYear()} Nordict
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              Terms
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <Link
              href="/privacy"
              className="text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              Privacy
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <Link
              href="/contact"
              className="text-xs text-neutral-500 transition-colors duration-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;
