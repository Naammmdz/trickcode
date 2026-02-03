import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { Link } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Use public API endpoint for marketplace
        const data = await courseService.getPublicCourses({ 
          page, 
          size: 9, 
          q: searchQuery, 
          sort: 'id,desc'
        });
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);

        // Map backend entities to UI model
        const mapped = (data.content || []).map(c => ({
          id: c.id,
          title: c.title,
          difficulty: c.level || 'Beginner',
          rating: 5.0, // Placeholder
          reviews: 0,  // Placeholder
          students: 0, // Placeholder
          instructor: c.instructor ? (c.instructor.firstName ? `${c.instructor.firstName} ${c.instructor.lastName}` : c.instructor.login) : 'Unknown',
          price: c.price ? `$${c.price}` : 'Free',
          thumbnailUrl: c.thumbnailUrl,
          symbol: c.title ? c.title.substring(0, 2).toUpperCase() : '??'
        }));
        setCourses(mapped);
      } catch (err) {
        console.error("Marketplace: Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-sans tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          </div>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] md:text-xs font-sans uppercase tracking-widest text-neutral-500 mb-8">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to="/learn" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Marketplace</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white">Search</span>
          </nav>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-serif mb-6 text-neutral-900 dark:text-white">
              Results for <span className="italic font-light text-neutral-500">"{searchQuery}"</span>
            </h1>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-symbols-outlined text-neutral-400 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input
                className="block w-full p-4 pl-12 text-sm font-sans text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-1 focus:ring-primary focus:border-primary placeholder-neutral-400 shadow-sm transition-all rounded"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  className="hidden sm:block px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[10px] uppercase font-sans tracking-widest text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors rounded"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-3 flex gap-4 text-[10px] font-sans uppercase tracking-widest text-neutral-500">
              <span>{totalElements} results found</span>
              <span className="text-primary">Page {page + 1} of {totalPages}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur border-y border-neutral-200 dark:border-neutral-800 px-6 py-3 mb-12 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-sans uppercase tracking-widest rounded-full transition-colors group">
                Category
                <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">expand_more</span>
              </button>
              <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-sans uppercase tracking-widest rounded-full transition-colors group">
                Difficulty
                <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">expand_more</span>
              </button>
              <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-sans uppercase tracking-widest rounded-full transition-colors group">
                Price
                <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">expand_more</span>
              </button>
              <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-sans uppercase tracking-widest rounded-full transition-colors group">
                Rating
                <span className="material-symbols-outlined text-sm text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">expand_more</span>
              </button>
              <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2"></div>
              <button className="whitespace-nowrap text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                Reset All
              </button>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest hidden sm:inline">Sort By:</span>
              <div className="relative group">
                <button className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  Highest Rated
                  <span className="material-symbols-outlined text-sm">sort</span>
                </button>
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1 z-50 rounded">
                  <a className="block px-4 py-2 text-xs font-sans hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded" href="#">Newest</a>
                  <a className="block px-4 py-2 text-xs font-sans bg-neutral-50 dark:bg-neutral-800 text-primary rounded" href="#">Highest Rated</a>
                  <a className="block px-4 py-2 text-xs font-sans hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded" href="#">Price: Low to High</a>
                  <a className="block px-4 py-2 text-xs font-sans hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded" href="#">Price: High to Low</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/learn/${course.id}`}
                className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 transition-colors flex flex-col h-full cursor-pointer rounded"
              >
                <div className="h-40 bg-gray-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative rounded-t">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-grid-pattern opacity-50" style={{ backgroundSize: '40px 40px' }}></div>
                      <span className="font-serif text-5xl text-neutral-200 dark:text-neutral-700 italic group-hover:scale-110 transition-transform duration-500">{course.symbol}</span>
                    </>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-sans uppercase tracking-widest rounded text-neutral-600 dark:text-neutral-400">{course.difficulty}</span>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-sans">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {course.rating}
                      <span className="text-neutral-400 ml-1">({course.reviews})</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-serif mb-1 group-hover:underline decoration-1 underline-offset-4 leading-tight">{course.title}</h4>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-[10px] font-sans text-neutral-500 dark:text-neutral-500 uppercase tracking-wide">
                      {course.students >= 10000 ? '10k+ Students' : `${course.students.toLocaleString()} Students`}
                    </span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden border border-white dark:border-neutral-600"></div>
                      <span className="text-xs font-sans text-neutral-600 dark:text-neutral-400">{course.instructor}</span>
                    </div>
                    <span className="font-serif text-lg">{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center border-t border-neutral-100 dark:border-neutral-800 pt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  // Simple pagination logic: show all pages if totalPages <= 7, else show simplified range (skip complex logic for now)
                  if (totalPages > 7 && Math.abs(index - page) > 2 && index !== 0 && index !== totalPages - 1) {
                    if (index === 1 || index === totalPages - 2) return <span key={index} className="w-8 h-8 flex items-center justify-center text-xs font-sans text-neutral-300">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-sans rounded-sm transition-colors ${page === index
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                          : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  className="p-2 text-neutral-900 dark:text-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-24 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif max-w-lg mb-8 md:mb-0">
            Ready to master <span className="italic font-light">algorithms and ace your interviews?</span>
          </h2>
          <Link to="/login" className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors rounded">
            Join Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white">
              <img
                alt="TrickCode Logo"
                className="w-6 h-6 object-contain rounded"
                src={logo}
              />
              <span className="font-serif font-bold text-lg">Trickcode</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              The premier platform for learning data structures and algorithms. Master DSA and ace your technical interviews.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Marketplace</span>
            <Link to="/learn" className="hover:underline">Browse All</Link>
            <a href="#mentors" className="hover:underline">Instructors</a>
            <a href="#" className="hover:underline">Become a Mentor</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Resources</span>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Community</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Legal</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between text-[10px] font-sans uppercase text-neutral-400">
          <span>© 2024 Trickcode Inc.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Twitter</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Github</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
