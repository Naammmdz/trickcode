import React from 'react';

const CompanyTrackCard = ({ company, letter, difficulty, questionsMsg, progress, total, solved }) => {
    // Difficulty badge colors
    const difficultyColors = {
        Hard: 'bg-terminal-red/10 border-terminal-red/20 text-terminal-red',
        Medium: 'bg-terminal-yellow/10 border-terminal-yellow/20 text-terminal-yellow',
        'Very Hard': 'bg-terminal-red/10 border-terminal-red/20 text-terminal-red'
    };

    const badgeClass = difficultyColors[difficulty] || difficultyColors.Medium;

    // Progress bar color (Google one was primary, others gray-700 for empty part, primary for filled)
    // Assuming 'progress' is percentage (0-100)
    const progressPercent = (solved / total) * 100;
    const isStarted = solved > 0;
    const progressBarColor = isStarted ? 'bg-primary' : 'bg-gray-700'; // Actually background is always gray-800, fill is what matters.

    return (
        <div className="frontier-card p-5 group cursor-pointer hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <span className="font-serif font-bold text-white text-lg">{letter}</span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider ${badgeClass}`}>
                    {difficulty}
                </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{company}</h4>
            <p className="text-xs text-gray-400 font-mono mb-4">{questionsMsg}</p>

            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isStarted ? 'bg-primary' : 'bg-transparent'}`}
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{solved}/{total} Solved</span>
                <span className={`transition-colors font-bold flex items-center gap-1 ${isStarted ? 'text-primary group-hover:translate-x-1 transition-transform' : 'text-white group-hover:text-primary'}`}>
                    {isStarted ? <>Resume →</> : 'Start Track'}
                </span>
            </div>
        </div>
    );
};

export default CompanyTrackCard;
