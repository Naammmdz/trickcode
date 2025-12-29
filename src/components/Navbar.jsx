import { Link, useLocation } from 'react-router-dom';
import logo from '/logo.png';

const Navbar = ({ simple = false }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    return isActive(path)
      ? "text-white border-b border-primary pb-0.5 shadow-[0_4px_10px_rgba(249,115,22,0.2)] transition-colors duration-300"
      : "hover:text-primary transition-colors duration-300";
  };

  const navLinkPrefix = (path) => {
    return isActive(path) ? "// " : "";
  };

  return (
    <nav className="w-full py-2 px-6 md:px-12 bg-frontier-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo left */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <img
              alt="TrickCode Logo"
              className="w-full h-full object-contain rounded"
              src={logo}
            />
          </div>
          <span className="text-xl font-serif tracking-tight text-white font-medium">TrickCode</span>
        </div>
        {!simple && (
          <>
            {/* Center nav */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 text-sm font-medium text-gray-400 font-mono">
              <Link className={navLinkClass('/')} to="/">
                <span className="material-icons-outlined text-sm">home</span>
              </Link>
              <Link className={navLinkClass('/learn')} to="/learn">
                {navLinkPrefix('/learn')}Learn
              </Link>
              <Link className={navLinkClass('/problems')} to="/problems">
                {navLinkPrefix('/problems')}Problems
              </Link>
              <a className={navLinkClass('/contest')} href="#">
                {navLinkPrefix('/contest')}Contest
              </a>
              <a className={navLinkClass('/interview')} href="#">
                {navLinkPrefix('/interview')}Interview
              </a>
              <Link className={navLinkClass('/news')} to="/news">
                {navLinkPrefix('/news')}News_Feed
              </Link>
            </div>
            {/* Actions right */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link to="/login" aria-label="User Profile" className="p-2 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition text-gray-300 hover:text-white">
                <span className="material-icons-outlined text-sm">terminal</span>
              </Link>
              <button aria-label="Menu" className="md:hidden p-2 rounded bg-white/5 text-gray-300 hover:text-white">
                <span className="material-icons-outlined">menu</span>
              </button>
            </div>
          </>
        )}
        {simple && (
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-sharp-yellow transition group ml-auto"
          >
            <span>// HOME</span>
            <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
