import { Link } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { proSubscriptionService } from '../services/proService';
import { useState, useEffect } from 'react';

/* ─── Skeleton card for loading state ─── */
const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-neutral-200 dark:bg-neutral-800" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
      <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded w-full mt-4" />
    </div>
  </div>
);

/* ─── Course Card ─── */
const CourseCard = ({ course }) => {
  const progressPercent = course.progress || 0;
  const hasStarted = progressPercent > 0;

  return (
    <Link
      to={`/my-courses/${course.id}`}
      className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-neutral-200/60 dark:hover:shadow-none hover:border-orange-300 dark:hover:border-orange-500/40 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={courseService.getImageUrl(course.thumbnailUrl)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-neutral-900">
            <span className="text-4xl font-bold text-orange-300 dark:text-orange-700">{course.symbol}</span>
          </div>
        )}
        {/* Enrolled badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/90 text-white backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Enrolled
          </span>
        </div>
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-orange-500 text-2xl ml-0.5">play_arrow</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[15px] leading-snug text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {course.title}
        </h3>

        {/* Progress */}
        <div className="space-y-2">
          {/* Progress Text */}
          <div className="flex justify-between items-center text-xs text-neutral-500 font-medium tracking-wide">
            <span>{course.progress > 0 ? `${course.progress}% Completed` : 'Not Started'}</span>
            <span>{course.completedLessons || 0}/{course.totalLessons || 0} Lessons</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
          {hasStarted ? 'Continue Learning' : 'Start Course'}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Main Component ─── */
const MyCourses = () => {
  const { user } = useAuth();
  const [activeCourses, setActiveCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [isPro, setIsPro] = useState(true); // default true to hide banner until checked

  useEffect(() => {
    proSubscriptionService.getStatus()
      .then(data => setIsPro(data.isStudentPro || false))
      .catch(() => setIsPro(false));
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const result = await courseService.getMyEnrolledCourses({
          page: 0,
          size: 50,
          sort: 'id,desc'
        });

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          (result.content || []).map(async (course) => {
            try {
              const progressInfo = await courseService.getCourseProgress(course.id);
              return {
                id: course.id,
                symbol: course.title ? course.title.substring(0, 2).toUpperCase() : '??',
                title: course.title,
                thumbnailUrl: course.thumbnailUrl,
                categories: course.categories || [],
                progress: progressInfo.progressPercent || 0,
                completedLessons: progressInfo.completedLessons || 0,
                totalLessons: progressInfo.totalLessons || 0
              };
            } catch (e) {
              console.warn(`Failed to fetch progress for course ${course.id}:`, e);
              return {
                id: course.id,
                symbol: course.title ? course.title.substring(0, 2).toUpperCase() : '??',
                title: course.title,
                thumbnailUrl: course.thumbnailUrl,
                categories: course.categories || [],
                progress: 0,
                completedLessons: 0,
                totalLessons: 0
              };
            }
          })
        );

        setActiveCourses(coursesWithProgress);
      } catch (err) {
        console.error('Failed to load courses', err);
        setError('Could not connect to server. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = activeCourses.filter(c => {
    if (filter === 'in-progress') return c.progress > 0 && c.progress < 100;
    if (filter === 'completed') return c.progress === 100;
    return true;
  });

  const stats = {
    total: activeCourses.length,
    inProgress: activeCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: activeCourses.filter(c => c.progress === 100).length,
  };

  const filters = [
    { key: 'all', label: 'All Courses', count: stats.total },
    { key: 'in-progress', label: 'In Progress', count: stats.inProgress },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 relative z-10">
        {/* Hero / Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Welcome back,</p>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                  {user?.name || 'Student'}
                </h1>
              </div>
              {/* Quick stats */}
              {!loading && activeCourses.length > 0 && (
                <div className="flex gap-6 md:gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Enrolled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{stats.inProgress}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pro Upgrade Banner (students only, non-Pro) */}
        {!isPro && (
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 md:p-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Unlock AI Learning Assistant</p>
                    <p className="text-blue-100 text-xs mt-0.5">Get code hints, failure explanations, and AI Q&A while you learn.</p>
                  </div>
                </div>
                <Link
                  to="/checkout/pro?plan=STUDENT_PRO"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-blue-50 transition-colors shadow-lg shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">stars</span>
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 mt-8">
          {/* Toolbar: Filters + Browse link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.key
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-orange-500/40'
                    }`}
                >
                  {f.label}
                  <span className={`text-xs ${filter === f.key ? 'text-orange-100' : 'text-neutral-400 dark:text-neutral-500'}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">explore</span>
              Browse Marketplace
            </Link>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-orange-400">
                  {activeCourses.length === 0 ? 'school' : 'filter_list_off'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {activeCourses.length === 0 ? 'No courses yet' : 'No matching courses'}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
                {activeCourses.length === 0
                  ? "You haven't enrolled in any courses yet. Explore our marketplace to find courses that interest you."
                  : 'Try changing your filter to see more courses.'}
              </p>
              {activeCourses.length === 0 ? (
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">explore</span>
                  Explore Courses
                </Link>
              ) : (
                <button
                  onClick={() => setFilter('all')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium rounded-xl hover:border-orange-300 dark:hover:border-orange-500/40 transition-colors"
                >
                  Show All Courses
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img alt="TrickCode Logo" className="w-4 h-4 object-contain rounded" src={logo} />
            <span className="font-semibold text-neutral-900 dark:text-white">Trickcode</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span>© {new Date().getFullYear()}</span>
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
