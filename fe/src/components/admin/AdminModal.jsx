const AdminModal = ({ title, open, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 dark:border-zinc-800 flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">{title}</div>
              <div className="text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400 mt-1">Admin Action</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded border border-neutral-200 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          <div className="px-6 py-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
