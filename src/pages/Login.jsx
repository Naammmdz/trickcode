import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="selection:bg-primary/40 selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] grid-bg"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-20"></div>
      </div>
      
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-50 relative">
        <a className="flex items-center gap-3 group" href="/">
          <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img 
              alt="TrickCode Logo" 
              className="w-full h-full object-contain rounded" 
              src="/logo.png"
            />
          </div>
          <span className="text-xl font-serif tracking-tight text-white font-medium group-hover:text-primary transition-colors">TrickCode</span>
        </a>
        <a className="text-sm font-mono text-gray-400 hover:text-white transition-colors flex items-center gap-2 group" href="/">
          <span>// Return Home</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-terminal-green shadow-[0_0_5px_#4ade80]"></span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">System Online</span>
              </div>
              <h1 className="text-3xl font-serif text-white mb-2 tracking-tight">Access Terminal</h1>
              <p className="text-sm text-gray-400 font-light">Enter credentials to access the mainframe.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-sm text-gray-300 hover:text-white transition-all duration-200 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1V11.1Z"></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-sm text-gray-300 hover:text-white transition-all duration-200 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#151518] px-2 text-gray-500 font-mono">Or authenticate manually</span>
              </div>
            </div>

            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-gray-400 font-bold uppercase tracking-wide ml-1">Email or Username</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans" 
                    placeholder="user@trickcode.com" 
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-600 text-sm group-focus-within:text-primary transition-colors">person</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs font-mono text-gray-400 font-bold uppercase tracking-wide">Password</label>
                  <a className="text-xs text-primary/80 hover:text-primary transition-colors font-mono" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-600 text-sm group-focus-within:text-primary transition-colors">lock</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center gap-2 group font-mono text-sm uppercase tracking-wide border border-transparent hover:border-white/20"
              >
                <span>Initiate_Session</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">login</span>
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
              <p className="text-sm text-gray-400">
                New to the frontier? 
                <Link to="/signup" className="text-white hover:text-primary font-bold font-mono ml-1 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-primary/50">Sign Up</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500 font-mono">
            <a className="hover:text-gray-300 transition-colors" href="#">Terms of Service</a>
            <span className="text-gray-700">|</span>
            <a className="hover:text-gray-300 transition-colors" href="#">Privacy Policy</a>
            <span className="text-gray-700">|</span>
            <a className="hover:text-gray-300 transition-colors" href="#">Help</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
