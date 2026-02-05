import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({ title, items, icon, emptyText = 'No recent activity.' }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-base text-neutral-500">{icon}</span>}
        <h3 className="text-xs font-sans uppercase tracking-widest text-neutral-500">{title}</h3>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-serif text-neutral-800 dark:text-neutral-200">{item.primaryText}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">{item.secondaryText}</p>
              </div>
              <p className="text-xs text-neutral-400 flex-shrink-0 ml-4">
                {item.timestamp ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) : ''}
              </p>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-neutral-500">{emptyText}</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
