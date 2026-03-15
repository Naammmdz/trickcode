import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggler from '../ui/ThemeToggler';
import { courseService } from '../../services/courseService';
import { proSubscriptionService } from '../../services/proService';

const Navbar = ({ simple = false, transparent = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, hasRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [proStatus, setProStatus] = useState(null);
  const dropdownRef = useRef(null);
  const catDropdownRef = useRef(null);
  const catTimeoutRef = useRef(null);

  // Fetch Pro status
  useEffect(() => {
    if (!isAuthenticated) return;
    proSubscriptionService.getStatus()
      .then(data => setProStatus(data))
      .catch(() => setProStatus(null));
  }, [isAuthenticated]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategories();
        const cats = data?.content || data || [];
        setCategories(Array.isArray(cats) ? cats.filter(c => c.isActive !== false) : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setCatDropdownOpen(false);
      }
    };
    if (dropdownOpen || catDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, catDropdownOpen]);

  const handleCatMouseEnter = () => {
    if (catTimeoutRef.current) clearTimeout(catTimeoutRef.current);
    setCatDropdownOpen(true);
  };

  const handleCatMouseLeave = () => {
    catTimeoutRef.current = setTimeout(() => setCatDropdownOpen(false), 200);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.firstName.trim()) {
      const fi = user.firstName.trim()[0];
      const li = user.lastName?.trim()?.[0] || '';
      return (fi + li).toUpperCase() || 'U';
    }
    if (user.name && user.name.trim()) {
      const parts = user.name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      if (parts.length === 1) return parts[0][0].toUpperCase();
    }
    if (user.email) return user.email.trim()[0].toUpperCase();
    if (user.login) return user.login.trim()[0].toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.firstName?.trim() || user.name?.trim() || user.email?.split('@')[0] || user.login || 'User';
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const categoryIcons = {
    'Data Structures': 'data_object',
    'Algorithms': 'code_blocks',
    'Graph Theory': 'scatter_plot',
    'Trees & Graphs': 'account_tree',
    'Sorting & Searching': 'sort',
    'Math & Geometry': 'functions',
    'Dynamic Programming': 'dynamic_feed',
    'System Design': 'architecture',
  };

  return (
    <nav className="fixed w-full z-50 top-0 bg-white dark:bg-[#0a0a0a] backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img
              alt="TrickCode Logo"
              className="w-full h-full object-contain rounded"
              src={logo}
            />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-neutral-900 dark:text-white">Trickcode</span>
        </Link>

        {!simple && (
          <>
            {/* Center nav links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              <Link
                to="/"
                className={`hover:text-orange-500 transition-colors ${isActive('/') ? 'text-orange-500' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/learn"
                className={`hover:text-orange-500 transition-colors ${isActive('/learn') || isActive('/marketplace') ? 'text-orange-500' : ''}`}
              >
                Courses
              </Link>
              {/* Categories dropdown */}
              <div
                ref={catDropdownRef}
                className="relative"
                onMouseEnter={handleCatMouseEnter}
                onMouseLeave={handleCatMouseLeave}
              >
                <button
                  className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                  onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                >
                  Categories
                  <span className={`material-symbols-outlined text-[16px] transition-transform ${catDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {catDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="py-2">
                      {categories.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-neutral-400">No categories available</div>
                      ) : (
                        categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/learn?category=${cat.id}`}
                            onClick={() => setCatDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px] text-neutral-400">
                              {categoryIcons[cat.name] || 'category'}
                            </span>
                            {cat.name}
                          </Link>
                        ))
                      )}
                    </div>
                    <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-2.5">
                      <Link
                        to="/learn"
                        onClick={() => setCatDropdownOpen(false)}
                        className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
                      >
                        View all courses <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Search */}
              <div className="hidden sm:block relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-neutral-800 rounded-full text-sm outline-none transition-all w-52 dark:text-white placeholder:text-neutral-400"
                />
              </div>

              <ThemeToggler />

              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all text-neutral-800 dark:text-neutral-200 text-sm group"
                  >
                    <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                      {getUserInitials()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate font-medium">
                      {getUserDisplayName()}
                    </span>
                    <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:rotate-180 transition-transform">
                      {dropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`.trim()
                            : getUserDisplayName()}
                        </p>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {user?.email || user?.login || ''}
                        </p>
                      </div>
                      <div className="py-1">
                        {(isAdmin || user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN') || user?.login === 'admin') && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">dashboard</span>
                            Admin Dashboard
                          </Link>
                        )}
                        {(user?.roles?.includes('ROLE_INSTRUCTOR') || user?.authorities?.includes('ROLE_INSTRUCTOR')) && (
                          <Link
                            to="/instructor"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">school</span>
                            Instructor Dashboard
                          </Link>
                        )}
                        <Link
                          to="/my-courses"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">menu_book</span>
                          My Courses
                        </Link>
                        {!(user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN')) && (
                          <Link
                            to="/transactions"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">receipt</span>
                            Transaction History
                          </Link>
                        )}
                        {/* Pro Status / Upgrade */}
                        {!(user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN')) && (
                          proStatus?.isPro ? (
                            <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
                              <span className="material-symbols-outlined text-[18px]">verified</span>
                              Pro Active
                            </div>
                          ) : (
                            <Link
                              to={`/checkout/pro${hasRole('ROLE_INSTRUCTOR') ? '?plan=INSTRUCTOR_PRO' : '?plan=STUDENT_PRO'}`}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                              Upgrade to Pro
                            </Link>
                          )
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">person</span>
                          Profile
                        </Link>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 mx-3 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <button aria-label="Menu" className="md:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </>
        )}
        {simple && (
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition group ml-auto"
          >
            <span>Home</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
