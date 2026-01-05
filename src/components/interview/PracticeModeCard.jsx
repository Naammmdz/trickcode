import React from 'react';

const PracticeModeCard = ({ title, description, icon, colorInfo, actionText, actionLink }) => {
    // colorInfo expected structure: { hoverBorder: 'hover:border-primary/50', hoverBg: 'hover:bg-[#1c1c1f]', bgIcon: 'bg-primary/5', bgCircle: 'group-hover:bg-primary/10', iconColor: 'group-hover:text-primary', shadow: 'group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]', btnBg: 'bg-primary', btnHover: 'hover:bg-primary-hover', btnText: 'text-white', btnShadow: 'shadow-orange-500/20' }
    // Or we can simplify prop passing. Let's stick to a simpler approach and derive classes or pass specific color strings.
    // Given the variability in colors (primary/orange, blue, purple), passing a 'variant' might be cleaner, 
    // but the object approach allows full customization as per the `code.html`.

    // For now, I'll implement a variant-based approach for cleaner usage.
    const variants = {
        orange: {
            hoverBorder: 'hover:border-primary/50',
            hoverBg: 'hover:bg-primary/5', // Simplified logic, code.html used #1c1c1f but let's be consistent
            cornerBg: 'bg-primary/5 group-hover:bg-primary/10',
            iconText: 'group-hover:text-primary',
            iconShadow: 'group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]',
            btnClass: 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-orange-500/20',
            btnBorder: 'border-transparent'
        },
        blue: {
            hoverBorder: 'hover:border-blue-500/50',
            hoverBg: 'hover:bg-blue-500/5',
            cornerBg: 'bg-blue-500/5 group-hover:bg-blue-500/10',
            iconText: 'group-hover:text-blue-400',
            iconShadow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
            btnClass: 'bg-white/5 hover:bg-white/10 text-white',
            btnBorder: 'border border-white/20 hover:border-blue-400/50'
        },
        purple: {
            hoverBorder: 'hover:border-purple-500/50',
            hoverBg: 'hover:bg-purple-500/5',
            cornerBg: 'bg-purple-500/5 group-hover:bg-purple-500/10',
            iconText: 'group-hover:text-purple-400',
            iconShadow: 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]',
            btnClass: 'bg-white/5 hover:bg-white/10 text-white',
            btnBorder: 'border border-white/20 hover:border-purple-400/50'
        }
    };

    const style = variants[colorInfo] || variants.orange;

    return (
        <div className={`frontier-card group p-6 flex flex-col h-full ${style.hoverBorder} transition-colors duration-300 relative overflow-hidden`}>
            {/* Corner decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-all ${style.cornerBg}`}></div>

            {/* Icon */}
            <div className={`w-12 h-12 bg-white/5 rounded flex items-center justify-center mb-6 text-gray-200 ${style.iconText} transition-colors border border-white/10 ${style.iconShadow} relative z-10`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-mono relative z-10">{title}</h3>
            <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed relative z-10">
                {description}
            </p>

            <div className="mt-auto relative z-10">
                <button className={`w-full py-3 font-bold rounded transition-all text-sm font-mono flex items-center justify-center gap-2 ${style.btnClass} ${style.btnBorder}`}>
                    <span>{actionText}</span>
                </button>
            </div>
        </div>
    );
};

export default PracticeModeCard;
