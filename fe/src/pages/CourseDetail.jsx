import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import CourseCurriculum from '../components/course/CourseCurriculum';
import { courseService } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail = () => {
  const { id, courseId: courseIdParam } = useParams();
  const courseId = id || courseIdParam;
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseAccess, setCourseAccess] = useState(null);
  const [progress, setProgress] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef(null);

  // Admin review state
  const isReviewMode = !!location.state?.reviewMode;
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Determine context: enrolled user viewing from My Courses vs browsing marketplace
  const isMyCoursesContext = location.pathname.startsWith('/my-courses/');
  const isAdminReviewContext = location.pathname.startsWith('/admin/review/') || location.pathname.startsWith('/review-course/');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourse(courseId);
        setCourse(data);
        if (user) {
          const accessData = await courseService.checkCourseAccess(courseId);
          setCourseAccess(accessData);

          // Fetch progress & curriculum for enrolled users
          if (accessData?.hasAccess) {
            const [progressData, curriculumData] = await Promise.all([
              courseService.getCourseProgress(courseId),
              courseService.getCourseCurriculum(courseId)
            ]);
            setProgress(progressData);
            setCurriculum(curriculumData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId, user]);

  // Show sticky bar when scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApprove = async () => {
    try {
      if (window.confirm('Are you sure you want to approve and publish this course?')) {
        await courseService.approveCourse(courseId);
        alert('Course approved and published successfully!');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Failed to approve course:', error);
      alert('Failed to approve course: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason || rejectReason.trim() === '') {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await courseService.rejectCourse(courseId, rejectReason);
      alert('Course rejected successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to reject course:', error);
      alert('Failed to reject course: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-24 max-w-7xl mx-auto px-6">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div>
                <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl mt-6"></div>
              </div>
              <div className="lg:col-span-4">
                <div className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-3xl text-red-500">error</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{error || 'Course not found'}</h2>
            <p className="text-sm text-neutral-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            {isMyCoursesContext ? (
              <Link to="/my-courses" className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to My Courses
              </Link>
            ) : (
              <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Marketplace
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const difficultyMap = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
  const difficultyLabel = difficultyMap[course.level] || course.level || '';
  const difficultyColor = course.level === 'BEGINNER'
    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
    : course.level === 'ADVANCED'
      ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'
      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
  const instructorName = course.instructor
    ? (course.instructor.firstName ? `${course.instructor.firstName} ${course.instructor.lastName}` : course.instructor.login)
    : 'Unknown Instructor';
  const rating = course.averageRating || 0;
  const reviewCount = course.reviewCount || 0;
  const oldPrice = course.oldPrice;
  const isFree = course.price === 0 || !course.price;
  const hasAccess = courseAccess?.hasAccess;
  const isEnrolled = courseAccess?.isEnrolled || hasAccess;
  const studentCount = course.studentCount || 0;

  // Compute smart continue URL: first uncompleted lesson, or first lesson overall
  const getContinueUrl = () => {
    if (!curriculum?.sections) return `/my-courses/${course.id}`;
    const completedIds = progress?.completedLessonIds || [];
    for (const section of curriculum.sections) {
      for (const lesson of (section.lessons || [])) {
        if (!completedIds.includes(lesson.id)) {
          const type = lesson.type?.toLowerCase();
          if (type === 'quiz') return `/my-courses/${course.id}/quiz/${lesson.id}`;
          if (type === 'code') return `/my-courses/${course.id}/code/${lesson.id}`;
          return `/my-courses/${course.id}/lesson/${lesson.id}`;
        }
      }
    }
    // All completed → go to first lesson
    const firstSection = curriculum.sections[0];
    const firstLesson = firstSection?.lessons?.[0];
    if (firstLesson) {
      const type = firstLesson.type?.toLowerCase();
      if (type === 'quiz') return `/my-courses/${course.id}/quiz/${firstLesson.id}`;
      if (type === 'code') return `/my-courses/${course.id}/code/${firstLesson.id}`;
      return `/my-courses/${course.id}/lesson/${firstLesson.id}`;
    }
    return `/my-courses/${course.id}`;
  };

  const continueUrl = hasAccess ? getContinueUrl() : null;
  const progressPercent = progress?.progressPercent || 0;
  const completedLessons = progress?.completedLessons || 0;
  const totalLessons = progress?.totalLessons || 0;

  const enrollButton = hasAccess ? (
    <Link
      to={continueUrl}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
    >
      <span className="material-symbols-outlined text-[18px]">play_circle</span>
      {progressPercent > 0 ? 'Continue Learning' : 'Start Learning'}
    </Link>
  ) : (
    <Link
      to={`/checkout?courseId=${course.id}`}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
    >
      <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
      {isFree ? 'Enroll for Free' : 'Enroll Now'}
    </Link>
  );

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">

      {/* Admin Review Banner (full approve/reject) */}
      {isReviewMode && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-neutral-900 text-white z-[60] flex items-center justify-between px-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">ADMIN REVIEW</span>
            <span className="hidden sm:inline text-sm text-neutral-300">Full course access for review.</span>
            {course?.status && (
              <span className="text-xs text-neutral-400 ml-2">
                Status: <span className="text-white font-bold">{course.status}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {course?.status && (course.status === 'PENDING' || course.status === 'REJECTED') && (
              <>
                {showRejectInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      placeholder="Reason for rejection..."
                      className="text-sm text-black px-3 py-1.5 rounded-lg outline-none border-none w-64"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button onClick={handleReject} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase">Confirm</button>
                    <button onClick={() => setShowRejectInput(false)} className="text-neutral-400 hover:text-white px-2 text-xs">Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setShowRejectInput(true)} className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold uppercase transition-colors">
                      Reject
                    </button>
                    <button onClick={handleApprove} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase transition-colors">
                      Approve & Publish
                    </button>
                  </>
                )}
              </>
            )}
            {course?.status === 'PUBLISHED' && (
              <span className="text-sm text-emerald-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Published
              </span>
            )}
            <button onClick={() => navigate('/admin')} className="ml-4 text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar - offset when review banner is shown */}
      <div className={isReviewMode ? 'pt-14' : ''}>
        <Navbar />
      </div>

      {/* Course Under Revision Banner - shown to enrolled students when course is not PUBLISHED */}
      {isEnrolled && !isReviewMode && course?.status && course.status !== 'PUBLISHED' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/40">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500 text-xl">info</span>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              This course is currently being updated by the instructor. You can still access all existing content while changes are being made.
            </p>
          </div>
        </div>
      )}

      <main className={`relative z-10 ${isReviewMode ? 'pt-6' : 'pt-20'}`}>

        {/* Hero Section */}
        <div ref={heroRef} className="bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-[#0a0a0a] border-b border-neutral-100 dark:border-neutral-800/50">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
              {isMyCoursesContext || isAdminReviewContext ? (
                <Link to={isAdminReviewContext ? '/admin' : '/my-courses'} className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  {isAdminReviewContext ? 'Admin Dashboard' : 'My Courses'}
                </Link>
              ) : (
                <Link to="/learn" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">storefront</span>
                  Marketplace
                </Link>
              )}
              {!isMyCoursesContext && !isAdminReviewContext && course.categories && course.categories.length > 0 && (
                <>
                  <span className="material-symbols-outlined text-[12px] text-neutral-300 dark:text-neutral-700">chevron_right</span>
                  <Link
                    to={`/learn?category=${course.categories[0].id}`}
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {course.categories[0].name}
                  </Link>
                </>
              )}
              <span className="material-symbols-outlined text-[12px] text-neutral-300 dark:text-neutral-700">chevron_right</span>
              <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]">{course.title}</span>
            </nav>

            <div className="max-w-3xl">
              {/* Left — Course Info */}
              <div>
                {/* Tags row */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {isEnrolled && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Enrolled
                    </span>
                  )}
                  {difficultyLabel && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg border ${difficultyColor}`}>
                      <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                      {difficultyLabel}
                    </span>
                  )}
                  {course.categories && course.categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/learn?category=${cat.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[12px]">label</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-neutral-900 dark:text-white leading-tight mb-4">
                  {course.title}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 max-w-2xl">
                  {course.description || 'No description available.'}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-5 flex-wrap text-sm">
                  {/* Rating */}
                  {rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-600 dark:text-amber-500">{rating.toFixed(1)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-[15px] ${s <= Math.round(rating) ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'}`}
                            style={s <= Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >star</span>
                        ))}
                      </div>
                      <span className="text-neutral-500 text-xs">({reviewCount})</span>
                    </div>
                  )}

                  {/* Students */}
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span className="text-sm">{studentCount.toLocaleString()} students</span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] text-neutral-400">person</span>
                    </div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">by <span className="font-medium text-neutral-900 dark:text-white">{instructorName}</span></span>
                  </div>
                </div>

                {/* Progress Bar for enrolled users */}
                {isEnrolled && hasAccess && progress && !isReviewMode && (
                  <div className="mt-8 p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 text-lg">trending_up</span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">Your Progress</span>
                      </div>
                      <span className="text-sm font-bold text-orange-500">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5 mb-3">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${progressPercent}%`,
                          background: progressPercent === 100
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'linear-gradient(90deg, #f97316, #fb923c)'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{completedLessons} / {totalLessons} lessons completed</span>
                      {progressPercent === 100 ? (
                        <span className="flex items-center gap-1 text-emerald-500 font-medium">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Course Complete!
                        </span>
                      ) : (
                        <span className="text-neutral-400">{totalLessons - completedLessons} remaining</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Mobile price + enroll (shown below lg) */}
                <div className="lg:hidden mt-8 p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    {isFree ? (
                      <span className="text-2xl font-bold text-emerald-500">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-neutral-900 dark:text-white">${course.price?.toFixed(2)}</span>
                        {oldPrice && oldPrice > course.price && (
                          <>
                            <span className="text-sm text-neutral-400 line-through">${oldPrice.toFixed(2)}</span>
                            <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">
                              -{Math.round((1 - course.price / oldPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {enrollButton}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* What You'll Learn */}
              {course.objectives && course.objectives.length > 0 && (
                <section className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500 text-xl">lightbulb</span>
                    What You'll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-emerald-500 text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{obj}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Curriculum Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-orange-500">library_books</span>
                    Course Curriculum
                  </h3>
                </div>
                <CourseCurriculum courseId={courseId} isReviewMode={isReviewMode} />
              </section>

              {/* Instructor Section */}
              <section>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-orange-500">school</span>
                  Your Instructor
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                      <span className="material-symbols-outlined text-3xl text-orange-400 dark:text-neutral-400">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{instructorName}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Instructor on TrickCode</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Dedicated to teaching and creating high-quality learning content for coding enthusiasts globally. Passionate about data structures, algorithms, and software engineering best practices.
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <span className="material-symbols-outlined text-[14px]">group</span>
                          {studentCount} students
                        </div>
                        {rating > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            {rating.toFixed(1)} rating
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-orange-500">reviews</span>
                    Student Reviews
                  </h3>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-px">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-[15px] ${s <= Math.round(rating) ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'}`}
                            style={s <= Math.round(rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >star</span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">{rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-500">({reviewCount})</span>
                    </div>
                  )}
                </div>

                {reviewCount > 0 ? (
                  <div className="space-y-4">
                    <ReviewCard
                      name="David K."
                      role="Software Engineer"
                      text="I finally understand the concepts. The visualization technique changed everything for me. Highly recommended!"
                      rating={5}
                    />
                    <ReviewCard
                      name="Emily R."
                      role="CS Student"
                      text="High production quality and extremely dense material. No fluff. Exactly what I needed."
                      rating={4}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600 mb-3">rate_review</span>
                    <p className="text-sm text-neutral-500">No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar spacer on desktop */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24">
                <SidebarCard
                  course={course}
                  isFree={isFree}
                  oldPrice={oldPrice}
                  enrollButton={enrollButton}
                  studentCount={studentCount}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {!isReviewMode && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{course.title}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  {rating > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {rating.toFixed(1)}
                    </span>
                  )}
                  <span>{studentCount.toLocaleString()} students</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {!hasAccess && (
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {isFree ? <span className="text-emerald-500">Free</span> : `$${course.price?.toFixed(2)}`}
                </span>
              )}
              {hasAccess ? (
                <Link
                  to={continueUrl}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  {progressPercent > 0 ? 'Continue' : 'Start'}
                </Link>
              ) : (
                <Link
                  to={`/checkout?courseId=${course.id}`}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  Enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* CTA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 pb-16 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Ready to start learning?
              </h2>
              <p className="text-neutral-500 text-sm">Join thousands of students mastering their skills on TrickCode.</p>
            </div>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
            >
              Browse Courses
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Footer grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img alt="TrickCode" className="w-6 h-6 object-contain rounded" src={logo} />
                <span className="font-bold text-neutral-900 dark:text-white">TrickCode</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                The premier platform for learning data structures, algorithms, and coding skills.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-neutral-900 dark:text-white text-xs uppercase tracking-wider mb-1">Platform</span>
              <Link to="/learn" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Marketplace</Link>
              <Link to="/problems" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Problems</Link>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Become Instructor</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-neutral-900 dark:text-white text-xs uppercase tracking-wider mb-1">Resources</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Blog</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Documentation</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Community</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-neutral-900 dark:text-white text-xs uppercase tracking-wider mb-1">Legal</span>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors text-xs">Terms of Service</a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
            <span>© 2024 TrickCode Inc. All rights reserved.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ─── Sidebar Card Component ─── */
const SidebarCard = ({ course, isFree, oldPrice, enrollButton, studentCount }) => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xl shadow-neutral-200/30 dark:shadow-none">
    {/* Thumbnail preview */}
    {course.thumbnailUrl && (
      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img src={courseService.getImageUrl(course.thumbnailUrl)} alt={course.title} className="w-full h-full object-cover" />
      </div>
    )}

    <div className="p-6">
      {/* Price */}
      <div className="flex items-center gap-3 mb-5">
        {isFree ? (
          <span className="text-3xl font-bold text-emerald-500">Free</span>
        ) : (
          <>
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">${course.price?.toFixed(2)}</span>
            {oldPrice && oldPrice > course.price && (
              <>
                <span className="text-base text-neutral-400 line-through">${oldPrice.toFixed(2)}</span>
                <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-md ml-auto">
                  {Math.round((1 - course.price / oldPrice) * 100)}% OFF
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* Enroll button */}
      <div className="mb-5">
        {enrollButton}
      </div>

      {/* Guarantee */}
      <p className="text-center text-xs text-neutral-400 mb-6">30-day money-back guarantee</p>

      {/* What's included */}
      <div className="space-y-3.5 pt-5 border-t border-neutral-100 dark:border-neutral-800">
        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">This course includes</h5>
        <IncludedItem icon="videocam" text={`${course.lessonCount || 0} lessons`} />
        <IncludedItem icon="schedule" text={course.duration || 'Self-paced'} />
        <IncludedItem icon="group" text={`${studentCount.toLocaleString()} students enrolled`} />
        <IncludedItem icon="all_inclusive" text="Full lifetime access" />
        <IncludedItem icon="devices" text="Access on mobile & desktop" />
        <IncludedItem icon="workspace_premium" text="Certificate of completion" />
      </div>

      {/* Share buttons */}
      <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-4">
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" title="Share">
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" title="Bookmark">
          <span className="material-symbols-outlined text-lg">bookmark</span>
        </button>
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors" title="Gift this course">
          <span className="material-symbols-outlined text-lg">redeem</span>
        </button>
      </div>
    </div>
  </div>
);

/* ─── Included Item ─── */
const IncludedItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
    <span className="material-symbols-outlined text-[18px] text-neutral-400 dark:text-neutral-500">{icon}</span>
    <span>{text}</span>
  </div>
);

/* ─── Review Card ─── */
const ReviewCard = ({ name, role, text, rating }) => (
  <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center">
          <span className="text-xs font-bold text-orange-500 dark:text-neutral-400">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{name}</p>
          <p className="text-[11px] text-neutral-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-px">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`material-symbols-outlined text-[13px] ${s <= rating ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'}`}
            style={s <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
          >star</span>
        ))}
      </div>
    </div>
    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">"{text}"</p>
  </div>
);

export default CourseDetail;
