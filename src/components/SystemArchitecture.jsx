const SystemArchitecture = () => {
  const steps = [
    {
      id: "01",
      icon: "person_add",
      title: "Init_Profile()",
      description: "Establish your user entity and configure learning parameters."
    },
    {
      id: "02",
      icon: "checklist",
      title: "Select_Path()",
      description: "Choose tailored algorithms or randomized daily inputs."
    },
    {
      id: "03",
      icon: "terminal",
      title: "Execute_Code()",
      description: "Compile in the IDE and run validation tests instantly."
    },
    {
      id: "04",
      icon: "trophy",
      title: "Update_Rank()",
      description: "Compete in global contests and climb the leaderboard."
    }
  ];

  return (
    <section className="py-24 bg-frontier-dark border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
          <div>
            <span className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-3 block font-bold shadow-primary/20">// Process Architecture</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-md">System Execution</h2>
          </div>
          <p className="mt-4 md:mt-0 text-gray-300 max-w-sm text-sm font-mono border-l border-primary/40 pl-4">
            Follow the initialization sequence to begin your development journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="group relative bg-[#121212] p-8 rounded-xl border border-white/10 hover:border-primary/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-4 -right-4 text-9xl font-black text-white/[0.03] group-hover:text-primary/[0.08] transition-colors duration-500 font-serif select-none z-0">{step.id}</div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-gray-300 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-300">
                  <span className="material-symbols-outlined text-3xl drop-shadow-lg">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-mono tracking-tight group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemArchitecture;
