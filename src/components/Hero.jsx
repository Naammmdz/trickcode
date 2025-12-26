import LogoToAscii from './LogoToAscii';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 px-6 md:px-12 lg:px-24 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] grid-bg"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] opacity-30"></div>
      </div>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse shadow-[0_0_10px_#4ade80]"></span>
            <span className="text-xs font-mono text-gray-200 uppercase tracking-widest font-semibold">System Online: v2.4.0</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95] mb-8 tracking-tight drop-shadow-2xl">
            Engineered<br/>
            <span className="text-gray-400 italic font-light">for the</span><br/>
            Frontier
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-lg leading-relaxed font-light font-sans border-l-2 border-white/20 pl-6">
            The all-in-one platform to master algorithms, ace your technical interviews, and build the future with a community of elite developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-mono text-sm">
            <a className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-white/20" href="#problems">
              <span>$ start_coding</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
            <a className="px-8 py-4 bg-white/5 border border-white/20 hover:border-white/50 hover:bg-white/10 text-gray-200 hover:text-white font-medium rounded transition-all text-center flex items-center justify-center gap-2" href="#">
              view_challenges.sh
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 border border-black ring-2 ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-600 border border-black ring-2 ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-500 border border-black flex items-center justify-center text-white ring-2 ring-[#050505] font-bold">+2k</div>
            </div>
            <p className="font-medium tracking-wide">JOINING_QUEUE: 2,000+ DEVELOPERS</p>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full blur-3xl transform scale-75 opacity-40"></div>
          <div className="relative bg-[#121212] rounded-lg border border-white/20 shadow-2xl overflow-hidden backdrop-blur-sm group">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              </div>
              <div className="text-[10px] font-mono text-gray-400 font-medium">user@trickcode:~/platform</div>
              <div className="w-10"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <LogoToAscii />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
