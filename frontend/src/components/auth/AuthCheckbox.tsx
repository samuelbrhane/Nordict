import Link from "next/link";

interface AuthCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
}

export function AuthCheckbox({ checked, onChange, error }: AuthCheckboxProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={`mt-0.5 h-4 w-4 rounded border-neutral-300 text-[var(--brand)] focus:ring-[var(--brand)] focus:ring-offset-0 dark:border-neutral-600 dark:bg-neutral-800 ${
            error ? "border-red-300 dark:border-red-700" : ""
          }`}
        />
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-medium underline underline-offset-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium underline underline-offset-2 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
        </span>
      </label>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
