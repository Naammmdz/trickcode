import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg flex items-start justify-between">
      <div>
        <p className="text-xs font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">{title}</p>
        <p className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-white">{value}</p>
      </div>
      {icon && (
        <div className={`w-12 h-12 flex items-center justify-center rounded-lg border ${colorClasses[color]}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
