const SettingsTab = () => {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Settings</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
          Application configuration settings.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-base text-neutral-500">settings</span>
          </div>
          <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
            Service Endpoints
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">Gateway Base URL</label>
            <input
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 font-mono"
              defaultValue="http://localhost:8080"
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 mb-2">JWKS URL</label>
            <input
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 font-mono"
              defaultValue="http://localhost:9000/.well-known/jwks.json"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-xs font-sans uppercase tracking-widest rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-sm">save</span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
