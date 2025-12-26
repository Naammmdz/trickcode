import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LearnHeader from '../components/learn/LearnHeader';
import ModuleCard from '../components/learn/ModuleCard';
import SearchFilters from '../components/learn/SearchFilters';

const Learn = () => {
  const modules = [
    {
      id: 1,
      icon: 'account_tree',
      title: 'Data Structures Master',
      description: 'Deep dive into Arrays, Linked Lists, Trees, and Graphs. Essential for interview prep.',
      difficulty: 'INTERMEDIATE',
      lessons: 24,
      progress: 58,
      currentLesson: 14,
      status: 'ACTIVE',
      buttonText: 'Continue_Course()'
    },
    {
      id: 2,
      icon: 'functions',
      title: 'Algorithm Wizard',
      description: 'Master sorting, searching, and dynamic programming algorithms. From O(n²) to O(log n).',
      difficulty: 'ADVANCED',
      type: 'SKILL PATH',
      pathId: '02',
      buttonText: 'Start_Path()'
    },
    {
      id: 15,
      icon: 'dns',
      title: 'System Design 101',
      description: 'Learn how to design scalable systems. Load balancing, caching, and database sharding basics.',
      difficulty: 'BEGINNER',
      type: 'TUTORIAL',
      modId: '15',
      progress: 0,
      buttonText: 'Initialize()'
    },
    {
      id: 'py',
      icon: 'terminal',
      title: 'Python for Data Science',
      description: 'Automate tasks and analyze data using Python libraries like Pandas, NumPy, and Matplotlib.',
      difficulty: 'BEGINNER',
      type: 'COURSE',
      langId: 'PY',
      buttonText: 'Start_Course()'
    },
    {
      id: 88,
      icon: 'hub',
      title: 'Advanced Graph Theory',
      description: 'Explore Dijkstra, Bellman-Ford, Floyd-Warshall, and Network Flow algorithms.',
      difficulty: 'EXPERT',
      type: 'MODULE',
      conceptId: '88',
      buttonText: 'Access_Module()'
    },
    {
      id: 'quantum',
      icon: 'memory',
      title: 'Quantum Computing Basics',
      description: 'Introduction to Qubits, Superposition, and Quantum Gates. The future of processing.',
      difficulty: 'EXPERIMENTAL',
      locked: true,
      buttonText: 'Requires_Level_10'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'BEGINNER': 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      'INTERMEDIATE': 'text-blue-300 bg-blue-500/10 border-blue-500/20',
      'ADVANCED': 'text-purple-300 bg-purple-500/10 border-purple-500/20',
      'EXPERT': 'text-purple-300 bg-purple-500/10 border-purple-500/20',
      'EXPERIMENTAL': 'text-gray-500 bg-white/5 border-white/5'
    };
    return colors[difficulty] || colors.BEGINNER;
  };

  return (
    <div className="bg-frontier-black text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col min-h-screen">
      <Navbar />
      <LearnHeader />
      
      <main className="flex-grow relative bg-[#0a0a0a] py-12">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg"></div>
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <SearchFilters />

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <ModuleCard key={module.id} module={module} getDifficultyColor={getDifficultyColor} />
                ))}
              </div>

              {/* Load More */}
              <div className="mt-12 flex justify-center">
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white text-sm font-mono font-bold rounded transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  Load_More_Modules()
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
