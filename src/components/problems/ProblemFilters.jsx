
const ProblemFilters = () => {
  return (
    <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24 h-fit">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-500 group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input 
          className="block w-full pl-10 pr-3 py-2.5 bg-frontier-card border border-white/10 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono" 
          placeholder="Search problems..." 
          type="text"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <kbd className="inline-flex items-center border border-white/10 rounded px-2 text-xs font-sans font-medium text-gray-500">⌘K</kbd>
        </div>
      </div>

      <div className="space-y-6">
        {/* Difficulty Filter */}
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">signal_cellular_alt</span> Difficulty
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-terminal-green focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Easy</span>
              <span className="ml-auto text-xs text-gray-600">420</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-sharp-yellow focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Medium</span>
              <span className="ml-auto text-xs text-gray-600">653</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-red-500 focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Hard</span>
              <span className="ml-auto text-xs text-gray-600">215</span>
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
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Solved</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Unsolved</span>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer group transition-colors">
              <input className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-0 focus:ring-offset-0" type="checkbox"/>
              <span className="text-sm text-gray-300 group-hover:text-white font-mono">Attempted</span>
            </label>
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">category</span> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Arrays</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">DP</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Strings</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Trees</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Graph</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Greedy</button>
            <button className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all">Sorting</button>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded p-5 mt-8 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 text-primary/10 group-hover:text-primary/20 transition-colors">
          <span className="material-icons-outlined text-8xl">calendar_today</span>
        </div>
        <h4 className="text-primary font-mono font-bold text-sm mb-1 relative z-10">Daily Challenge</h4>
        <p className="text-white font-serif text-lg mb-3 relative z-10">Reverse Nodes in k-Group</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20">Hard</span>
          <span className="text-xs text-gray-400">+50 XP</span>
        </div>
        <button className="w-full py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold font-mono rounded shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2">
          <span>Solve Now</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
};

export default ProblemFilters;
