import { Link } from 'react-router-dom';

const ProblemsHeader = () => {
  return (
    <section className="relative pt-16 pb-12 px-6 md:px-12 border-b border-white/10 bg-frontier-black overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs mb-3 uppercase tracking-wider">
              <Link to="/" className="hover:text-primary-hover transition-colors">
                <span className="material-symbols-outlined text-sm">home</span>
              </Link>
              <span>/</span>
              <span className="font-bold">Problems</span>
            </div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase tracking-wider font-bold">
                V 2.4.1 Stable
              </span>
              <span className="text-gray-500 text-xs font-mono">// DATABASE_ACCESS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Algorithm Database</h1>
            <p className="text-gray-400 max-w-2xl text-sm font-light">
              Browse our extensive collection of coding challenges. Filter by difficulty, tag, or status to find your next frontier.
            </p>
          </div>
          
          <div className="flex items-center gap-4 font-mono text-sm">
            <div className="bg-frontier-card px-4 py-2 rounded border border-white/10 flex items-center gap-3">
              <span className="text-gray-500 text-xs uppercase">Your Rank</span>
              <span className="text-white font-bold">14,203</span>
            </div>
            <div className="bg-frontier-card px-4 py-2 rounded border border-white/10 flex items-center gap-3">
              <span className="text-gray-500 text-xs uppercase">Solved</span>
              <span className="text-terminal-green font-bold">42/1500</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsHeader;
