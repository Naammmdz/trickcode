import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.name || 'Alex Chen');
  const [email, setEmail] = useState(user?.email || 'alex.chen@example.com');
  const [bio, setBio] = useState('Optimizing for O(log n) in life and code.');
  
  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [communityMentions, setCommunityMentions] = useState(true);
  const [systemLogs, setSystemLogs] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Implement save profile logic
    console.log('Saving profile:', { displayName, email, bio });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // TODO: Implement change password logic
    console.log('Changing password');
  };

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

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8">
            <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-4">
              <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Account</Link>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-primary">Settings</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 dark:text-white">
              Student Profile & Settings
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <nav className="space-y-1 sticky top-32">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`group w-full flex items-center justify-between px-0 py-3 text-xs font-sans uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 transition-all hover:pl-2 ${
                    activeSection === 'profile'
                      ? 'text-primary'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <span>01. Profile Info</span>
                  <span className={`material-symbols-outlined text-sm transition-opacity ${
                    activeSection === 'profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection('security')}
                  className={`group w-full flex items-center justify-between px-0 py-3 text-xs font-sans uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 transition-all hover:pl-2 ${
                    activeSection === 'security'
                      ? 'text-primary'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <span>02. Security</span>
                  <span className={`material-symbols-outlined text-sm transition-opacity ${
                    activeSection === 'security' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`group w-full flex items-center justify-between px-0 py-3 text-xs font-sans uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 transition-all hover:pl-2 ${
                    activeSection === 'notifications'
                      ? 'text-primary'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <span>03. Notifications</span>
                  <span className={`material-symbols-outlined text-sm transition-opacity ${
                    activeSection === 'notifications' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    arrow_forward
                  </span>
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-20">
              {/* Profile Info Section */}
              {activeSection === 'profile' && (
                <section className="scroll-mt-32" id="profile">
                  <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 font-light">badge</span>
                    Profile Info
                  </h2>
                  <form onSubmit={handleSaveProfile}>
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                      <div className="flex flex-col md:flex-row gap-8 items-start mb-10 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-full border-2 border-neutral-900 dark:border-white p-1">
                            <img
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu0RXnPPxrcXpHEA7z6wmbzQaPsXfSh32FtMfn7atapnwg3Vyn7FUxFFOWhzQRzzMEc69XrP1U-Tial4oUg7XkDANuiYegtct7RWU5pT4ER3PRcUu2tHNNkE-cn9TniQb7K20bE78ciVwcQAkfV4vhJJ7ZUKqptTCDbB6f2Pypu0WUnkwsXJITLOJ1sRURWekBz9uZK3C8LRI-pe3q-qAKhqumOtjAVZHfSCmHRfcayCiddZIZ-_3eNOCfMobDGApoLlz-xmLVII6P"
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-symbols-outlined text-white bg-black/50 rounded-full p-2">edit</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-3 pt-2">
                          <div>
                            <h3 className="font-serif text-2xl">{displayName}</h3>
                            <p className="text-sm text-neutral-500 font-mono mt-1">ID: 884-XJ • Candidate Lvl 5</p>
                          </div>
                          <button
                            type="button"
                            className="text-[10px] font-sans uppercase tracking-widest text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
                          >
                            Upload New Avatar
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Display Name</label>
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none placeholder-neutral-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none placeholder-neutral-400"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Bio / Mission Statement</label>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="3"
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none placeholder-neutral-400"
                          />
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-neutral-200 dark:shadow-none"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </section>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <section className="scroll-mt-32" id="security">
                  <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 font-light">lock</span>
                    Security
                  </h2>
                  <form onSubmit={handleChangePassword}>
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Current Password</label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-sans uppercase tracking-widest text-neutral-500">Confirm Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 p-3 text-sm font-sans focus:border-primary focus:ring-0 transition-colors rounded-none"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800 pt-8 md:pt-0 md:pl-12">
                          <div className="mb-6">
                            <h4 className="font-serif text-lg mb-2">Secure Your Account</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                              Ensure your protocol access remains exclusive. We recommend a unique password with at least 12 characters including symbols.
                            </p>
                          </div>
                          <div className="flex flex-col gap-4">
                            <button
                              type="submit"
                              className="w-full bg-transparent border border-neutral-900 dark:border-white text-neutral-900 dark:text-white px-6 py-3 text-xs font-sans uppercase tracking-widest hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors"
                            >
                              Change Protocol
                            </button>
                            <span className="text-[10px] text-neutral-400 font-sans text-center">Last updated: 3 months ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </section>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <section className="scroll-mt-32" id="notifications">
                  <h2 className="text-xl font-serif mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-400 font-light">notifications_active</span>
                    Notifications
                  </h2>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                    <div className="flex items-center justify-between p-8 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                      <div className="pr-8">
                        <h4 className="font-serif text-lg mb-1">Course Updates</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                          Receive email alerts when new modules or labs are added to your enrolled protocols.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={courseUpdates}
                          onChange={(e) => setCourseUpdates(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-8 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                      <div className="pr-8">
                        <h4 className="font-serif text-lg mb-1">Community Mentions</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                          Get notified immediately when peers discuss your solutions or reply to your comments.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={communityMentions}
                          onChange={(e) => setCommunityMentions(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-8 hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                      <div className="pr-8">
                        <h4 className="font-serif text-lg mb-1">System Logs</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                          Weekly summary of login activity, device access, and security alerts.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={systemLogs}
                          onChange={(e) => setSystemLogs(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase text-neutral-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img
              alt="TrickCode Logo"
              className="w-4 h-4 object-contain rounded"
              src={logo}
            />
            <span className="font-serif font-bold text-neutral-900 dark:text-white">Trickcode Inc.</span>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Support</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Log Out</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
