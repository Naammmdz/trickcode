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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const searchInputRef = useRef(null);

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
          size: 12,
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

  const getInstructorName = (instructor) => {
    if (!instructor) return 'Unknown Instructor';
    if (instructor.firstName || instructor.lastName) {
      return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim();
    }
    return instructor.login || 'Unknown Instructor';
  };

  const selectedCategoryName = selectedCategory
    ? categories.find(c => String(c.id) === selectedCategory)?.name
    : null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <main className="relative z-10 pt-20 pb-16">
        {/* Hero Search Section */}
        <div className="bg-white dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-6">
              <Link to="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">home</span>
                Home
              </Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-neutral-700 dark:text-neutral-300">Courses</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-white">
                {searchQuery ? (
                  <>Results for <span className="text-orange-500">"{searchQuery}"</span></>
                ) : selectedCategoryName ? (
                  <>{selectedCategoryName}</>
                ) : (
                  <>Explore Courses</>
                )}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
                {searchQuery
                  ? `${totalElements} course${totalElements !== 1 ? 's' : ''} found`
                  : 'Discover courses taught by industry experts'}
              </p>

              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-[20px] text-neutral-400 group-focus-within:text-orange-500 transition-colors">search</span>
                </div>
                <input
                  ref={searchInputRef}
                  className="block w-full py-3.5 pl-12 pr-28 text-sm font-medium text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all"
                  type="text"
                  placeholder="Search courses, topics, instructors..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-200/80 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-medium text-neutral-600 dark:text-neutral-300 rounded-lg transition-colors"
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 z-40 bg-neutral-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    selectedCategory
                      ? 'bg-orange-50 dark:bg-orange-900/15 border-orange-200 dark:border-orange-800/40 text-orange-600 dark:text-orange-400'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {selectedCategory ? 'filter_alt' : 'category'}
                  </span>
                  <span>
                    {selectedCategoryName || 'All Categories'}
                  </span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-xl z-50 py-1.5 overflow-hidden">
                    <button
                      onClick={() => handleCategorySelect('')}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/70 transition-colors ${
                        !selectedCategory ? 'text-orange-500 font-semibold bg-orange-50/50 dark:bg-orange-900/10' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px]">apps</span>
                        All Categories
                      </span>
                      {!selectedCategory && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 mx-3 my-1"></div>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/70 transition-colors ${
                          selectedCategory === String(cat.id) ? 'text-orange-500 font-semibold bg-orange-50/50 dark:bg-orange-900/10' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === String(cat.id) && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active filter tag */}
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect('')}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                >
                  {selectedCategoryName}
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}

              {/* Spacer + View toggle + Count */}
              <div className="ml-auto shrink-0 flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-700 text-orange-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-700 text-orange-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">view_list</span>
                  </button>
                </div>
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 hidden sm:inline whitespace-nowrap">
                  {totalElements} course{totalElements !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          }>
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                viewMode === 'grid' ? (
                  <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col h-full rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-neutral-200 dark:bg-neutral-800"></div>
                    <div className="p-4 flex flex-col space-y-3">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-full"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3"></div>
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/3 mt-2"></div>
                      <div className="flex justify-between items-center pt-3">
                        <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-16"></div>
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-20"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden animate-pulse flex h-36">
                    <div className="w-48 bg-neutral-200 dark:bg-neutral-800 shrink-0"></div>
                    <div className="p-4 flex flex-col justify-center space-y-3 flex-1">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3"></div>
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/3"></div>
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/4"></div>
                    </div>
                  </div>
                )
              ))
            ) : courses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md mb-6">
                  {searchQuery
                    ? `We couldn't find any courses matching "${searchQuery}".`
                    : selectedCategoryName
                      ? `No courses available in "${selectedCategoryName}" yet.`
                      : 'No courses available right now.'}
                </p>
                <div className="flex gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategorySelect('')}
                      className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-lg transition-colors"
                    >
                      Show all categories
                    </button>
                  )}
                </div>
              </div>
            ) : courses.map((course, idx) => {
              const instructorName = getInstructorName(course.instructor);
              const difficultyMap = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
              const difficultyLabel = difficultyMap[course.level] || course.level || '';
              const difficultyColor = course.level === 'BEGINNER' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30'
                : course.level === 'ADVANCED' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30';
              const rating = course.averageRating || 0;

              if (viewMode === 'list') {
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-orange-900/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all rounded-xl overflow-hidden flex"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-48 md:w-56 shrink-0 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden relative">
                      {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-neutral-800 dark:to-neutral-900"></div>
                          <span className="relative font-bold text-3xl text-orange-500/30 dark:text-neutral-600 group-hover:scale-110 transition-transform duration-500">
                            {course.title ? course.title.substring(0, 2).toUpperCase() : '??'}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="p-5 flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {difficultyLabel && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${difficultyColor}`}>
                            {difficultyLabel}
                          </span>
                        )}
                        {course.categories && course.categories.length > 0 && (
                          <span className="text-[10px] font-medium uppercase text-neutral-400 dark:text-neutral-500">
                            {course.categories[0].name}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">{course.title}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{instructorName}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          {rating > 0 ? (
                            <>
                              <span className="font-bold text-amber-600 dark:text-amber-500">{rating.toFixed(1)}</span>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span key={s} className={`material-symbols-outlined text-[13px] ${s <= Math.round(rating) ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'}`} style={s <= Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                                ))}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-neutral-400">No ratings</span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">group</span>
                          {course.studentCount || 0}
                        </span>
                        <span className="ml-auto font-bold text-neutral-900 dark:text-white">
                          {course.price === 0 || !course.price ? <span className="text-emerald-500">Free</span> : `$${course.price}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-orange-900/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col h-full rounded-xl overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden relative">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-neutral-800 dark:to-neutral-900"></div>
                        <span className="relative font-bold text-5xl text-orange-500/25 dark:text-neutral-600 group-hover:scale-110 transition-transform duration-500">
                          {course.title ? course.title.substring(0, 2).toUpperCase() : '??'}
                        </span>
                      </>
                    )}
                    {/* Difficulty badge */}
                    {difficultyLabel && (
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border backdrop-blur-sm ${difficultyColor}`}>
                        {difficultyLabel}
                      </span>
                    )}
                    {/* Price badge on thumbnail */}
                    <span className="absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50">
                      {course.price === 0 || !course.price ? <span className="text-emerald-500">Free</span> : `$${course.price}`}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1.5 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">{course.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">person</span>
                      {instructorName}
                    </p>

                    {/* Category tag */}
                    {course.categories && course.categories.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                        {course.categories.slice(0, 2).map(cat => (
                          <span key={cat.id} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-md">
                            <span className="material-symbols-outlined text-[11px]">label</span>
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {rating > 0 ? (
                        <>
                          <span className="text-sm font-bold text-amber-600 dark:text-amber-500">{rating.toFixed(1)}</span>
                          <div className="flex items-center gap-px">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={`material-symbols-outlined text-[13px] ${s <= Math.round(rating) ? 'text-amber-500' : 'text-neutral-200 dark:text-neutral-700'}`}
                                style={s <= Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                              >star</span>
                            ))}
                          </div>
                          <span className="text-[11px] text-neutral-400">({course.reviewCount || 0})</span>
                        </>
                      ) : (
                        <span className="text-[11px] text-neutral-400">No ratings yet</span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">group</span>
                          {course.studentCount || 0}
                        </span>
                        {course.categories && course.categories.length > 0 && (
                          <span className="flex items-center gap-1 truncate max-w-[100px]">
                            <span className="material-symbols-outlined text-[13px]">label</span>
                            {course.categories[0].name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        View <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center pt-8">
              <nav className="inline-flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-sm">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  if (totalPages > 7 && Math.abs(index - page) > 2 && index !== 0 && index !== totalPages - 1) {
                    if (index === 1 || index === totalPages - 2) return <span key={index} className="w-9 h-9 flex items-center justify-center text-xs text-neutral-300 dark:text-neutral-600">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${page === index
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                        : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-neutral-900 dark:bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-lg text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-neutral-900 mb-3 tracking-tight">
              Ready to level up your skills?
            </h2>
            <p className="text-neutral-400 dark:text-neutral-600 text-sm">
              Join thousands of learners mastering algorithms and acing their interviews.
            </p>
          </div>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 shrink-0">
            Get Started Free <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-800 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4 text-neutral-900 dark:text-white">
                <img alt="TrickCode Logo" className="w-7 h-7 object-contain rounded-lg" src={logo} />
                <span className="font-bold text-lg tracking-tight">Trickcode</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                The premier platform for learning data structures and algorithms. Master DSA and ace your technical interviews.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-1">Marketplace</span>
              <Link to="/learn" className="text-xs hover:text-orange-500 transition-colors">Browse All</Link>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Instructors</a>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Become a Mentor</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-1">Resources</span>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Blog</a>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Documentation</a>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Community</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-1">Legal</span>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Privacy</a>
              <a href="#" className="text-xs hover:text-orange-500 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center text-[11px] font-medium text-neutral-400">
            <span>&copy; 2026 Trickcode Inc.</span>
            <div className="flex gap-5 mt-3 md:mt-0">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Github</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
