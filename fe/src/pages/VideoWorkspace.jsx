import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';
import VideoPlayer from '../components/ui/VideoPlayer';
import { courseService } from '../services/courseService';

const VideoWorkspace = () => {
  const { courseId, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isReviewMode = location.state?.reviewMode || false;

  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setIsCompleted(false);
        const [lessonData, courseData, curriculumData, progressData] = await Promise.all([
          courseService.getLesson(lessonId),
          courseService.getCourse(courseId),
          courseService.getCourseCurriculum(courseId),
          !isReviewMode ? courseService.getCourseProgress(courseId) : Promise.resolve(null)
        ]);
        setLesson(lessonData);
        setCourse(courseData);
        setCurriculum(curriculumData);
        if (progressData?.completedLessonIds?.includes(Number(lessonId))) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId && courseId) {
      loadData();
    }
  }, [lessonId, courseId]);

  const markAsComplete = async () => {
    if (isReviewMode || isCompleted || markingComplete) return;
    setMarkingComplete(true);
    try {
      await courseService.completeLesson(lessonId);
      setIsCompleted(true);
      console.log('Lesson marked as completed:', lessonId);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleVideoEnded = async () => {
    await markAsComplete();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] h-screen flex items-center justify-center">
        <div className="text-primary font-mono">Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">{error || 'Lesson not found'}</h1>
          <Link
            to={isReviewMode ? `/admin/review/${courseId}` : `/my-courses/${courseId}`}
            state={isReviewMode ? { reviewMode: true } : undefined}
            className="text-primary hover:text-primary-hover font-mono"
          >
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const getLessonRoute = (lessonItem) => {
    const type = lessonItem.type?.toLowerCase();
    const baseRoute = isReviewMode ? `/admin/review/${courseId}` : `/my-courses/${courseId}`;
    if (type === 'quiz') return `${baseRoute}/quiz/${lessonItem.id}`;
    if (type === 'code') return `${baseRoute}/code/${lessonItem.id}`;
    return `${baseRoute}/lesson/${lessonItem.id}`;
  };

  let prevLesson = null;
  let nextLesson = null;
  if (curriculum?.sections) {
    const flattenedLessons = curriculum.sections.flatMap(section => section.lessons || []);
    const currentIndex = flattenedLessons.findIndex(l => l.id === Number(lessonId));
    if (currentIndex > 0) prevLesson = flattenedLessons[currentIndex - 1];
    if (currentIndex !== -1 && currentIndex < flattenedLessons.length - 1) nextLesson = flattenedLessons[currentIndex + 1];
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-hidden selection:bg-primary selection:text-white h-screen flex flex-col">
      {/* Admin Review Banner */}
      {isReviewMode && course && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-neutral-900 text-white z-[60] flex items-center justify-between px-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">ADMIN REVIEW MODE</span>
            <span className="text-sm text-neutral-300">You have full access to this course content.</span>
            {course.status && (
              <span className="text-xs text-neutral-400 ml-2">
                Status: <span className="text-white font-bold">{course.status}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Only show approve/reject if status is PENDING or REJECTED */}
            {course.status && (course.status === 'PENDING' || course.status === 'REJECTED') && (
              <>
                <button className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                  Reject Course
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-green-900/20">
                  Approve & Publish
                </button>
              </>
            )}
            {/* Show status info if already published */}
            {course.status === 'PUBLISHED' && (
              <span className="text-sm text-green-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Course is already published
              </span>
            )}
            <button onClick={() => navigate('/admin')} className="ml-4 text-neutral-500 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`w-full z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 h-16 shrink-0 ${isReviewMode ? 'mt-16' : ''}`}>
        <div className="w-full px-6 h-full flex items-center justify-between">
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

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <CourseSyllabus courseId={courseId} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black relative">
          {/* Breadcrumb */}
          <div className="h-12 border-b border-neutral-100 dark:border-neutral-800 flex items-center px-6 gap-2 text-[10px] font-sans uppercase tracking-widest text-neutral-500 overflow-x-auto whitespace-nowrap bg-white dark:bg-neutral-950">
            {isReviewMode ? (
              <>
                <Link to="/admin" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Admin Dashboard</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <Link
                  to={`/admin/review/${courseId}`}
                  state={{ reviewMode: true }}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {course?.title || 'Review Course'}
                </Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Video'}</span>
              </>
            ) : (
              <>
                <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <Link to={`/my-courses/${courseId}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">{course?.title || 'Course'}</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Video'}</span>
              </>
            )}
          </div>

          {/* Video Player */}
          <div className="flex-1 overflow-y-auto scroll-smooth pb-20">
            <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-10 pb-8">
              {lesson.type === 'VIDEO' && lesson.videoUrl && (
                <div className="mb-8">
                  <VideoPlayer
                    videoUrl={lesson.videoUrl}
                    title={lesson.title}
                    className="shadow-2xl border border-neutral-800"
                    onEnded={handleVideoEnded}
                  />
                </div>
              )}

              {/* Lesson Info */}
              <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white">{lesson.title}</h1>
                  <div className="flex gap-2">
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <span className="material-symbols-outlined text-lg">bookmark</span>
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <span className="material-symbols-outlined text-lg">share</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Content Rendering */}
                <div className="prose dark:prose-invert prose-neutral max-w-none text-neutral-600 dark:text-neutral-400 leading-relaxed font-light whitespace-pre-line">
                  {lesson.markdownContent || 'No content available for this lesson.'}
                </div>

                {/* Mark as Complete Button */}
                {!isReviewMode && (
                  <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    {isCompleted ? (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                        <span className="material-symbols-outlined text-emerald-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <div>
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Lesson Completed</p>
                          <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Great job! Move on to the next lesson.</p>
                        </div>
                        {nextLesson && (
                          <Link
                            to={getLessonRoute(nextLesson)}
                            className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            Next Lesson
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={markAsComplete}
                        disabled={markingComplete}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">{markingComplete ? 'hourglass_empty' : 'task_alt'}</span>
                        {markingComplete ? 'Saving...' : 'Mark as Complete'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 p-4 md:px-8 flex items-center justify-between z-20 h-20">
            {prevLesson ? (
              <Link to={getLessonRoute(prevLesson)} state={isReviewMode ? { reviewMode: true } : undefined} className="flex items-center gap-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group text-left">
                <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center group-hover:border-neutral-900 dark:group-hover:border-white transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Previous Lesson</span>
                  <span className="block text-xs font-medium truncate max-w-[150px]">{prevLesson.title}</span>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            <div className="flex items-center gap-2">
              <button className="hidden lg:hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 rounded">
                <span className="material-symbols-outlined text-lg">list</span> View Syllabus
              </button>
            </div>
            {nextLesson ? (
              <Link to={getLessonRoute(nextLesson)} state={isReviewMode ? { reviewMode: true } : undefined} className="flex items-center gap-4 text-neutral-900 dark:text-white group text-right">
                <div className="hidden sm:block">
                  <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Next Lesson</span>
                  <span className="block text-xs font-medium truncate max-w-[150px]">{nextLesson.title}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </main>
      </div>

      {/* AI Assistant Button */}
      <button className="fixed bottom-24 right-8 z-50 group">
        <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl group-hover:bg-primary/60 transition-colors animate-pulse duration-1000"></div>
        <div className="relative bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl border border-white/10 dark:border-neutral-200 overflow-hidden hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent"></div>
        </div>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 rounded-lg text-[10px] font-sans uppercase tracking-widest shadow-xl border border-neutral-100 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
          AI Assistant
          <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white dark:bg-neutral-800 rotate-45 border-t border-r border-neutral-100 dark:border-neutral-700"></span>
        </span>
      </button>
    </div>
  );
};

export default VideoWorkspace;
