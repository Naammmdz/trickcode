import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="selection:bg-primary/40 selection:text-white min-h-screen flex flex-col relative overflow-x-hidden bg-gray-50 dark:bg-frontier-black">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] grid-bg"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="w-full py-2 px-6 md:px-12 flex justify-between items-center z-50 relative">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              alt="TrickCode Logo"
              className="w-full h-full object-contain rounded"
              src={logo}
            />
          </div>
          <span className="text-xl font-serif tracking-tight text-gray-900 dark:text-white font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            TrickCode
          </span>
        </Link>
        <Link to="/" className="text-sm font-sans text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
          <span>Return Home</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-terminal-green shadow-[0_0_5px_#4ade80]"></span>
                <span className="text-[10px] font-sans text-gray-600 dark:text-gray-400">Get Started</span>
              </div>
              <h1 className="text-3xl font-serif text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Start your journey to master algorithms and ace interviews.</p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 rounded text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1V11.1Z"></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 rounded text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white dark:bg-[#151518] px-2 text-gray-500 dark:text-gray-500 font-sans">Or register manually</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400 font-mono">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans text-gray-600 dark:text-gray-400 font-medium ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-1 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 transition-all font-sans"
                    placeholder="e.g. Ada Lovelace"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-500 dark:text-gray-600 text-sm group-focus-within:text-neutral-700 dark:group-focus-within:text-neutral-300 transition-colors">person</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans text-gray-600 dark:text-gray-400 font-medium ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-1 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 transition-all font-sans"
                    placeholder="dev@codegamy.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-500 dark:text-gray-600 text-sm group-focus-within:text-neutral-700 dark:group-focus-within:text-neutral-300 transition-colors">mail</span>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans text-gray-600 dark:text-gray-400 font-medium ml-1">Password</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-1 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 transition-all font-sans"
                      placeholder="••••••••"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans text-gray-600 dark:text-gray-400 font-medium ml-1">Confirm</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-white dark:bg-[#0A0A0A] border border-gray-300 dark:border-white/10 rounded px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-1 focus:ring-neutral-500/50 dark:focus:ring-neutral-400/50 transition-all font-sans"
                      placeholder="••••••••"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500/80' : 'bg-red-500/80'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 12 ? 'bg-green-500/80' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 16 ? 'bg-green-500/80' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 20 ? 'bg-green-500/80' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                <span className={`text-[10px] font-sans ml-2 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formData.password.length >= 8 ? 'Strong' : 'Weak'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3.5 rounded hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 group font-sans text-sm border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-white/5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <Link
                  to="/login"
                  className="text-gray-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 font-bold font-sans ml-1 transition-colors underline decoration-gray-300 dark:decoration-white/20 underline-offset-4 hover:decoration-gray-500 dark:hover:decoration-neutral-400"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-6 text-xs text-gray-600 dark:text-gray-500 font-sans">
            <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Terms of Service</a>
            <span className="text-gray-400 dark:text-gray-700">|</span>
            <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Privacy Policy</a>
            <span className="text-gray-400 dark:text-gray-700">|</span>
            <a className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors" href="#">Help</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
