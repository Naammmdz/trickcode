import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalElements, pageSize }) => {
    // Calculate range
    const startRange = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const endRange = Math.min((currentPage + 1) * pageSize, totalElements);

    // Generate pages array only if needed
    const pages = [];
    if (totalPages > 1) {
        const startPage = Math.max(0, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        if (startPage > 0) {
            pages.push(0);
            if (startPage > 1) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) pages.push('...');
            pages.push(totalPages - 1);
        }
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-zinc-800">
            <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                Showing <span className="font-mono text-neutral-900 dark:text-white">{startRange}-{endRange}</span> of <span className="font-mono text-neutral-900 dark:text-white">{totalElements}</span>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>

                    {pages.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => typeof p === 'number' && onPageChange(p)}
                            disabled={p === '...'}
                            className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono rounded transition-colors ${p === currentPage
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                : p === '...'
                                    ? 'cursor-default text-neutral-400'
                                    : 'hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-400'
                                }`}
                        >
                            {typeof p === 'number' ? p + 1 : p}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;
