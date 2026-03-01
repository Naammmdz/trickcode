import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import HeroGLBackground from '../components/ui/HeroGLBackground';

const MarketplaceHome = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = {
    'Data Structures': 'data_object',
    'Algorithms': 'code_blocks',
    'Graph Theory': 'scatter_plot',
    'Trees & Graphs': 'account_tree',
    'Sorting & Searching': 'sort',
    'Math & Geometry': 'functions',
    'Dynamic Programming': 'dynamic_feed',
    'System Design': 'architecture',
    'Web Development': 'web',
    'Machine Learning': 'smart_toy',
    'Database': 'storage',
    'DevOps': 'cloud',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, catsData] = await Promise.all([
          courseService.getPublicCourses({ page: 0, size: 8, sort: 'id,desc' }),
          courseService.getCategories().catch(() => [])
        ]);
        setFeaturedCourses(coursesData.content || []);
        const cats = catsData?.content || catsData || [];
        setCategories(Array.isArray(cats) ? cats.filter(c => c.isActive !== false) : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getInstructorName = (instructor) => {
    if (!instructor) return 'Unknown';
    if (instructor.firstName && instructor.lastName) {
      return `${instructor.firstName} ${instructor.lastName}`;
    }
    if (instructor.firstName) return instructor.firstName;
    if (instructor.login) return instructor.login;
    return 'Unknown';
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <header className="relative mt-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-20 px-6 z-10 overflow-hidden">
        <HeroGLBackground />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Trusted by 10,000+ learners worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.05] mb-6 text-neutral-900 dark:text-white">
              Master <span className="text-orange-500">DSA</span> with<br />Expert-Led Courses
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Level up your problem-solving skills with world-class curriculum in algorithms, data structures, and system design.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link to="/learn" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-base transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5">
                Browse Courses <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link to="/learn" className="inline-flex items-center gap-2 bg-white dark:bg-[#0a0a0a] border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 font-medium py-4 px-8 rounded-lg text-base transition-all hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[20px]">grid_view</span> Explore Categories
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '200+', label: 'Lessons', icon: 'play_circle' },
              { value: '50+', label: 'Courses', icon: 'school' },
              { value: '10k+', label: 'Students', icon: 'group' },
              { value: '4.9', label: 'Avg Rating', icon: 'star' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined text-xl" style={stat.icon === 'star' ? { fontVariationSettings: "'FILL' 1" } : {}}>{stat.icon}</span>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Top Categories */}
      <section className="py-16 px-6 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif font-medium text-neutral-900 dark:text-white mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(categories.length > 0 ? categories : [
              { id: 'ds', name: 'Data Structures' },
              { id: 'algo', name: 'Algorithms' },
              { id: 'graph', name: 'Graph Theory' },
              { id: 'tree', name: 'Trees & Graphs' },
              { id: 'sort', name: 'Sorting & Searching' },
              { id: 'math', name: 'Math & Geometry' },
              { id: 'dp', name: 'Dynamic Programming' },
              { id: 'sd', name: 'System Design' }
            ]).map((cat) => (
              <Link key={cat.id} to={`/learn?category=${cat.id}`} className="group flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-orange-500 hover:shadow-md transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900">
                <div className="text-neutral-500 group-hover:text-orange-500 transition-colors">
                  <span className="material-symbols-outlined text-3xl">{categoryIcons[cat.name] || 'category'}</span>
                </div>
                <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-6 relative z-10 bg-neutral-50 dark:bg-neutral-950/30 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif text-neutral-900 dark:text-white font-medium">Students are viewing</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2">Popular courses chosen by our community</p>
            </div>
            <Link to="/learn" className="hidden md:flex items-center gap-1 font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors">
              Explore All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col h-full rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="p-4 flex flex-col space-y-3">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))
            ) : featuredCourses.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-500">No courses available right now.</div>
            ) : (
              featuredCourses.map((course) => {
                const rating = course.averageRating || 0;
                const reviewCount = course.ratingCount || 0;
                const studentCount = course.enrollmentCount || 0;
                const difficultyMap = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
                const difficultyLabel = difficultyMap[course.difficulty] || course.difficulty || '';
                const difficultyColor = course.difficulty === 'BEGINNER' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : course.difficulty === 'ADVANCED' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';

                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xl transition-all flex flex-col h-full rounded-xl overflow-hidden"
                  >
                    <div className="h-40 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden relative">
                      {course.thumbnailUrl ? (
                        <img src={courseService.getImageUrl(course.thumbnailUrl)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-neutral-800 dark:to-neutral-900 opacity-50"></div>
                          <span className="font-serif text-5xl text-orange-500/20 dark:text-neutral-700/50 italic group-hover:scale-110 transition-transform duration-500">
                            {course.title.substring(0, 2).toUpperCase()}
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
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{getInstructorName(course.instructor)}</p>

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
                            <span className="text-xs text-neutral-400">({reviewCount})</span>
                          </>
                        ) : (
                          <span className="text-xs text-neutral-400">No ratings yet</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          {studentCount} students
                        </span>
                        {course.category && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">label</span>
                            {course.category.name}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <span className="font-bold text-lg text-neutral-900 dark:text-white">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </span>
                        <span className="text-xs font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          View course <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Why Learn With Us (replaces SAAS pricing blocks) */}
      <section className="py-20 px-6 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-neutral-900 dark:text-white mb-4">Why learn on Trickcode?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Learn at your own pace</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Enjoy lifetime access to courses on Trickcode's website. Watch and learn whenever and wherever you want.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Learn from industry experts</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Our instructors and mentors are top engineers from leading tech companies, bringing real-world experience to your screen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">terminal</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Hands-on practice</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Practice what you learn with an interactive coding workspace, immediate feedback, and real-world project portfolios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 relative z-10 bg-neutral-50 dark:bg-neutral-950/30 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-neutral-900 dark:text-white font-medium mb-3">How It Works</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Start learning in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: 'search', title: 'Browse & Choose', desc: 'Explore our library of courses curated by real industry experts. Filter by topic, difficulty, and rating to find your perfect match.' },
              { step: '02', icon: 'play_lesson', title: 'Learn & Practice', desc: 'Watch video lessons, complete interactive quizzes, and write code in our built-in workspace — all in one place.' },
              { step: '03', icon: 'emoji_events', title: 'Earn & Grow', desc: 'Track your progress, earn certificates, and build a portfolio of skills that proves your expertise to employers.' },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 hover:shadow-lg transition-shadow group">
                <div className="text-5xl font-serif font-bold text-orange-100 dark:text-orange-900/30 absolute top-4 right-6 select-none">{item.step}</div>
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Take your career to the next level</h2>
          <p className="text-lg md:text-xl text-neutral-400 dark:text-neutral-600 mb-10 font-light">
            Join thousands of learners achieving their goals with top-tier technical courses.
          </p>
          <Link to="/signup" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors">
            Start Learning for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-neutral-100 dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-800 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-sm text-neutral-600 dark:text-neutral-400 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white">
              <img
                alt="TrickCode Logo"
                className="w-8 h-8 object-contain rounded"
                src={logo}
              />
              <span className="font-serif font-bold text-xl">Trickcode</span>
            </div>
            <p className="max-w-xs leading-relaxed mb-6">
              Empowering developers with world-class curriculum in algorithms, data structures, and competitive programming.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-bold text-neutral-900 dark:text-white mb-2">Trickcode</span>
            <a href="#" className="hover:text-orange-500 transition-colors">About</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Careers</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-bold text-neutral-900 dark:text-white mb-2">Learn</span>
            <Link to="/learn" className="hover:text-orange-500 transition-colors">Browse Courses</Link>
            <a href="#how-it-works" className="hover:text-orange-500 transition-colors">How It Works</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Blog</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-bold text-neutral-900 dark:text-white mb-2">Legal</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <span>© 2026 Trickcode, Inc.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Twitter</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Github</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceHome;
