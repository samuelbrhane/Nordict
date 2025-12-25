const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-600 dark:text-neutral-400">
        © {new Date().getFullYear()} ChainForecast. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
