const Footer = () => {
  return (
    <footer className="bg-[#020202] pt-16 pb-8 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 flex items-center justify-center bg-white/10 rounded p-0.5 border border-white/10">
                <img 
                  alt="TrickCode Logo" 
                  className="w-full h-full object-contain filter invert opacity-90" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW1hrQ6OXGqOQLbYFycaquHMran-Id30NrQY3ropyRT-QCbC0cPOQ-Dip2o5fcCKji8F6h213ZhMHAqwU2oKK468q5ngtpf0QOSa8lD1eplvXS7-1ipYSgQNTtfPVH-47g3d7WCyxsdPXaiovHrDQB68kSIO1FFvFG-3RCRKa3tYWoa3H-gjErZKwWbou1l8AyIBkZnbZGXoS7Lwq1egXrlgy7n9wsBTNhhG7CRKRKP2o5TGz0lhNf23Dp9t43hgJv3MIR8pTo0BKH"
                />
              </div>
              <span className="text-lg font-serif font-bold text-white tracking-wide">TRICKCODE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Engineered for performance. The premier environment for algorithmic mastery and technical collaboration.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase mb-6 tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#">Problems</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contests</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Interview Prep</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase mb-6 tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase mb-6 tracking-widest">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-mono">
            © 2024 TrickCode Inc. All rights reserved. System V.2.0
          </p>
          <div className="flex items-center gap-4">
            <a aria-label="Twitter" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/30" href="#">
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a aria-label="GitHub" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/30" href="#">
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
              </svg>
            </a>
            <a aria-label="LinkedIn" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/30" href="#">
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fillRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
