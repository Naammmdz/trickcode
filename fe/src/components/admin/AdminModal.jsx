const AdminModal = ({ title, open, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif text-neutral-900 dark:text-white">{title}</h3>
              <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mt-0.5">Admin Action</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">{children}</div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-end gap-3">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
