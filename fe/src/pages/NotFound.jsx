import { Link } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';

const NotFound = () => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center relative z-10 px-6 pt-24 pb-12">
        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-neutral-200 dark:border-neutral-800 rounded-full bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-sans tracking-widest text-neutral-500 uppercase">System Error</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-neutral-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
            Page Not Found
            <span className="sm:hidden block mt-2">404</span>
          </h1>
          
          <div className="w-24 h-px bg-neutral-200 dark:border-neutral-800 mx-auto mb-10"></div>
          
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto mb-12 font-light leading-relaxed">
            The page you're looking for doesn't exist. It may have been moved or removed.
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">west</span>
              Return to Base
            </Link>
          </div>
          
          <div className="mt-16 opacity-30 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <p>Error Code: 0x404_MISSING_INDEX</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-sans uppercase text-neutral-400">
            <span>© 2024 Trickcode Inc.</span>
          </div>
          <div className="flex gap-8 text-[10px] font-sans uppercase text-neutral-400">
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Docs</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Status</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
