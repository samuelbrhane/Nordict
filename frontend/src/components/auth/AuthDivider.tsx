interface AuthDividerProps {
  text: string;
}

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="relative mt-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          {text}
        </span>
      </div>
    </div>
  );
}
