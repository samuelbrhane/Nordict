import { Toggle } from "@/components/ui";

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

const ToggleRow = ({
  label,
  description,
  enabled,
  onChange,
  disabled,
  badge,
}: ToggleRowProps) => {
  const isDisabled = disabled || !!badge;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {label}
          </p>
          {badge && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} disabled={isDisabled} />
    </div>
  );
};

export default ToggleRow;
