import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InterviewHeader from '../components/interview/InterviewHeader';
import PracticeModeCard from '../components/interview/PracticeModeCard';
import CompanyTrackCard from '../components/interview/CompanyTrackCard';

const Interview = () => {
    return (
        <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col min-h-screen">
            <Navbar />

            <InterviewHeader />



            <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
                    <div className="relative w-full md:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">search</span>
                        </div>
                        <input
                            className="w-full bg-[#121212] border border-white/10 rounded py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600 font-mono transition-all"
                            placeholder="Search companies, tags..."
                            type="text"
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-mono text-sm">
                        <button className="px-4 py-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition whitespace-nowrap flex items-center gap-2">
                            Filters
                            <span className="material-symbols-outlined text-sm">tune</span>
                        </button>
                        <button className="px-4 py-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition whitespace-nowrap flex items-center gap-2">
                            Sort: Popular
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                    </div>
                </div>
                {/* Practice Modes */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Practice Modes
                        </h2>
                        <div className="h-px bg-white/10 flex-grow ml-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PracticeModeCard
                            title="Mock Interview"
                            description="Join a live video session with a randomly matched peer. Solve problems in a shared IDE environment."
                            icon="video_camera_front"
                            colorInfo="orange"
                            actionText="start_session()"
                        />
                        <PracticeModeCard
                            title="Peer Review"
                            description="Submit your solution for asynchronous code review. Earn karma points by reviewing others' code."
                            icon="rate_review"
                            colorInfo="blue"
                            actionText="review_queue"
                        />
                        <PracticeModeCard
                            title="System Design"
                            description="Practice high-level architecture problems using our collaborative whiteboard canvas."
                            icon="architecture"
                            colorInfo="purple"
                            actionText="launch_canvas"
                        />
                    </div>
                </section>

                {/* Company Tracks */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-400">domain</span>
                            Company Tracks
                        </h2>
                        <a className="text-xs font-mono text-primary hover:text-white transition flex items-center gap-1" href="#">
                            view_all_tracks
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CompanyTrackCard
                            company="Google"
                            letter="G"
                            difficulty="Hard"
                            questionsMsg="Top 150 Questions"
                            solved={25}
                            total={150}
                        />
                        <CompanyTrackCard
                            company="Amazon"
                            letter="A"
                            difficulty="Medium"
                            questionsMsg="Leadership Principles + Code"
                            solved={0}
                            total={185}
                        />
                        <CompanyTrackCard
                            company="Meta"
                            letter="M"
                            difficulty="Hard"
                            questionsMsg="Production Engineering"
                            solved={0}
                            total={120}
                        />
                        <CompanyTrackCard
                            company="Netflix"
                            letter="N"
                            difficulty="Very Hard"
                            questionsMsg="Core Engineering"
                            solved={0}
                            total={85}
                        />
                    </div>
                </section>

                {/* Special Sets */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="frontier-card p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-blue-400">psychology</span>
                                    <h3 className="text-xl font-bold text-white font-mono">Behavioral_Questions</h3>
                                </div>
                                <p className="text-sm text-gray-400 max-w-sm">
                                    Prepare for "Tell me about a time..." questions using the STAR method. Includes recorded responses.
                                </p>
                            </div>
                            <button className="frontier-btn-secondary px-6 py-2 shrink-0">
                                Explore Set
                            </button>
                        </div>
                    </div>
                    <div className="frontier-card p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none">
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-green-400">code</span>
                                    <h3 className="text-xl font-bold text-white font-mono">Blind 75 Curated</h3>
                                </div>
                                <p className="text-sm text-gray-400 max-w-sm">
                                    The essential list of leetcode-style questions you must know before any technical interview.
                                </p>
                            </div>
                            <button className="frontier-btn-secondary px-6 py-2 shrink-0">
                                Explore Set
                            </button>
                        </div>
                    </div>
                </section>

                {/* Upcoming Peer Matches Table */}
                <section className="bg-[#0A0A0A] border border-white/10 rounded p-6">
                    <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4 font-bold">// Upcoming Peer Matches</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="border-b border-white/10 text-xs font-mono uppercase">
                                <tr>
                                    <th className="py-3 px-4 text-white">Time</th>
                                    <th className="py-3 px-4">Topic</th>
                                    <th className="py-3 px-4">Language</th>
                                    <th className="py-3 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-xs">
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white">In 5 mins</td>
                                    <td className="py-3 px-4">Dynamic Programming</td>
                                    <td className="py-3 px-4"><span className="text-blue-400">Python</span></td>
                                    <td className="py-3 px-4 text-right"><button className="text-primary hover:text-white font-bold">Join Waitlist</button></td>
                                </tr>
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white">In 15 mins</td>
                                    <td className="py-3 px-4">Arrays &amp; Hashing</td>
                                    <td className="py-3 px-4"><span className="text-yellow-400">Java</span></td>
                                    <td className="py-3 px-4 text-right"><button className="text-primary hover:text-white font-bold">Join Waitlist</button></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white">14:00 GMT</td>
                                    <td className="py-3 px-4">System Design (News Feed)</td>
                                    <td className="py-3 px-4"><span className="text-gray-400">Any</span></td>
                                    <td className="py-3 px-4 text-right"><button className="text-primary hover:text-white font-bold">Register</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Interview;
