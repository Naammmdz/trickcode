const SearchFilters = () => {
  return (
    <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24 h-fit">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input 
          className="block w-full pl-10 pr-3 py-2.5 bg-frontier-card border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono" 
          placeholder="Search modules..." 
          type="text"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <kbd className="inline-flex items-center border border-white/10 rounded px-2 text-xs font-sans font-medium text-gray-500">⌘K</kbd>
        </div>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">category</span> Categories
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded bg-primary/10 border border-primary text-primary text-xs font-mono font-bold transition hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]">
              ALL_MODULES
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-mono font-medium transition">
              ALGORITHMS
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-mono font-medium transition">
              DATA_STRUCTURES
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-mono font-medium transition">
              SYSTEM_DESIGN
            </button>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">signal_cellular_alt</span> Difficulty
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-terminal-green focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Beginner</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-sharp-yellow focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Intermediate</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-red-500 focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Advanced</span>
            </label>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span> Status
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">In Progress</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Completed</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Locked</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SearchFilters;
