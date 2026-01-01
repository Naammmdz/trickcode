import ContestCard from '../components/contests/ContestCard';
import ContestHeader from '../components/contests/ContestHeader';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

const Contests = () => {
    const contests = [
        {
            title: "Frontier Global Championship",
            month: "Oct",
            day: "28",
            status: "Register", // "Upcoming" but with Register button in HTML example it says Register_Now so I'll trust the button logic
            date: "Oct 28, 14:00 UTC",
            duration: "3h 00m",
            participants: "All Languages",
            tags: [
                { label: "$10k Prize", icon: "emoji_events", className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" }
            ],
            description: "Compete in real-time algorithmic challenges.",
        },
        {
            title: "Bi-Weekly Contest 91",
            month: "Oct",
            day: "29",
            status: "Upcoming",
            date: "Oct 29, 10:00 UTC",
            duration: "1h 30m",
            participants: "358 Registered",
            tags: [
                { label: "Beginner Friendly", className: "bg-blue-500/10 border-blue-500/30 text-blue-400" }
            ]
        },
        {
            title: "Dynamic Programming Sprint",
            month: "Nov",
            day: "02",
            status: "Upcoming",
            date: "Nov 02, 18:00 UTC",
            duration: "2h 00m",
            participants: "89 Registered",
            tags: [
                { label: "Hard", className: "bg-purple-500/10 border-purple-500/30 text-purple-400" }
            ]
        },
        {
            title: "Weekly Algorithm Cup #41",
            month: "Oct",
            day: "15",
            status: "Finished",
            winner: "dev_ninja_99",
            participants: "2,103",
            tags: [
                { label: "Finished", className: "bg-white/5 border-white/10 text-gray-500" }
            ]
        },
        {
            title: "Rust Language Special",
            month: "Oct",
            day: "08",
            status: "Finished",
            winner: "rustacean_prime",
            participants: "842",
            tags: [
                { label: "Finished", className: "bg-white/5 border-white/10 text-gray-500" }
            ]
        }
    ];

    return (
        <div className="bg-frontier-black text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col min-h-screen">
            <Navbar />

            <ContestHeader />

            {/* Main Content */}
            <section className="py-12 px-6 md:px-12 lg:px-24 min-h-screen relative">
                <div className="max-w-7xl mx-auto">

                    {/* Live Now Section */}
                    <div className="mb-16">
                        <h2 className="text-sm font-mono text-terminal-green font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base animate-pulse">radio_button_checked</span>
                            Live Now
                        </h2>
                        <div className="bg-gradient-to-r from-frontier-card to-[#121212] border border-terminal-green/30 rounded-lg p-1 relative overflow-hidden group shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                            <div className="absolute top-0 left-0 w-1 h-full bg-terminal-green shadow-[0_0_15px_#4ade80]"></div>
                            <div className="absolute -right-10 -top-10 w-64 h-64 bg-terminal-green/10 rounded-full blur-[80px] pointer-events-none"></div>
                            <div className="bg-frontier-black/50 backdrop-blur-sm rounded p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-2 py-1 rounded bg-terminal-green/20 border border-terminal-green/30 text-terminal-green text-[10px] font-mono font-bold uppercase tracking-wide">Weekly</span>
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono uppercase tracking-wide">Rated</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">Weekly Algorithm Cup #42</h3>
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-mono mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-500">schedule</span>
                                            <span>Ends in <span className="text-white font-bold">01:14:22</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-500">group</span>
                                            <span>1,240 Participating</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
                                    <a className="w-full md:w-auto px-8 py-3 bg-terminal-green hover:bg-green-400 text-black font-bold font-mono rounded transition-all shadow-[0_0_20px_rgba(74,222,128,0.4)] flex items-center justify-center gap-2" href="#">
                                        <span>Enter_Contest()</span>
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </a>
                                    <span className="text-xs text-gray-500 font-mono">Score updates in real-time</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-white/10 pb-6">
                        <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 w-full lg:w-auto no-scrollbar">
                            <button className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white text-sm font-medium font-mono hover:bg-white/20 transition whitespace-nowrap">
                                All Contests
                            </button>
                            <button className="px-4 py-2 rounded bg-transparent border border-white/10 text-gray-400 text-sm font-medium font-mono hover:text-white hover:border-white/30 transition whitespace-nowrap">
                                Upcoming
                            </button>
                            <button className="px-4 py-2 rounded bg-transparent border border-white/10 text-gray-400 text-sm font-medium font-mono hover:text-white hover:border-white/30 transition whitespace-nowrap">
                                Past
                            </button>
                            <button className="px-4 py-2 rounded bg-transparent border border-white/10 text-gray-400 text-sm font-medium font-mono hover:text-white hover:border-white/30 transition whitespace-nowrap">
                                My Contests
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative group w-full sm:w-64">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors text-lg">search</span>
                                <input className="w-full bg-[#121212] border border-white/10 rounded py-2 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-600 font-mono transition-all" placeholder="Search by name or tag..." type="text" />
                            </div>
                            <div className="relative w-full sm:w-40">
                                <select className="w-full bg-[#121212] border border-white/10 rounded py-2 pl-3 pr-8 text-sm text-gray-300 focus:ring-1 focus:ring-primary focus:border-primary font-mono appearance-none cursor-pointer">
                                    <option>Difficulty</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                                <span className="material-icons-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Contests List */}
                    <div className="grid gap-4">
                        {contests.slice(0, 3).map((contest, index) => (
                            <ContestCard key={index} contest={contest} />
                        ))}

                        <div className="my-8 h-px bg-white/10 w-full"></div>
                        <h3 className="text-sm font-mono text-gray-500 font-bold uppercase tracking-widest mb-4">Past Contests</h3>

                        {contests.slice(3).map((contest, index) => (
                            <ContestCard key={index + 3} contest={contest} />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-6 py-3 text-sm font-mono text-gray-400 hover:text-white border-b border-dashed border-gray-600 hover:border-white transition-colors">
                            Load_More_Archives()
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contests;
