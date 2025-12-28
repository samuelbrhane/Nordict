"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ enabled, onChange, disabled = false }: ToggleProps) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative h-6 w-11 rounded-full transition-colors ${
      disabled ? "cursor-not-allowed opacity-50" : ""
    } ${enabled ? "" : "bg-neutral-200 dark:bg-neutral-700"}`}
    style={enabled ? { backgroundColor: "var(--brand)" } : {}}
  >
    <span
      className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
        enabled ? "translate-x-5" : ""
      }`}
    />
  </button>
);

export default Toggle;
