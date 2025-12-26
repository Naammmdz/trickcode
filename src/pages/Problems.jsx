import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProblemFilters from '../components/problems/ProblemFilters';
import ProblemPagination from '../components/problems/ProblemPagination';
import ProblemRow from '../components/problems/ProblemRow';
import ProblemsHeader from '../components/problems/ProblemsHeader';

const Problems = () => {
  const problems = [
    {
      id: 1,
      title: 'Two Sum',
      tags: ['Arrays', 'Hash Table'],
      acceptance: '48.4%',
      difficulty: 'Easy',
      status: 'solved'
    },
    {
      id: 2,
      title: 'Add Two Numbers',
      tags: ['Linked List', 'Math'],
      acceptance: '39.1%',
      difficulty: 'Medium',
      status: 'unsolved'
    },
    {
      id: 3,
      title: 'Longest Substring Without Repeating Characters',
      tags: ['String', 'Sliding Window'],
      acceptance: '32.8%',
      difficulty: 'Medium',
      status: 'unsolved'
    },
    {
      id: 4,
      title: 'Median of Two Sorted Arrays',
      tags: ['Array', 'Binary Search'],
      acceptance: '33.1%',
      difficulty: 'Hard',
      status: 'unsolved'
    },
    {
      id: 5,
      title: 'Longest Palindromic Substring',
      tags: ['String', 'DP'],
      acceptance: '31.7%',
      difficulty: 'Medium',
      status: 'unsolved',
      featured: true
    },
    {
      id: 6,
      title: 'Zigzag Conversion',
      tags: ['String'],
      acceptance: '42.1%',
      difficulty: 'Medium',
      status: 'unsolved'
    },
    {
      id: 7,
      title: 'Reverse Integer',
      tags: ['Math'],
      acceptance: '26.5%',
      difficulty: 'Medium',
      status: 'attempted'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-frontier-black">
      <Navbar />
      <ProblemsHeader />
      
      <main className="flex-grow bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <ProblemFilters />
            
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <button className="text-sm font-medium text-white border-b-2 border-primary px-1 py-1">
                    All Problems
                  </button>
                  <button className="text-sm font-medium text-gray-400 hover:text-white px-1 py-1 transition-colors">
                    Lists
                  </button>
                  <button className="text-sm font-medium text-gray-400 hover:text-white px-1 py-1 transition-colors">
                    Top 100
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-frontier-card hover:text-white border border-white/10 hover:border-white/30 rounded px-3 py-1.5 transition-all">
                      <span>Sort by: Relevance</span>
                      <span className="material-icons-outlined text-sm">expand_more</span>
                    </button>
                  </div>
                  <button className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <span className="material-icons-outlined text-sm">shuffle</span>
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-mono text-gray-500 uppercase tracking-wider font-semibold">
                <div className="col-span-1">Status</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Acceptance</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {/* Problem List */}
              <div className="space-y-4">
                {problems.map(problem => (
                  <ProblemRow key={problem.id} problem={problem} />
                ))}
              </div>

              <ProblemPagination />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Problems;
