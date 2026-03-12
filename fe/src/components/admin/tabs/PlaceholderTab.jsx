const PlaceholderTab = ({ title, subtitle, rows, columns }) => {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">{title}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
          {subtitle}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="text-left px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">inbox</span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">No data available.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={idx} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors duration-150">
                    {r.map((cell, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-200">{cell}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderTab;
