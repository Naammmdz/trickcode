import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { courseService } from '../services/courseService';

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isReviewMode = location.state?.isReviewMode || false;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  console.log('LessonDetail - isReviewMode:', isReviewMode, 'location.state:', location.state);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getLesson(lessonId);
        setLesson(data);
      } catch (error) {
        console.error('Error loading lesson:', error);
        setError('Failed to load lesson. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-primary font-mono">Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">
            {error || 'Lesson not found'}
          </h1>
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

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col h-screen overflow-hidden">
      {/* Compact Navbar */}
      <nav className="w-full py-3 px-6 md:px-8 flex justify-between items-center backdrop-blur-md bg-white/90 dark:bg-frontier-black/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-lg z-50 shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Link to="/" className="relative w-8 h-8 flex items-center justify-center">
            <img
              alt="TrickCode Logo"
              className="w-full h-full object-contain opacity-100"
              src={logo}
            />
          </Link>
          <span className="text-lg font-serif tracking-tight text-gray-900 dark:text-white font-medium hidden sm:block">
            TrickCode
          </span>
          <div className="h-6 w-px bg-gray-300 dark:bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-gray-600 dark:text-gray-500 hidden md:flex">
            {isReviewMode ? (
              <>
                <Link to="/admin" className="hover:text-primary cursor-pointer transition">
                  Admin Dashboard
                </Link>
                <span>/</span>
                <Link 
                  to={`/admin/review/${courseId}`}
                  state={{ reviewMode: true }}
                  className="hover:text-primary cursor-pointer transition"
                >
                  Review Course
                </Link>
                <span>/</span>
                <span className="text-primary font-bold">{lesson.title}</span>
              </>
            ) : (
              <>
                <Link to="/my-courses" className="hover:text-primary cursor-pointer transition">
                  My Courses
                </Link>
                <span>/</span>
                <Link to={`/my-courses/${courseId}`} className="hover:text-primary cursor-pointer transition">
                  Course
                </Link>
                <span>/</span>
                <span className="text-primary font-bold">{lesson.title}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 font-mono">
          <Link
            to="/learn"
            className="text-primary transition drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] hidden md:block"
          >
            // Learn
          </Link>
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 px-3 py-1.5 rounded transition text-xs text-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-20"></div>
        </div>

        {/* Left Sidebar - Syllabus (Hidden for now - needs curriculum API) */}
        {false && (
        <aside className="w-80 bg-gray-50 dark:bg-[#080808] border-r border-gray-200 dark:border-white/5 flex-col hidden lg:flex shrink-0 z-20">
          <div className="p-5 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-frontier-black/50 backdrop-blur-sm">
            <h2 className="text-sm font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">segment</span>
              Lesson Syllabus
            </h2>
          </div>
        </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
          <div className="max-w-4xl mx-auto px-6 py-8">
            
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-white/5 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-2">{lesson.title}</h1>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-600 dark:text-gray-500 mt-2">
                    {lesson.duration && (
                      <>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>{' '}
                          {Math.floor(lesson.duration / 60)} min
                        </span>
                        <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                      </>
                    )}
                    <span className="text-primary uppercase">{lesson.type || 'LESSON'}</span>
                  </div>
                </div>
                <button className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 rounded font-mono text-xs border border-gray-300 dark:border-white/10 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">bookmark_add</span> SAVE
                </button>
              </div>
            </header>

            {/* Video Player for VIDEO type */}
            {lesson.type?.toLowerCase() === 'video' && lesson.videoUrl && (
              <div className="mb-12 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10">
                <div className="aspect-video bg-black">
                  <video
                    controls
                    className="w-full h-full"
                    src={lesson.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Lesson Description */}
            {lesson.description && (
              <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-light prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary mb-8">
                <p className="text-lg">{lesson.description}</p>
              </article>
            )}

            {/* Article Content */}
            {lesson.content && (
              <article 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-light prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            )}

            {/* Navigation - Coming soon */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-4">
              <Link
                to={isReviewMode ? `/admin/review/${courseId}` : `/my-courses/${courseId}`}
                state={isReviewMode ? { reviewMode: true } : undefined}
                className="group flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-frontier-card hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                <span className="font-serif text-sm text-gray-900 dark:text-white">Back to Course</span>
              </Link>
            </div>
          </div>

          <footer className="border-t border-gray-200 dark:border-white/5 py-8 text-center text-xs text-gray-600 dark:text-gray-600 font-mono">
            TrickCode System V.2.0 - All Rights Reserved
          </footer>
        </main>

        {/* Right Sidebar - Tools */}
        <aside className="w-16 md:w-20 border-l border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#080808]/80 backdrop-blur-md flex flex-col items-center py-6 gap-6 z-30 shrink-0">
          <div className="flex flex-col gap-6 sticky top-6">
            <div className="group relative flex items-center justify-center">
              <button className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all border border-gray-300 dark:border-white/5 hover:border-primary/50 shadow-sm">
                <span className="material-symbols-outlined text-xl">menu_book</span>
              </button>
              <span className="absolute right-full mr-3 bg-gray-800 dark:bg-gray-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600 dark:border-white/10">
                Glossary
              </span>
            </div>
            <div className="group relative flex items-center justify-center">
              <button className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all border border-gray-300 dark:border-white/5 hover:border-primary/50 shadow-sm">
                <span className="material-symbols-outlined text-xl">edit_note</span>
              </button>
              <span className="absolute right-full mr-3 bg-gray-800 dark:bg-gray-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600 dark:border-white/10">
                Take Note
              </span>
            </div>
            <div className="group relative flex items-center justify-center">
              <button className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all border border-gray-300 dark:border-white/5 hover:border-primary/50 shadow-sm">
                <span className="material-symbols-outlined text-xl">terminal</span>
              </button>
              <span className="absolute right-full mr-3 bg-gray-800 dark:bg-gray-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600 dark:border-white/10">
                Code Lab
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300 dark:bg-white/10 my-2"></div>
            <div className="group relative flex items-center justify-center">
              <button className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-all border border-gray-300 dark:border-white/5">
                <span className="material-symbols-outlined text-xl">bug_report</span>
              </button>
              <span className="absolute right-full mr-3 bg-gray-800 dark:bg-gray-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600 dark:border-white/10">
                Report Issue
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LessonDetail;
