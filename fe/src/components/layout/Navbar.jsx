import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggler from '../ui/ThemeToggler';

const Navbar = ({ simple = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    return isActive(path)
      ? "text-gray-900 dark:text-white border-b border-primary pb-0.5 transition-colors duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:bg-transparent"
      : "text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:bg-transparent";
  };

  const navLinkPrefix = (path) => {
    return isActive(path) ? "// " : "";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="w-full py-2 px-6 md:px-12 bg-white/95 dark:bg-frontier-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 dark:border-white/10 shadow-sm">
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
          <span className="text-xl font-serif tracking-tight text-gray-900 dark:text-white font-medium">TrickCode</span>
        </div>
        {!simple && (
          <>
            {/* Center nav */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400 font-mono">
              <Link className={navLinkClass('/')} to="/">
                <span className="material-icons-outlined text-sm text-gray-600 dark:text-gray-400">home</span>
              </Link>
              <Link className={navLinkClass('/learn')} to="/learn">
                {navLinkPrefix('/learn')}Learn
              </Link>
            </div>
            {/* Actions right */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <ThemeToggler />
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all text-white font-mono text-sm group"
                    aria-label="User Menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/40 flex items-center justify-center text-xs font-bold border border-primary/50">
                      {getUserInitials()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <span className="material-icons-outlined text-sm group-hover:rotate-180 transition-transform">
                      {dropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                          {user?.email || ''}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <span className="material-icons-outlined text-base">person</span>
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        >
                          <span className="material-icons-outlined text-base">logout</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-all text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-mono text-sm group"
                  aria-label="Login"
                >
                  <span className="material-icons-outlined text-sm">login</span>
                  <span className="hidden sm:inline-block">Login</span>
                </Link>
              )}
              <button aria-label="Menu" className="md:hidden p-2 rounded bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="material-icons-outlined">menu</span>
              </button>
            </div>
          </>
        )}
        {simple && (
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-sharp-yellow transition group ml-auto"
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
