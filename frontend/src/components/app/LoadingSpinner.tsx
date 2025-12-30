"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const LoadingSpinner = ({ size = "md", text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-neutral-200 dark:border-neutral-700`}
        style={{ borderTopColor: "var(--brand)" }}
      />
      {text && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
