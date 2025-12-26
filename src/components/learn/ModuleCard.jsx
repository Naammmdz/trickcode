const ModuleCard = ({ module, getDifficultyColor }) => {
  return (
    <div 
      className={`group relative bg-frontier-card border ${module.locked ? 'border-white/10 hover:border-white/20' : 'border-white/10 hover:border-primary/50'} rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] hover:-translate-y-1 flex flex-col ${
        module.locked ? 'opacity-75 hover:opacity-100 grayscale hover:grayscale-0' : ''
      }`}
    >
      {module.status === 'ACTIVE' && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
      )}
      
      {module.locked && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all pointer-events-none">
          <span className="material-symbols-outlined text-gray-500 text-4xl group-hover:scale-110 transition-transform">lock</span>
        </div>
      )}

      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded border flex items-center justify-center ${
            module.status === 'ACTIVE' 
              ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_10px_rgba(249,115,22,0.2)]'
              : module.locked
              ? 'bg-white/5 border-white/10 text-gray-500'
              : 'bg-white/5 border-white/10 text-gray-300 group-hover:text-primary group-hover:border-primary/30'
          } transition-all`}>
            <span className="material-symbols-outlined text-2xl">{module.icon}</span>
          </div>
          
          {module.status === 'ACTIVE' ? (
            <span className="text-[10px] font-mono text-terminal-green border border-terminal-green/30 bg-terminal-green/10 px-2 py-1 rounded tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse"></span>
              ACTIVE
            </span>
          ) : module.locked ? (
            <span className="text-[10px] font-mono text-gray-600 border border-white/5 px-2 py-1 rounded tracking-wider">
              LOCKED
            </span>
          ) : (
            <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded tracking-wider">
              {module.pathId && `PATH_ID: ${module.pathId}`}
              {module.modId && `MOD_ID: ${module.modId}`}
              {module.langId && `LANG_ID: ${module.langId}`}
              {module.conceptId && `CONCEPT: ${module.conceptId}`}
            </span>
          )}
        </div>

        <h3 className={`text-xl font-serif mb-2 group-hover:text-primary transition-colors ${
          module.locked ? 'text-gray-300' : 'text-white'
        }`}>
          {module.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-2 mb-6 ${
          module.locked ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {module.description}
        </p>

        <div className="flex gap-2 flex-wrap">
          <span className={`text-[10px] font-mono px-2 py-1 rounded border ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty}
          </span>
          {module.lessons && (
            <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
              {module.lessons} LESSONS
            </span>
          )}
          {module.type && !module.lessons && (
            <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
              {module.type}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        {module.progress !== undefined && module.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono text-gray-400 mb-1.5">
              <span>Progress: Module {module.currentLesson}/{module.lessons}</span>
              <span className="text-white">{module.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {module.progress === 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono text-gray-400 mb-1.5">
              <span>Progress</span>
              <span className="text-white">0%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-white/20 w-0"></div>
            </div>
          </div>
        )}

        <button className={`w-full py-2.5 text-sm font-bold font-mono rounded transition-all flex items-center justify-center gap-2 group-btn ${
          module.status === 'ACTIVE'
            ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
            : module.locked
            ? 'bg-transparent border border-white/10 text-gray-500 cursor-not-allowed'
            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white'
        }`}>
          <span>{module.buttonText}</span>
          {module.status === 'ACTIVE' && (
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          )}
          {!module.status && !module.locked && (
            <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all">
              {module.difficulty === 'EXPERT' ? 'lock_open' : 'play_arrow'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;
