
const ProblemRow = ({ problem }) => {
  const getStatusIcon = () => {
    if (problem.status === 'solved') {
      return <span className="material-icons-outlined text-terminal-green text-lg" title="Solved">check_circle</span>;
    } else if (problem.status === 'attempted') {
      return <span className="material-icons-outlined text-gray-600 text-lg" title="Attempted">data_usage</span>;
    } else {
      return <div className="w-4 h-4 rounded border border-gray-600 group-hover:border-primary/50"></div>;
    }
  };

  const getDifficultyBadge = () => {
    const styles = {
      Easy: 'text-terminal-green bg-green-500/10 border-green-500/20',
      Medium: 'text-sharp-yellow bg-yellow-500/10 border-yellow-500/20',
      Hard: 'text-red-500 bg-red-500/10 border-red-500/20'
    };
    
    return (
      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${styles[problem.difficulty]}`}>
        {problem.difficulty}
      </span>
    );
  };

  const cardClasses = problem.featured 
    ? "frontier-card border-neon-blue/30 bg-[#081b21] md:grid md:grid-cols-12 md:gap-4 md:items-center p-4 md:px-6 md:py-4 rounded group relative hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    : "frontier-card md:grid md:grid-cols-12 md:gap-4 md:items-center p-4 md:px-6 md:py-4 rounded group relative hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:bg-[#1c1c1f]";

  const titleClasses = problem.featured
    ? "text-neon-blue font-bold text-base md:text-sm group-hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
    : "text-white font-medium text-base md:text-sm group-hover:text-primary transition-colors cursor-pointer";

  const tagClasses = problem.featured
    ? "text-[10px] text-cyan-200/50 bg-neon-blue/5 px-1.5 rounded border border-neon-blue/10"
    : "text-[10px] text-gray-500 bg-white/5 px-1.5 rounded border border-white/5";

  return (
    <div className={cardClasses}>
      {problem.featured && (
        <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      )}
      
      {/* Status Icon */}
      <div className="md:col-span-1 flex items-center justify-between md:justify-start mb-2 md:mb-0">
        {problem.featured ? (
          <span className="material-icons-outlined text-neon-blue text-lg animate-pulse" title="Recommended">star</span>
        ) : (
          getStatusIcon()
        )}
        <span className="md:hidden text-xs text-gray-500 font-mono">#{problem.id}</span>
      </div>

      {/* Title and Tags */}
      <div className="md:col-span-5 mb-2 md:mb-0">
        <h3 className={titleClasses}>
          {problem.id}. {problem.title}
          {problem.featured && (
            <span className="px-1.5 py-0.5 text-[10px] bg-neon-blue/20 text-neon-blue border border-neon-blue/40 rounded uppercase font-mono">
              Featured
            </span>
          )}
        </h3>
        <div className="flex gap-2 mt-1">
          {problem.tags.map((tag, index) => (
            <span key={index} className={tagClasses}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Acceptance Rate */}
      <div className="md:col-span-2 text-sm text-gray-400 font-mono mb-2 md:mb-0">
        {problem.acceptance}
      </div>

      {/* Difficulty Badge */}
      <div className="md:col-span-2 mb-2 md:mb-0">
        {getDifficultyBadge()}
      </div>

      {/* Action Button */}
      <div className="md:col-span-2 flex justify-end">
        {problem.featured ? (
          <button className="p-2 rounded-full bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="material-icons-outlined text-lg">arrow_forward</span>
          </button>
        ) : (
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
            <span className="material-icons-outlined text-lg">code</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProblemRow;
