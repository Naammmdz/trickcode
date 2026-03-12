import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', subtitle, trend, trendValue }) => {
  const colorMap = {
    primary: {
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
      iconText: 'text-violet-500',
      iconRing: 'ring-violet-500/20',
      gradient: 'from-violet-500/5 to-transparent',
      trendText: 'text-violet-500',
    },
    green: {
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconText: 'text-emerald-500',
      iconRing: 'ring-emerald-500/20',
      gradient: 'from-emerald-500/5 to-transparent',
      trendText: 'text-emerald-500',
    },
    blue: {
      iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
      iconText: 'text-sky-500',
      iconRing: 'ring-sky-500/20',
      gradient: 'from-sky-500/5 to-transparent',
      trendText: 'text-sky-500',
    },
    yellow: {
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconText: 'text-amber-500',
      iconRing: 'ring-amber-500/20',
      gradient: 'from-amber-500/5 to-transparent',
      trendText: 'text-amber-500',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5 group`}>
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
            {title}
          </p>
          <p className="text-3xl font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
            {value}
          </p>
          {(subtitle || trendValue) && (
            <div className="flex items-center gap-2">
              {trend && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                  <span className="material-symbols-outlined text-sm">
                    {trend === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                  {trendValue}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${c.iconBg} ring-1 ${c.iconRing} transition-transform duration-300 group-hover:scale-110`}>
            <span className={`material-symbols-outlined text-xl ${c.iconText}`}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
