const StatCard = ({ title, value, hint, icon }) => {
  return (
    <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm hover:border-neutral-400 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">{title}</div>
          <div className="mt-2 text-3xl font-serif text-neutral-900 dark:text-white">{value}</div>
          {hint ? <div className="mt-2 text-xs text-neutral-500 dark:text-zinc-400 font-light">{hint}</div> : null}
        </div>
        <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 flex items-center justify-center text-neutral-600 dark:text-zinc-300">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
