import Beams from './Beams';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 px-6 md:px-12 lg:px-24 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Beams 
          beamWidth={2}
          beamHeight={15}
          beamNumber={16}
          lightColor="#f97316"
          speed={1.5}
          noiseIntensity={1.5}
          scale={0.25}
          rotation={25}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse shadow-[0_0_10px_#4ade80]"></span>
            <span className="text-xs font-mono text-gray-200 uppercase tracking-widest font-semibold">System Online: v2.4.0</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95] mb-8 tracking-tight drop-shadow-2xl">
            Engineered<br/>
            <span className="text-gray-400 italic font-light">for the</span><br/>
            Frontier
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed font-light font-sans">
            The all-in-one platform to master algorithms, ace your technical interviews, and build the future with a community of elite developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 font-mono text-sm">
            <a className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-white/20" href="#problems">
              <span>$ start_coding</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
            <a className="px-8 py-4 bg-white/5 border border-white/20 hover:border-white/50 hover:bg-white/10 text-gray-200 hover:text-white font-medium rounded transition-all text-center flex items-center justify-center gap-2" href="#">
              view_challenges.sh
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 border border-black ring-2 ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-600 border border-black ring-2 ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-500 border border-black flex items-center justify-center text-white ring-2 ring-[#050505] font-bold">+2k</div>
            </div>
            <p className="font-medium tracking-wide">JOINING_QUEUE: 2,000+ DEVELOPERS</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
