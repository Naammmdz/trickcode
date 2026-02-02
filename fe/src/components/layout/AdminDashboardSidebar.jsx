import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggler from '../ui/ThemeToggler';

const AdminDashboardSidebar = ({ currentTab, onTabChange }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserInitials = () => {
    const name = user?.name || user?.email || 'User';
    const parts = String(name).split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toLowerCase();
    return String(name)[0]?.toLowerCase() || 'u';
  };

  if (!isAdmin) return null;

  return (
    <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-neutral-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 h-full overflow-y-auto transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="size-8 flex items-center justify-center text-white bg-neutral-900 border border-neutral-900 rounded-md font-serif italic text-lg shadow-sm dark:bg-white dark:border-white dark:text-neutral-900">
              T
            </div>
            <span className="text-neutral-900 dark:text-white font-serif text-2xl tracking-tight">Trickcode</span>
          </Link>
          <ThemeToggler />
        </div>

        <nav className="space-y-1 mb-10">
          <button
            onClick={() => onTabChange('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'overview'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Overview
          </button>
          <button
            onClick={() => onTabChange('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'users'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            Users
          </button>
          <button
            onClick={() => onTabChange('roles')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'roles'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            Roles
          </button>
          <button
            onClick={() => onTabChange('permissions')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'permissions'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Permissions
          </button>
          <button
            onClick={() => onTabChange('courses')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'courses'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Courses
          </button>
          <button
            onClick={() => onTabChange('instructors')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'instructors'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            Instructors
          </button>
          <button
            onClick={() => onTabChange('payments')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTab === 'payments'
                ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-zinc-700'
                : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            Payments
          </button>
        </nav>

        <div>
          <h3 className="px-3 text-xs font-medium text-neutral-500 dark:text-zinc-400 uppercase tracking-widest mb-3 font-mono">
            Configure
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${currentTab === 'settings'
                  ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </div>
              <span className="material-symbols-outlined text-neutral-900 dark:text-white text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">
                arrow_forward
              </span>
            </button>
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 relative">
          <div className="size-9 rounded-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 flex items-center justify-center text-xs font-serif italic text-neutral-600 dark:text-neutral-300 shrink-0">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 truncate">{user?.email || ''}</p>
          </div>
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="material-symbols-outlined text-neutral-500 dark:text-zinc-400 text-[18px] cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors p-1 rounded hover:bg-neutral-100 dark:hover:bg-zinc-800"
          >
            more_vert
          </button>

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-neutral-200 dark:border-zinc-800 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-neutral-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 flex items-center justify-center text-xs font-serif italic text-neutral-600 dark:text-neutral-300 shrink-0">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400 truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onTabChange('settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  <span>Settings</span>
                </button>
                <div className="border-t border-neutral-200 dark:border-zinc-800 my-1"></div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminDashboardSidebar;
