import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth(); // Need login to refresh context maybe, but authService.updateProfile returns latest
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Optimizing for O(log n) in life and code.');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification states - removed as unused by backend

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile({
        firstName,
        lastName,
        email,
        langKey: 'en'
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-8 relative">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              <Link to="/my-courses" className="hover:text-primary transition-colors">Account</Link>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-primary">Settings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-4">
              Student Profile
              {user?.roles?.includes('ROLE_PRO_USER') && (
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-normal">
                  Pro Member
                </span>
              )}
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <nav className="space-y-2 sticky top-32 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'profile'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Profile Info
                </button>
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === 'security'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">shield_lock</span>
                  Security
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-8">
              {/* Profile Info Section */}
              {activeSection === 'profile' && (
                <section className="scroll-mt-32" id="profile">
                  <form onSubmit={handleSaveProfile}>
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/20 dark:shadow-none transition-all">
                      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-10 pb-10 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="relative group cursor-pointer">
                          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-800 shadow-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            <img
                              alt="Profile"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0RXnPPxrcXpHEA7z6wmbzQaPsXfSh32FtMfn7atapnwg3Vyn7FUxFFOWhzQRzzMEc69XrP1U-Tial4oUg7XkDANuiYegtct7RWU5pT4ER3PRcUu2tHNNkE-cn9TniQb7K20bE78ciVwcQAkfV4vhJJ7ZUKqptTCDbB6f2Pypu0WUnkwsXJITLOJ1sRURWekBz9uZK3C8LRI-pe3q-qAKhqumOtjAVZHfSCmHRfcayCiddZIZ-_3eNOCfMobDGApoLlz-xmLVII6P"}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white">photo_camera</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-4 text-center sm:text-left pt-2">
                          <div>
                            <h3 className="text-3xl font-bold tracking-tight">{firstName} {lastName}</h3>
                            <p className="text-neutral-500 font-medium mt-1">ID: {user?.id || '884-XJ'}</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">upload</span>
                            Upload New Avatar
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">First Name</label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl placeholder-neutral-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl placeholder-neutral-400"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl placeholder-neutral-400"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Bio / Mission Statement</label>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="4"
                            className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl placeholder-neutral-400 resize-none"
                          />
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSaving && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
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
                  <form onSubmit={handleChangePassword}>
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-8 sm:p-10 shadow-xl shadow-neutral-200/20 dark:shadow-none transition-all">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        <div className="md:col-span-3 space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">Change Password</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-8">Update your password to keep your account secure.</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Current Password</label>
                            <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 ml-1">Confirm Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800 pt-8 md:pt-0 md:pl-10">
                          <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                            <h4 className="font-semibold text-lg mb-2 text-primary flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px]">verified_user</span>
                              Secure Account
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              Ensure your protocol access remains exclusive. We recommend a unique password with at least 12 characters including numbers and symbols.
                            </p>
                          </div>
                          <div className="flex flex-col gap-4 mt-auto">
                            <button
                              type="submit"
                              disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                              className="w-full bg-neutral-900 border border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900 px-6 py-3.5 rounded-xl font-semibold shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isSaving ? <span className="material-symbols-outlined text-sm animate-spin">sync</span> : <span className="material-symbols-outlined text-[20px]">key</span>}
                              Update Password
                            </button>
                            <span className="text-xs text-neutral-400 font-medium text-center">Last updated: 3 months ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
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
