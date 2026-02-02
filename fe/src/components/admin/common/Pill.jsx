const Pill = ({ children, tone = 'neutral' }) => {
  const toneCls =
    tone === 'green'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20'
      : tone === 'red'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20'
        : tone === 'yellow'
          ? 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-200 border-yellow-500/20'
          : 'bg-neutral-500/10 text-neutral-700 dark:text-zinc-300 border-neutral-500/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest border rounded-full ${toneCls}`}>
      {children}
    </span>
  );
};

export default Pill;
