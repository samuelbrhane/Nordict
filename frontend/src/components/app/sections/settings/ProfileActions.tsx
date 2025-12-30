interface ProfileActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const ProfileActions = ({
  onSave,
  onCancel,
  isSaving,
}: ProfileActionsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--brand)" }}
      >
        {isSaving && (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        Save
      </button>
      <button
        onClick={onCancel}
        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300"
      >
        Cancel
      </button>
    </div>
  );
};

export default ProfileActions;
