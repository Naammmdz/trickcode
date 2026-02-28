import { Link } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
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

        const data = await courseService.getMyEnrolledCourses({ page: 0, size: 50, sort: 'id,desc' });

        const mapped = (data.content || []).map(c => ({
          id: c.id,
          symbol: c.title ? c.title.substring(0, 2).toUpperCase() : '??',
          title: c.title,
          thumbnailUrl: c.thumbnailUrl,
          rating: 5.0,
          progress: 0,
          isNew: false,
        }));
        setActiveCourses(mapped);
      } catch (err) {
        console.error("MyCourses: Failed to fetch enrolled courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 border-b border-neutral-200 dark:border-neutral-800 pb-10">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-neutral-900 dark:text-white">
                Learning Dashboard:{' '}
                <span className="italic text-neutral-500 dark:text-neutral-400">{user?.name || 'Student'}</span>
              </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Active Courses */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-xs font-sans uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                    My Courses
                  </h2>
                  <Link to="/marketplace" className="text-[10px] font-sans hover:text-primary transition-colors">
                    Browse Marketplace →
                  </Link>
                </div>

                {loading ? (
                  <div className="text-neutral-500 dark:text-neutral-400">Loading...</div>
                ) : activeCourses.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded">
                    <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">You haven't enrolled in any courses yet.</div>
                    <Link
                      to="/marketplace"
                      className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                    >
                      Explore courses <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-gray-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-xs font-sans text-neutral-400 rounded overflow-hidden">
                            {course.thumbnailUrl ? (
                              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              course.symbol
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-sans text-yellow-500">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              star
                            </span>{' '}
                            {course.rating}
                          </div>
                        </div>
                        <h4 className="text-lg font-serif mb-4 h-14 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
                          {course.title}
                        </h4>
                        <div className="mb-6">
                          <div className="flex justify-between text-[10px] font-sans uppercase tracking-widest text-neutral-500 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded">
                            <div className="h-full bg-neutral-900 dark:bg-white rounded" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                        <Link
                          to={`/my-courses/${course.id}`}
                          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                        >
                          Start Course <span className="material-symbols-outlined text-sm">play_arrow</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span className="text-lg font-serif">
                      48<span className="text-xs">h</span> 20<span className="text-xs">m</span>
                    </span>
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
            <img alt="TrickCode Logo" className="w-4 h-4 object-contain rounded" src={logo} />
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
