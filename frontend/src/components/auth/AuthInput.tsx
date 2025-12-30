import { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function AuthInput({ label, error, id, ...props }: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:focus:border-red-500"
            : "border-neutral-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 dark:border-neutral-700 dark:focus:border-[var(--brand)]"
        }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
