import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { fetchCourseById } from '../data/courseData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-primary font-mono">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">Course not found</h1>
          <Link to="/learn" className="text-primary hover:text-primary-hover font-mono">
            Return to Learn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow relative">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
          {/* Breadcrumb */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-primary font-mono text-xs mb-4 uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">home</span>
              {course.breadcrumb.map((crumb, index) => (
                <span key={index}>
                  <span>/</span>
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors ml-2">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-bold text-gray-900 dark:text-white ml-2">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
              <div>
                {/* Badges */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] font-mono text-terminal-green border border-terminal-green/30 bg-terminal-green/10 px-2 py-1 rounded tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse"></span>
                    {course.status}
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-300 border border-blue-500/30 dark:border-blue-500/20 bg-blue-100 dark:bg-blue-500/10 px-2 py-1 rounded tracking-wider">
                    {course.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-serif text-gray-900 dark:text-white mb-4 drop-shadow-lg">
                  {course.title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg font-light leading-relaxed">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6 font-mono text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest border-t border-gray-200 dark:border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>Est. {course.estimatedHours} Hours</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-white/10 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">library_books</span>
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-white/10 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">military_tech</span>
                    <span>{course.xpReward} XP Reward</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-white/10 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">group</span>
                    <span>{course.enrolled.toLocaleString()}k Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  aria-label="Share"
                  className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button
                  aria-label="Bookmark"
                  className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">bookmark_border</span>
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Module Overview */}
              <section className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                  Module Overview
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed space-y-4 font-light">
                  {course.overview.description.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.overview.learningOutcomes.map((outcome, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-white/5 rounded border border-gray-200 dark:border-white/5 flex gap-3 items-start"
                    >
                      <span className="material-symbols-outlined text-terminal-green mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1">{outcome.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-500">{outcome.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Syllabus */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-serif text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">segment</span>
                    System Syllabus
                  </h2>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-500">{course.version}</span>
                </div>

                <div className="space-y-6">
                  {course.syllabus.map((phase, phaseIndex) => {
                    const items = phase.items || phase.lessons || [];
                    return (
                      <div key={phaseIndex}>
                        <h3
                          className={`text-sm font-mono mb-3 uppercase tracking-wider pl-2 border-l-2 ${
                            items.some((item) => item.isCurrent)
                              ? 'text-primary border-primary'
                              : 'text-gray-600 dark:text-gray-500 border-gray-300 dark:border-gray-700'
                          }`}
                        >
                          {phase.phase}
                        </h3>
                      <div className="space-y-2">
                        {items.map((item) => {
                          const isLesson = item.itemType === 'lesson' || !item.itemType;
                          const isQuiz = item.itemType === 'quiz';
                          
                          return (
                            <div
                              key={`${item.itemType || 'lesson'}-${item.id}`}
                              onClick={() => {
                                if (!item.locked) {
                                  if (isLesson) {
                                    navigate(`/learn/${id}/lesson/${item.id}`);
                                  } else if (isQuiz) {
                                    navigate(`/learn/${id}/quiz/${item.id}`);
                                  }
                                }
                              }}
                              className={`group flex items-center p-4 rounded-lg transition-all ${
                                item.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                              } ${
                                item.isCurrent
                                  ? 'bg-gray-100 dark:bg-white/5 border border-primary/50 shadow-[0_0_15px_rgba(249,115,22,0.1)] relative'
                                  : item.locked
                                  ? 'bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/5 opacity-60'
                                  : 'bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                              }`}
                            >
                              {item.isCurrent && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                              )}
                              <div className="mr-4">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                    item.completed
                                      ? 'bg-terminal-green/20 text-terminal-green border-terminal-green/30'
                                      : item.locked
                                      ? 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-white/10'
                                      : item.isCurrent
                                      ? 'bg-primary text-white shadow-[0_0_10px_rgba(249,115,22,0.4)] animate-pulse'
                                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-white/10'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {isQuiz
                                      ? 'school'
                                      : item.completed
                                      ? 'check'
                                      : item.locked
                                      ? 'lock'
                                      : item.isCurrent
                                      ? 'play_arrow'
                                      : 'radio_button_unchecked'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                  <span
                                    className={`font-medium transition-colors ${
                                      item.isCurrent
                                        ? 'text-gray-900 dark:text-white font-bold'
                                        : item.locked
                                        ? 'text-gray-500 dark:text-gray-500'
                                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                      item.status === 'COMPLETED'
                                        ? 'text-terminal-green bg-terminal-green/10 border-terminal-green/20'
                                        : item.status === 'IN_PROGRESS'
                                        ? 'text-primary bg-primary/10 border-primary/20'
                                        : 'text-gray-600 dark:text-gray-600 bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/5'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-600 font-mono">
                                  <span>TYPE: {item.type}</span>
                                  <span>•</span>
                                  <span>{item.duration} MIN</span>
                                </div>
                              </div>
                              {item.isCurrent && (
                                <div className="ml-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isLesson) {
                                        navigate(`/learn/${id}/lesson/${item.id}`);
                                      } else if (isQuiz) {
                                        navigate(`/learn/${id}/quiz/${item.id}`);
                                      }
                                    }}
                                    className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1.5 rounded font-bold transition-colors"
                                  >
                                    RESUME
                                  </button>
                                </div>
                              )}
                              {!item.isCurrent && !item.locked && (
                                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-500">
                                    chevron_right
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>

              {/* Additional Sections */}
              <section className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                      folder_open
                    </span>
                    <h3 className="text-lg font-serif text-gray-900 dark:text-white">Project Files</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                    Access starter code, datasets, and diagrams for this module.
                  </p>
                  <span className="text-xs font-mono text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    DOWNLOAD_ASSETS(){' '}
                    <span className="material-symbols-outlined text-sm">download</span>
                  </span>
                </div>
                <div className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                      forum
                    </span>
                    <h3 className="text-lg font-serif text-gray-900 dark:text-white">Discussion Board</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
                    Join 400+ developers discussing optimization techniques.
                  </p>
                  <span className="text-xs font-mono text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    OPEN_THREAD(){' '}
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </span>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Progress Card */}
                <div className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                  <h3 className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                    Module Progress
                  </h3>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-mono font-bold text-gray-900 dark:text-white">{course.progress}%</span>
                    <span className="text-sm text-gray-600 dark:text-gray-500 mb-1">Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden border border-gray-300 dark:border-white/5 mb-6">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <button className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold font-mono rounded shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group-btn relative overflow-hidden">
                    <span className="relative z-10">Continue_Lesson()</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform relative z-10">
                      arrow_forward
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <div className="mt-4 text-center">
                    <span className="text-[10px] text-gray-600 dark:text-gray-500 font-mono">
                      NEXT: {course.nextLesson.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6">
                  <h3 className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                    Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center border ${
                            prereq.completed
                              ? 'bg-terminal-green/10 text-terminal-green border-terminal-green/20'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-white/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {prereq.completed ? 'check' : 'remove'}
                          </span>
                        </div>
                        <span
                          className={`text-sm ${
                            prereq.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-500'
                          }`}
                        >
                          {prereq.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div className="bg-white dark:bg-frontier-card border border-gray-200 dark:border-white/10 rounded-lg p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-900 border border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl">person</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-primary font-mono uppercase tracking-wider block mb-0.5">
                      Instructor
                    </span>
                    <h4 className="text-gray-900 dark:text-white font-serif text-lg leading-none">
                      {course.instructor.name}
                    </h4>
                    <span className="text-xs text-gray-600 dark:text-gray-500">{course.instructor.title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
