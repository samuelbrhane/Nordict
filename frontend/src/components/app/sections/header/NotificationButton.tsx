"use client";

interface NotificationButtonProps {
  hasUnread?: boolean;
}

const NotificationButton = ({ hasUnread = true }: NotificationButtonProps) => {
  return (
    <button
      className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      aria-label="Notifications"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      {hasUnread && (
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--brand)" }}
        />
      )}
    </button>
  );
};

export default NotificationButton;
