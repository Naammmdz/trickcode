import StatCard from '../common/StatCard';

const OverviewTab = () => {
  const overviewStats = [
    { title: 'Active Users', value: '1,284', hint: '+12% vs last week', icon: 'group' },
    { title: 'Courses', value: '42', hint: '8 drafts', icon: 'menu_book' },
    { title: 'Instructors', value: '13', hint: '2 pending approval', icon: 'school' },
    { title: 'Revenue', value: '$3,240', hint: 'This month', icon: 'payments' },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Admin</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-serif text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-zinc-400 font-light max-w-3xl">
          In-memory admin console (demo). Refresh resets data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewStats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} hint={s.hint} icon={s.icon} />
        ))}
      </div>

      <div className="mt-8 border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="text-lg font-serif text-neutral-900 dark:text-white">Recent Signups</div>
          <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Demo data (wired later to IAM)</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-100 dark:border-zinc-800">
              <tr>
                {['Email', 'Role', 'Status', 'Created'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['tagiangnamttg@gmail.com', 'STUDENT', 'ACTIVE', 'Today'],
                ['admin@trickcode.local', 'ADMIN', 'ACTIVE', 'Yesterday'],
                ['instructor@trickcode.local', 'INSTRUCTOR', 'PENDING', '2 days ago'],
              ].map((r, idx) => (
                <tr key={idx} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                  {r.map((cell, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-neutral-700 dark:text-zinc-200">
                      {cell}
                    </td>
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

export default OverviewTab;
