import { useEffect, useState } from 'react';
import Beams from './Beams';
import LightRays from '../ui/LightRays';
import FlickeringGrid from '../ui/FlickeringGrid';

const Hero = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative pt-20 pb-32 px-6 md:px-12 lg:px-24 overflow-hidden min-h-screen flex items-center bg-gray-50 dark:bg-frontier-black text-gray-900 dark:text-gray-200 -mt-[1px]">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color={isDark ? "rgb(249, 115, 22)" : "rgb(249, 115, 22)"}
          maxOpacity={isDark ? 0.15 : 0.08}
          className="absolute inset-0"
        />
        {isDark ? (
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
        ) : (
          <LightRays 
            count={12}
            color="rgba(249, 115, 22, 0.35)"
            blur={32}
            speed={12}
            length="100vh"
          />
        )}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded bg-white/60 dark:bg-white/10 border border-gray-200/50 dark:border-white/20 mb-8 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse shadow-[0_0_10px_#4ade80]"></span>
            <span className="text-xs font-mono text-gray-700 dark:text-gray-200 uppercase tracking-widest font-semibold">System Online: v2.4.0</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-gray-900 dark:text-white leading-[0.95] mb-8 tracking-tight drop-shadow-2xl">
            Engineered
            <br />
            <span className="text-gray-500 dark:text-gray-400 italic font-light">for the</span>
            <br />
            Frontier
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed font-light font-sans">
            The all-in-one platform to master algorithms, ace your technical interviews, and build the future with a community of elite developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 font-mono text-sm">
            <a className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-white/20" href="#problems">
              <span>$ start_coding</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
            <a className="px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/50 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium rounded transition-all text-center flex items-center justify-center gap-2" href="#">
              view_challenges.sh
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-4 text-xs font-mono text-gray-600 dark:text-gray-400">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border border-white ring-2 ring-gray-100 dark:ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border border-white ring-2 ring-gray-100 dark:ring-[#050505]"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-500 border border-white flex items-center justify-center text-gray-900 dark:text-white ring-2 ring-gray-100 dark:ring-[#050505] font-bold">
                +2k
              </div>
            </div>
            <p className="font-medium tracking-wide">JOINING_QUEUE: 2,000+ DEVELOPERS</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
