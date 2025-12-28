"use client";

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const CollapseButton = ({ isCollapsed, onToggle }: CollapseButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="hidden rounded-lg p-1.5 text-neutral-400 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-600 hover:scale-105 active:scale-95 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 lg:block"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <svg
        className={`h-5 w-5 transition-transform duration-300 ${
          isCollapsed ? "rotate-180" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
};

export default CollapseButton;
