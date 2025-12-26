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
    <section className="py-24 bg-frontier-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-2 block font-bold">// Process</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white drop-shadow-md">System Architecture</h2>
          </div>
          <p className="mt-4 md:mt-0 text-gray-400 max-w-sm text-sm font-mono">
            Executing initialization sequence. Follow protocols to begin.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="group relative bg-frontier-card p-6 rounded border border-white/10 hover:border-primary/50 hover:bg-[#1c1c1f] transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="absolute top-4 right-4 text-gray-600 font-mono text-xs opacity-70 font-bold">{step.id}</div>
              <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center mb-6 text-gray-200 group-hover:text-primary transition-colors border border-white/10 group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white font-mono group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemArchitecture;
