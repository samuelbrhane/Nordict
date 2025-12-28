interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div>
      <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
