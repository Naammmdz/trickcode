const NewsDetailSidebar = () => {
  const relatedArticles = [
    {
      id: 1,
      category: 'TECH',
      categoryColor: 'terminal-blue',
      date: 'Oct 12',
      title: 'Rust vs C++: Performance Analysis'
    },
    {
      id: 2,
      category: 'DEVLOG',
      categoryColor: 'terminal-purple',
      date: 'Sep 28',
      title: 'Understanding Memory Allocation'
    },
    {
      id: 3,
      category: 'UPDATE',
      categoryColor: 'primary',
      date: 'Sep 15',
      title: 'Codegamy IDE v2.5 Release Notes'
    }
  ];

  return (
    <aside className="lg:col-span-4 space-y-8">
      {/* Action Buttons */}
      <div className="bg-frontier-card border border-white/10 rounded-lg p-6">
        <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">
          Transmission_Control
        </h4>
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 text-sm py-2 rounded transition-all">
            <span className="material-symbols-outlined text-base">bookmark</span> Save for Later
          </button>
          <button className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 text-sm py-2 rounded transition-all">
            <span className="material-symbols-outlined text-base">share</span> Share Protocol
          </button>
        </div>
      </div>

      {/* Related Articles */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider">Related_Logs</h3>
        </div>
        <div className="space-y-4">
          {relatedArticles.map(article => (
            <a 
              key={article.id}
              className="block bg-frontier-card border border-white/10 hover:border-primary/40 rounded p-4 group transition-all hover:-translate-y-1" 
              href="#"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] text-${article.categoryColor} font-mono border border-${article.categoryColor}/20 bg-${article.categoryColor}/5 px-1.5 py-0.5 rounded`}>
                  {article.category}
                </span>
                <span className="text-[10px] text-gray-600 font-mono">{article.date}</span>
              </div>
              <h4 className="text-white font-serif text-base group-hover:text-primary transition-colors">
                {article.title}
              </h4>
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-[#121212] to-black border border-white/10 p-5 rounded relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
        <h4 className="text-white font-serif text-lg mb-2 relative z-10">Stay synced.</h4>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed relative z-10">
          Don't miss the next platform upgrade.
        </p>
        <div className="flex gap-2 relative z-10">
          <input 
            className="w-full bg-black/50 border border-white/10 rounded text-xs p-2 text-white focus:border-primary/50 outline-none" 
            placeholder="email@addr.ess" 
            type="email"
          />
          <button className="bg-primary hover:bg-primary-hover text-white rounded p-2 transition-colors">
            <span className="material-icons-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default NewsDetailSidebar;
