import { Link } from 'react-router-dom';

const NewsFeedHeader = ({ title, subtitle, additionalText, description, isLive = true }) => {
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
          <span className="font-bold">News Feed</span>
        </div>
        {isLive && (
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#F97316]"></span>
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest font-semibold">
              Live Transmission
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 tracking-tight drop-shadow-xl">
          {title} <span className="text-gray-500 italic font-light">{subtitle}</span> {additionalText}
        </h1>
        <p className="text-gray-400 max-w-2xl text-base md:text-lg font-light leading-relaxed border-l border-primary/30 pl-6">
          {description}
        </p>
      </div>
    </header>
  );
};

export default NewsFeedHeader;
