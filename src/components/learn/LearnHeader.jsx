import { Link } from 'react-router-dom';

const LearnHeader = () => {
  return (
    <header className="relative pt-20 pb-16 px-6 md:px-12 lg:px-24 bg-frontier-black overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2 text-primary font-mono text-xs mb-3 uppercase tracking-wider">
          <Link to="/" className="hover:text-primary-hover transition-colors">
            <span className="material-symbols-outlined text-sm">home</span>
          </Link>
          <span>/</span>
          <span className="font-bold">Learn</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Learning Modules</h1>
            <p className="text-gray-400 max-w-xl font-light text-sm md:text-base leading-relaxed">
              Upgrade your kernel. Select a structured path or individual module to begin the compilation of new skills.
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex gap-6 bg-frontier-card border border-white/10 rounded-lg p-4 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Current Streak</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-primary text-lg">local_fire_department</span>
                <span className="text-xl font-bold text-white font-mono">12</span>
              </div>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Modules Completed</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-terminal-green text-lg">verified</span>
                <span className="text-xl font-bold text-white font-mono">4</span>
              </div>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Global Rank</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-blue-400 text-lg">leaderboard</span>
                <span className="text-xl font-bold text-white font-mono">#4,201</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LearnHeader;
