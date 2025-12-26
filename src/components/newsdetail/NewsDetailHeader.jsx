
const NewsDetailHeader = () => {
  return (
    <header className="mb-10 border-b border-white/10 pb-10">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-2xl">
        Codegamy IDE v3.0: <span className="text-primary/90 italic">Engineered for Speed</span>
      </h1>
      <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            <img 
              alt="Author" 
              className="w-full h-full object-cover opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClkR1W1jPXa9vFOAJ6AA39MvssvCHUGsgK-4QqxkbryUtbu2Oe55SqKZZ7yvQOMy3eAG8hCabbZX6DHiFEFKl23-FTmfUTrlDcotEYFbk04bA9qUQuOHs5vpYqB8PL5mgdvaf6PwDgknErpmH0Q5XhWu6vOgFNCJJELpc2HQNMBCGAbyZeZNOg0zOKA5OXBOyU593z_m17S16MA_ck1pDkZ21T84DEgVgN0Yz6RmRtlsb2p_r_kRkiev5ueYaygYmuk7m51lAxctvN"
            />
          </div>
          <div>
            <span className="block text-gray-200 text-xs">Alex Chen</span>
            <span className="block text-[10px] text-gray-500 uppercase">Sys_Architect</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/10"></div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <time dateTime="2023-10-24">2023-10-24</time>
        </div>
        <div className="h-8 w-px bg-white/10"></div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>3 min read</span>
        </div>
      </div>
    </header>
  );
};

export default NewsDetailHeader;
