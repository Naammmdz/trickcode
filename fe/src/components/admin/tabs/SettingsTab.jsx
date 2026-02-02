const SettingsTab = () => {
  return (
    <div className="p-8 max-w-4xl">
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm">
        <div className="text-lg font-serif text-neutral-900 dark:text-white">Settings / Config</div>
        <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Demo form (wired later to config service)</div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">Gateway Base URL</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm"
              defaultValue="http://localhost:8080"
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">JWKS URL</label>
            <input
              className="mt-2 w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-3 text-sm"
              defaultValue="http://localhost:9000/.well-known/jwks.json"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 text-xs font-sans uppercase tracking-widest hover:opacity-90 transition-opacity">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
