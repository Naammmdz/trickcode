import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({ title, items, icon, emptyText = 'No recent activity.', maxItems = 5 }) => {
  const displayItems = items?.slice(0, maxItems) || [];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/30 dark:hover:shadow-neutral-900/30">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <span className="material-symbols-outlined text-base text-neutral-500 dark:text-neutral-400">{icon}</span>
            </div>
          )}
          <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
            {title}
          </h3>
        </div>
        {items && items.length > 0 && (
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
        {displayItems.length > 0 ? (
          displayItems.map((item, index) => (
            <div
              key={index}
              className="px-5 py-3.5 flex justify-between items-center group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Index dot */}
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 truncate">
                    {item.primaryText}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                    {item.secondaryText}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 flex-shrink-0 ml-4 tabular-nums">
                {item.timestamp
                  ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })
                  : ''}
              </p>
            </div>
          ))
        ) : (
          <div className="px-5 py-10 text-center">
            <span className="material-symbols-outlined text-3xl text-neutral-200 dark:text-neutral-700 mb-2 block">inbox</span>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
