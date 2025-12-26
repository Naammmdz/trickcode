import React from 'react';
import { Link } from 'react-router-dom';

const Modules = () => {
  const modules = [
    {
      icon: "code",
      title: "Problems",
      description: "Access the database of coding challenges. Hone skills in algorithms and data structures."
    },
    {
      icon: "emoji_events",
      title: "Contests",
      description: "Synchronous competitive events. Climb the leaderboard and earn recognition."
    },
    {
      icon: "person_search",
      title: "Interview Prep",
      description: "Curated problem sets from top tech companies to help you ace your next interview."
    },
    {
      icon: "newspaper",
      title: "News Feed",
      description: "Stay updated with the latest technology trends, developer news, and community stories."
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-frontier-dark border-t border-white/10" id="problems">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-serif text-white">Modules</h2>
          <a className="text-sm font-mono text-primary hover:text-white transition font-bold" href="#">View All -&gt;</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const Wrapper = module.title === "News Feed" ? 
              ({children}) => <Link to="/news" className="contents">{children}</Link> : 
              React.Fragment;
            
            return (
            <Wrapper key={module.title}>
            <div className="bg-frontier-card p-8 rounded border border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                <span className="material-icons-outlined text-9xl">{module.icon}</span>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition border border-white/10 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                <span className="material-icons-outlined text-2xl">{module.icon}</span>
              </div>
              <h3 className="text-2xl font-serif mb-3 text-white group-hover:text-primary transition-colors">{module.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed max-w-md group-hover:text-gray-300">
                {module.description}
              </p>
            </div>
            </Wrapper>
          )})}
        </div>
      </div>
    </section>
  );
};

export default Modules;
