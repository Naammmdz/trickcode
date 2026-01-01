const CoreTechnologies = () => {
  const technologies = [
    {
      icon: "terminal",
      name: "JDoodle API",
      category: "Engine",
      color: "blue"
    },
    {
      icon: "video_camera_front",
      name: "Jitsi Meet",
      category: "Video Protocol",
      color: "indigo"
    },
    {
      icon: "bolt",
      name: "Socket.IO",
      category: "Sync",
      color: "amber"
    },
    {
      icon: "verified_user",
      name: "Next-Auth",
      category: "Security",
      color: "emerald"
    }
  ];

  return (
    <section className="py-24 bg-frontier-black relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Core Technologies</h2>
          <div className="h-0.5 w-16 bg-primary mx-auto shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10">
          {technologies.map((tech) => (
            <div key={tech.name} className="group p-10 border-r border-b border-white/10 hover:bg-white/5 transition-colors duration-300 flex flex-col items-center justify-center text-center gap-4">
              <span className={`material-symbols-outlined text-4xl text-gray-400 group-hover:text-${tech.color}-400 transition-colors group-hover:scale-110 duration-300`}>
                {tech.icon}
              </span>
              <div>
                <h3 className={`font-mono font-bold text-white text-sm group-hover:text-${tech.color}-200 transition-colors`}>
                  {tech.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                  {tech.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreTechnologies;
