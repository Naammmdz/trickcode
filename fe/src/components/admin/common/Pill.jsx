const Pill = ({ children, tone = 'neutral' }) => {
  const toneMap = {
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    yellow: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    blue: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
  };

  const cls = toneMap[tone] || toneMap.neutral;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-sans font-medium uppercase tracking-widest border rounded-full ${cls}`}>
      {children}
    </span>
  );
};

export default Pill;
