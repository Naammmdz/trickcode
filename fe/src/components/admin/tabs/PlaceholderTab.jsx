const PlaceholderTab = ({ title, subtitle, rows, columns }) => {
  return (
    <div className="p-8 max-w-6xl">
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="text-lg font-serif text-neutral-900 dark:text-white">{title}</div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">{subtitle}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-100 dark:border-zinc-800">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                  {r.map((cell, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderTab;
