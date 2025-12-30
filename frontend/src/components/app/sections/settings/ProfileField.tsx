interface ProfileFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "select";
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
}

const ProfileField = ({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  placeholder,
  disabled,
  hint,
  options,
}: ProfileFieldProps) => {
  const inputClasses =
    "mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[var(--brand)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </label>

      {isEditing && !disabled ? (
        type === "select" && options ? (
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputClasses}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
          />
        )
      ) : (
        <>
          <p className="mt-1 text-sm text-neutral-900 dark:text-white">
            {value || "—"}
          </p>
          {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
        </>
      )}
    </div>
  );
};

export default ProfileField;
