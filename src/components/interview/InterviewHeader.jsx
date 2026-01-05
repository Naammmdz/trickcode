import React from 'react';
import { Link } from 'react-router-dom';

const InterviewHeader = () => {
    return (
        <section className="relative pt-16 pb-12 px-6 md:px-12 border-b border-white/10 bg-frontier-black overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-mono text-xs mb-3 uppercase tracking-wider">
                            <Link to="/" className="hover:text-primary-hover transition-colors">
                                <span className="material-symbols-outlined text-sm">home</span>
                            </Link>
                            <span>/</span>
                            <span className="font-bold">Interview Prep</span>
                        </div>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
                            <span className="text-xs font-mono text-gray-300 uppercase tracking-widest font-semibold">Session Status: Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Technical Interview</h1>
                        <p className="text-gray-400 max-w-2xl text-sm font-light">
                            Master technical interviews with live mock sessions, peer reviews, and company-specific learning tracks.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
                        <div className="bg-frontier-card px-4 py-2 rounded border border-white/10 flex items-center gap-3">
                            <span className="text-white font-bold text-lg">1.2k</span>
                            <span className="text-gray-500 text-xs uppercase">Live Peers</span>
                        </div>
                        <div className="bg-frontier-card px-4 py-2 rounded border border-white/10 flex items-center gap-3">
                            <span className="text-white font-bold text-lg">150+</span>
                            <span className="text-gray-500 text-xs uppercase">Curated Questions</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InterviewHeader;
