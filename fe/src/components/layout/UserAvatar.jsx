import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { proSubscriptionService } from '../../services/proService';

const UserAvatar = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [proStatus, setProStatus] = useState(null);

  // Fetch Pro status
  useEffect(() => {
    if (!isAuthenticated) return;
    proSubscriptionService.getStatus()
      .then(data => setProStatus(data))
      .catch(() => setProStatus(null));
  }, [isAuthenticated]);

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

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans uppercase px-5 py-2 hover:opacity-90 transition-opacity rounded">
        Join Free
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-all group"
        aria-label="User Menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-xs font-bold text-primary border border-primary/30">
          {getUserInitials()}
        </div>
        <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-sans text-neutral-700 dark:text-neutral-300">
          {user?.name || user?.email?.split('@')[0] || 'User'}
        </span>
        <span className="material-symbols-outlined text-sm text-neutral-500 dark:text-neutral-400 group-hover:rotate-180 transition-transform">
          {dropdownOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1">
              {user?.email || ''}
            </p>
          </div>
          <div className="py-1">
            {user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN') ? (
              <Link
                to="/admin"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors font-sans"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                Admin Dashboard
              </Link>
            ) : user?.roles?.includes('ROLE_INSTRUCTOR') || user?.authorities?.includes('ROLE_INSTRUCTOR') ? (
              <Link
                to="/instructor"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors font-sans"
              >
                <span className="material-symbols-outlined text-base">school</span>
                Instructor Dashboard
              </Link>
            ) : (
              <Link
                to="/my-courses"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors font-sans"
              >
                <span className="material-symbols-outlined text-base">book</span>
                My Courses
              </Link>
            )}
            {!(user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN')) && (
              <Link
                to="/transactions"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors font-sans"
              >
                <span className="material-symbols-outlined text-base">receipt</span>
                Transaction History
              </Link>
            )}
            {!(user?.roles?.includes('ROLE_ADMIN') || user?.authorities?.includes('ROLE_ADMIN')) && (
              proStatus?.isPro ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 font-sans">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Pro Active</span>
                </div>
              ) : (
                <Link
                  to={`/checkout/pro${hasRole('ROLE_INSTRUCTOR') ? '?plan=INSTRUCTOR_PRO' : '?plan=STUDENT_PRO'}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors font-sans font-medium"
                >
                  <span className="material-symbols-outlined text-base">workspace_premium</span>
                  Upgrade to Pro
                </Link>
              )
            )}
            <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors font-sans"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors font-sans"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
