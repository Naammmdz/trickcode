import { Link } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggler from '../components/ui/ThemeToggler';
import { courseService } from '../services/courseService';
import { useState, useEffect } from 'react';

const MyCourses = () => {
  const { user } = useAuth();
  const [activeCourses, setActiveCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // In a real app, this should be getEnrolledCourses()
        const data = await courseService.getCourses({ page: 0, size: 5, sort: 'id,desc' });

        const mapped = (data.content || []).map(c => ({
          id: c.id,
          symbol: c.title ? c.title.substring(0, 2).toUpperCase() : '??',
          title: c.title,
          rating: 5.0, // Placeholder
          progress: 10, // Placeholder for enrolled progress
          isNew: c.createdDate && new Date(c.createdDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created in last 7 days (mock logic)
        }));
        setActiveCourses(mapped);
      } catch (err) {
        console.error("MyCourses: Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 border-b border-neutral-200 dark:border-neutral-800 pb-10">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-neutral-900 dark:text-white">
                Learning Dashboard: <span className="italic text-neutral-500 dark:text-neutral-400">{user?.name || 'Student'}</span>
              </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Resume Mission */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-xs font-sans uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Continue Learning
                  </h2>
                  <span className="text-[10px] font-sans text-neutral-400">Last Active: 2h ago</span>
                </div>
                <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-colors flex flex-col md:flex-row rounded overflow-hidden">
                  <div className="w-full md:w-5/12 bg-gray-50 dark:bg-neutral-950 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800 min-h-[200px] md:min-h-0">
                    <span className="font-serif text-7xl text-neutral-200 dark:text-neutral-800 italic z-0">DP[]</span>
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors"></div>
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-h-0">
                    <div className="flex-shrink-0">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-sans uppercase tracking-widest rounded">In Progress</span>
                        <span className="text-xs font-sans text-neutral-500">Module 4/12</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif mb-3 group-hover:underline decoration-1 underline-offset-4">Dynamic Programming Patterns</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-light">Next: Memoization vs Tabulation. Understand the trade-offs in space complexity for production systems.</p>
                    </div>
                    <div className="flex-shrink-0 mt-auto">
                      <div className="flex justify-between text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-2">
                        <span>Completion</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 mb-6 border border-neutral-200 dark:border-neutral-700 rounded">
                        <div className="h-full bg-neutral-900 dark:bg-white w-[65%] relative rounded" style={{
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
                          backgroundSize: '1rem 1rem'
                        }}>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Link to="/my-courses/1" className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans uppercase py-3 text-center hover:opacity-90 transition-opacity rounded">
                          Continue Learning
                        </Link>
                        <button className="px-4 py-3 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded flex-shrink-0">
                          <span className="material-symbols-outlined text-lg">bookmark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Active Courses */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-xs font-sans uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                    Active Courses
                  </h2>
                  <Link to="/marketplace" className="text-[10px] font-sans hover:text-primary transition-colors">
                    View All History →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCourses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-xs font-sans text-neutral-400 rounded">
                          {course.symbol}
                        </div>
                        {course.isNew ? (
                          <div className="flex items-center gap-1 text-[10px] font-sans text-neutral-400">
                            New
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-sans text-yellow-500">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {course.rating}
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-serif mb-4 h-14 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">{course.title}</h4>
                      <div className="mb-6">
                        <div className="flex justify-between text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded">
                          <div className="h-full bg-neutral-900 dark:bg-white rounded" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      <Link to={`/my-courses/${course.id}`} className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
                        {course.progress === 0 ? (
                          <>
                            Start Course <span className="material-symbols-outlined text-sm">play_arrow</span>
                          </>
                        ) : (
                          <>
                            Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </>
                        )}
                      </Link>
                    </div>
                  ))}
                  <Link to="/marketplace" className="bg-gray-50 dark:bg-neutral-950 border border-dashed border-neutral-300 dark:border-neutral-700 p-6 hover:border-primary hover:text-primary transition-colors flex flex-col justify-center items-center text-center group rounded">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600 mb-3 group-hover:text-primary transition-colors">add_circle</span>
                    <h4 className="text-sm font-serif mb-1">Explore New Courses</h4>
                    <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-widest">Browse Marketplace</p>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12 pl-0 lg:pl-8 lg:border-l border-neutral-200 dark:border-neutral-800">
              {/* Daily Records */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 relative overflow-hidden rounded">
                <div className="absolute top-0 right-0 p-2 opacity-10 font-serif text-8xl leading-none select-none pointer-events-none">365</div>
                <h2 className="text-xs font-sans uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_month</span> Daily Records
                </h2>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-serif">12</span>
                  <span className="text-sm font-sans text-neutral-500 uppercase">Day Streak</span>
                </div>
                <p className="text-xs text-neutral-500 mb-6">Keep the momentum. You're in the top 10% this week.</p>
                <div className="flex justify-between items-center pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-sans uppercase text-neutral-400">Total Focus</span>
                    <span className="text-lg font-serif">48<span className="text-xs">h</span> 20<span className="text-xs">m</span></span>
                  </div>
                  <div className="flex gap-1">
                    <span className="block w-1.5 h-6 bg-primary/20 rounded-sm"></span>
                    <span className="block w-1.5 h-6 bg-primary/40 rounded-sm"></span>
                    <span className="block w-1.5 h-6 bg-primary/60 rounded-sm"></span>
                    <span className="block w-1.5 h-6 bg-primary rounded-sm"></span>
                    <span className="block w-1.5 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h2 className="text-xs font-sans uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">notifications_active</span> Updates
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start group cursor-pointer">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <div>
                      <h4 className="text-sm font-serif mb-1 group-hover:text-primary transition-colors">Mock Interview Scheduled</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        Session with Sr. Eng from Uber starts in 2 hours. Review your system design notes.
                      </p>
                      <span className="text-[10px] font-sans text-neutral-400 mt-2 block">Today, 14:00</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
                  <div className="flex gap-4 items-start group cursor-pointer">
                    <div className="mt-1 w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700 flex-shrink-0 group-hover:bg-primary transition-colors"></div>
                    <div>
                      <h4 className="text-sm font-serif mb-1 group-hover:text-primary transition-colors">Hash Maps Refresher</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        Spaced repetition algorithm flagged this topic. Accuracy dropped below 80%.
                      </p>
                      <span className="text-[10px] font-sans text-neutral-400 mt-2 block">Recommended</span>
                    </div>
                  </div>
                  <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
                  <div className="flex gap-4 items-start group cursor-pointer">
                    <div className="mt-1 w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700 flex-shrink-0 group-hover:bg-primary transition-colors"></div>
                    <div>
                      <h4 className="text-sm font-serif mb-1 group-hover:text-primary transition-colors">New Problem Set: Trees</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        10 new LeetCode hard equivalents added to your purchased bundle.
                      </p>
                      <span className="text-[10px] font-sans text-neutral-400 mt-2 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-6 flex flex-col items-center text-center rounded">
                <span className="material-symbols-outlined text-3xl mb-3">diamond</span>
                <h4 className="font-serif text-lg mb-2">Upgrade to Pro</h4>
                <p className="text-xs opacity-70 mb-4 font-light">Get unlimited mock interviews and AI code reviews.</p>
                <button className="text-[10px] font-sans uppercase tracking-widest border border-current px-4 py-2 hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors rounded">
                  View Plans
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-sans uppercase text-neutral-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img
              alt="TrickCode Logo"
              className="w-4 h-4 object-contain rounded"
              src={logo}
            />
            <span className="font-bold text-neutral-900 dark:text-white">Trickcode Inc.</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-neutral-900 dark:hover:text-white transition-colors" href="#">Support</a>
            <a className="hover:text-neutral-900 dark:hover:text-white transition-colors" href="#">Privacy</a>
            <a className="hover:text-neutral-900 dark:hover:text-white transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyCourses;
