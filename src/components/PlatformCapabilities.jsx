const PlatformCapabilities = () => {
  const capabilities = [
    {
      icon: "bug_report",
      title: "Automated Testing",
      description: "Run your solutions against comprehensive test cases. Get instant feedback on edge cases and runtime performance metrics."
    },
    {
      icon: "video_camera_front",
      title: "Mock Environments",
      description: "Simulate real interview scenarios with video questions and AI-driven feedback loops to improve soft skills."
    },
    {
      icon: "groups",
      title: "Real-time Sync",
      description: "Multi-user cursor support. Share your editor environment with peers to debug and refactor code simultaneously."
    }
  ];

  return (
    <section className="py-24 bg-frontier-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-3 mb-8">
            <h2 className="text-3xl font-serif text-white">Platform Capabilities</h2>
          </div>
          {capabilities.map((capability) => (
            <div key={capability.title} className="space-y-4">
              <div className="text-primary mb-4 inline-block p-2 bg-primary/10 rounded-lg">
                <span className="material-icons-outlined text-4xl">{capability.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white font-mono">{capability.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformCapabilities;
