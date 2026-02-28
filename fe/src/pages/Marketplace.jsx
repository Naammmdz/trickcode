import { useState, useEffect, useRef } from 'react';
import { courseService } from '../services/courseService';
import { Link, useSearchParams } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await courseService.getCategories();
        const cats = data?.content || data || [];
        setCategories(Array.isArray(cats) ? cats.filter(c => c.isActive !== false) : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          size: 9,
          q: searchQuery,
          sort: 'id,desc'
        };
        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }
        const data = await courseService.getPublicCourses(params);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCourses(data.content || []);
      } catch (err) {
        console.error("Marketplace: Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, page, selectedCategory]);

  // Sync state when URL params change (e.g., from Navbar clicks)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
      setPage(0);
    }
  }, [searchParams]);

  const handleCategorySelect = (catId) => {
    const newCat = selectedCategory === String(catId) ? '' : String(catId);
    setSelectedCategory(newCat);
    setPage(0);
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (newCat) {
      params.set('category', newCat);
    } else {
      params.delete('category');
    }
    setSearchParams(params, { replace: true });
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />

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
        <div className="sticky top-[80px] z-40 max-w-7xl mx-auto px-6 mb-8 pt-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border text-xs font-sans uppercase tracking-widest rounded transition-colors ${selectedCategory
                    ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400'
                    : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {selectedCategory ? 'filter_alt' : 'category'}
                  </span>
                  <span>
                    {selectedCategory
                      ? categories.find(c => String(c.id) === selectedCategory)?.name || 'Category'
                      : 'All Categories'}
                  </span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded z-50 py-1 font-sans">
                    <button
                      onClick={() => handleCategorySelect('')}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${!selectedCategory ? 'text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                    >
                      All Categories
                      {!selectedCategory && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${selectedCategory === String(cat.id) ? 'text-orange-500 font-medium' : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                      >
                        {cat.name}
                        {selectedCategory === String(cat.id) && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest hidden sm:inline">{totalElements} courses</span>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col h-full rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="p-5 flex flex-col space-y-3">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <span className="material-symbols-outlined text-5xl text-neutral-300 dark:text-neutral-700 mb-4 block">search_off</span>
                <p className="text-neutral-500">No courses found{selectedCategory ? ' in this category' : ''}. Try a different search or filter.</p>
              </div>
            ) : courses.map((course) => {
              const instructorName = (() => {
                if (!course.instructor) return 'Unknown Instructor';
                if (course.instructor.firstName || course.instructor.lastName) {
                  return `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim();
                }
                return course.instructor.login || 'Unknown Instructor';
              })();
              const difficultyMap = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
              const difficultyLabel = difficultyMap[course.level] || course.level || '';
              const difficultyColor = course.level === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : course.level === 'ADVANCED' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
              const rating = course.averageRating || 0;

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xl transition-all flex flex-col h-full rounded-xl overflow-hidden"
                >
                  <div className="h-40 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-neutral-800 dark:to-neutral-900 opacity-50"></div>
                        <span className="font-serif text-5xl text-orange-500/20 dark:text-neutral-700/50 italic group-hover:scale-110 transition-transform duration-500">
                          {course.title ? course.title.substring(0, 2).toUpperCase() : '??'}
                        </span>
                      </>
                    )}
                    {difficultyLabel && (
                      <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${difficultyColor}`}>
                        {difficultyLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{course.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{instructorName}</p>

                    <div className="flex items-center gap-2 mb-3 text-sm">
                      {rating > 0 ? (
                        <>
                          <span className="font-bold text-yellow-600 dark:text-yellow-500">{rating.toFixed(1)}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={`material-symbols-outlined text-[14px] ${s <= Math.round(rating) ? 'text-yellow-500' : 'text-neutral-300 dark:text-neutral-600'}`}
                                style={s <= Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                              >star</span>
                            ))}
                          </div>
                          <span className="text-xs text-neutral-400">({course.reviewCount || 0})</span>
                        </>
                      ) : (
                        <span className="text-xs text-neutral-400">No ratings yet</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {course.studentCount || 0} students
                      </span>
                      {course.categories && course.categories.length > 0 && (
                        <span className="flex items-center gap-1 line-clamp-1">
                          <span className="material-symbols-outlined text-[14px]">label</span>
                          {course.categories[0].name}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <span className="font-bold text-lg text-neutral-900 dark:text-white">
                        {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
                      </span>
                      <span className="text-xs font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        View course <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
