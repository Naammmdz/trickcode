import React from 'react';

const ContestCard = ({ contest }) => {
    const { title, date, duration, participants, status, tags, month, day } = contest;

    const isFinished = status === 'Finished';
    const isUpcoming = status === 'Upcoming';

    return (
        <div className="group bg-frontier-card border border-white/10 hover:border-white/30 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
            {/* Date Box */}
            <div className={`hidden md:flex flex-col items-center justify-center w-20 h-20 rounded bg-white/5 border border-white/10 shrink-0 transition-colors ${!isFinished ? 'group-hover:bg-primary/10 group-hover:border-primary/30' : 'grayscale group-hover:grayscale-0'}`}>
                <span className="text-xs font-mono text-gray-400 uppercase mb-1">{month}</span>
                <span className={`text-2xl font-serif font-bold ${isFinished ? 'text-gray-400' : 'text-white'}`}>{day}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold font-sans transition-colors ${isFinished ? 'text-gray-300 group-hover:text-white' : 'text-white group-hover:text-primary'}`}>
                        {title}
                    </h3>
                    {tags && tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${tag.className}`}>
                            {tag.icon && <span className="material-symbols-outlined text-[10px]">{tag.icon}</span>}
                            {tag.label}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-mono">
                    {status === 'Upcoming' && (
                        <>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">calendar_today</span> {date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">timer</span> {duration}
                            </span>
                        </>
                    )}

                    {isFinished && (
                        <span className="flex items-center gap-1.5">
                            Winner: <span className="text-primary">{contest.winner}</span>
                        </span>
                    )}

                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">{isFinished ? 'person' : (isUpcoming ? 'person' : 'code')}</span>
                        {participants} {isFinished ? 'Participants' : 'Registered'}
                        {tags && tags.some(t => t.label === 'All Languages') && !isFinished && !isUpcoming && 'All Languages'}
                        {/* The logic above is a bit mixed from the HTML examples, simplifiying: */}
                    </span>
                    {/* Specific handling to match HTML exactly if needed, but generic is better */}
                </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto mt-4 md:mt-0">
                {status === 'Register' && (
                    <button className="w-full md:w-auto px-6 py-2.5 bg-white/5 hover:bg-primary hover:text-white text-gray-200 font-medium font-mono text-sm rounded border border-white/10 hover:border-transparent transition-all duration-200">
                        Register_Now
                    </button>
                )}
                {status === 'Upcoming' && (
                    <button className="w-full md:w-auto px-6 py-2.5 bg-transparent hover:bg-white/10 text-primary border border-primary/50 hover:border-primary font-medium font-mono text-sm rounded transition-all duration-200">
                        Set Reminder
                    </button>
                )}
                {status === 'Finished' && (
                    <button className="w-full md:w-auto px-6 py-2.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 font-medium font-mono text-sm rounded transition-all duration-200 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">visibility</span>
                        View_Standings
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContestCard;
