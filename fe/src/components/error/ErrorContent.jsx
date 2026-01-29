import React from 'react';
import { Link } from 'react-router-dom';

const ErrorContent = () => {
    return (
        <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                System Error
            </div>
            <div className="space-y-2">
                <h1 className="text-7xl md:text-8xl font-serif text-white leading-none tracking-tighter">
                    404
                </h1>
                <h2 className="text-xl md:text-2xl font-mono text-sharp-yellow font-medium tracking-tight">
                    &lt;Page_Not_Found /&gt;
                </h2>
            </div>
            <div className="relative pl-4 border-l-2 border-neon-blue/30">
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                    The data sector you are attempting to access appears to be corrupted or does not exist within
                    the current coordinate system.
                </p>
                <p className="text-gray-500 text-xs font-mono mt-2">ERR_CODE: NULL_POINTER_EXCEPTION</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                    to="/"
                    className="px-6 py-3 bg-primary hover:bg-orange-400 text-black text-sm font-bold font-mono rounded shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group border border-transparent"
                >
                    <span className="material-symbols-outlined text-lg">home</span>
                    Return to Homepage
                </Link>
                <button
                    className="px-6 py-3 bg-transparent border border-white/20 hover:border-neon-blue hover:text-neon-blue text-white text-sm font-bold font-mono rounded transition-all flex items-center justify-center gap-2 shadow-[0_0_0_transparent] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    <span className="material-symbols-outlined text-lg">bug_report</span>
                    Report Issue
                </button>
            </div>
        </div>
    );
};

export default ErrorContent;
