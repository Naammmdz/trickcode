import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import { fetchLessonById } from '../data/lessonData';

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      try {
        const data = await fetchLessonById(courseId, lessonId);
        setLesson(data);
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-primary font-mono">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">Lesson not found</h1>
          <Link to={`/learn/${courseId}`} className="text-primary hover:text-primary-hover font-mono">
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
              className="w-full h-full object-contain dark:filter dark:invert opacity-100"
              src={logo}
            />
          </Link>
          <span className="text-lg font-serif tracking-tight text-gray-900 dark:text-white font-medium hidden sm:block">
            TrickCode
          </span>
          <div className="h-6 w-px bg-gray-300 dark:bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-gray-600 dark:text-gray-500 hidden md:flex">
            {lesson.breadcrumb.map((crumb, index) => (
              <span key={index}>
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary font-bold">{crumb.label}</span>
                )}
                {index < lesson.breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 font-mono">
          <Link
            to="/learn"
            className="text-primary transition drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] hidden md:block"
          >
            // Learn
          </Link>
          <Link
            to="/news"
            className="hover:text-primary transition hidden md:block"
          >
            News
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

        {/* Left Sidebar - Syllabus */}
        <aside className="w-80 bg-gray-50 dark:bg-[#080808] border-r border-gray-200 dark:border-white/5 flex-col hidden lg:flex shrink-0 z-20">
          <div className="p-5 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-frontier-black/50 backdrop-blur-sm">
            <h2 className="text-sm font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">segment</span>
              Lesson Syllabus
            </h2>
            <div className="mt-2 w-full bg-gray-200 dark:bg-white/5 h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                style={{ width: `${lesson.syllabus.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-mono text-gray-600 dark:text-gray-500">
              <span>PROGRESS</span>
              <span>{lesson.syllabus.progress}%</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {lesson.syllabus.sections.map((section, sectionIndex) => {
              const items = section.items || section.lessons || [];
              return (
                <div key={sectionIndex}>
                  <h3
                    className={`text-[10px] font-mono uppercase tracking-widest mb-3 pl-2 ${
                      items.some((item) => item.isCurrent)
                        ? 'text-primary border-l-2 border-primary'
                        : 'text-gray-600 dark:text-gray-500'
                    }`}
                  >
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const isLesson = item.itemType === 'lesson' || !item.itemType;
                      const isQuiz = item.itemType === 'quiz';
                      
                      return (
                        <li key={`${item.itemType || 'lesson'}-${item.id}`}>
                          <button
                            onClick={() => {
                              if (isLesson) {
                                navigate(`/learn/${courseId}/lesson/${item.id}`);
                              } else if (isQuiz) {
                                navigate(`/learn/${courseId}/quiz/${item.id}`);
                              }
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded text-left group transition-all ${
                              item.isCurrent
                                ? 'bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 relative overflow-hidden'
                                : item.locked
                                ? 'opacity-60'
                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                          >
                            {item.isCurrent && (
                              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                            )}
                            <div className="relative w-4 h-4 flex items-center justify-center">
                              {isQuiz ? (
                                <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                                  school
                                </span>
                              ) : item.completed ? (
                                <span className="material-symbols-outlined text-sm text-terminal-green">
                                  check_circle
                                </span>
                              ) : item.isCurrent ? (
                                <>
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75"></div>
                                </>
                              ) : item.locked ? (
                                <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-600">
                                  lock
                                </span>
                              ) : (
                                <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-600">
                                  radio_button_unchecked
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`text-xs transition-colors ${
                                  item.isCurrent
                                    ? 'font-bold text-gray-900 dark:text-white'
                                    : item.locked
                                    ? 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.isCurrent && (
                                <span className="text-[9px] font-mono text-primary">
                                  {isQuiz ? 'CURRENT_QUIZ' : 'CURRENT_LESSON'}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded-xl border border-gray-300 dark:border-white/10 shadow-2xl relative overflow-hidden group mb-8">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                <div
                  className={`text-center transition-opacity cursor-pointer ${
                    videoPlaying ? 'opacity-0' : 'opacity-30 group-hover:opacity-40'
                  }`}
                  onClick={() => setVideoPlaying(!videoPlaying)}
                >
                  <span className="material-symbols-outlined text-6xl text-white">play_circle</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_12px_#3b82f6] rounded-full relative"
                    style={{ width: `${lesson.videoProgress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity transform scale-150"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-4">
                    <button
                      className="hover:text-primary transition"
                      onClick={() => setVideoPlaying(!videoPlaying)}
                    >
                      <span className="material-symbols-outlined">
                        {videoPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <button className="hover:text-primary transition">
                      <span className="material-symbols-outlined">volume_up</span>
                    </button>
                    <span className="text-xs font-mono text-gray-400">
                      {lesson.currentTime} / {lesson.videoDuration}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-primary transition">
                      <span className="material-symbols-outlined">closed_caption</span>
                    </button>
                    <button className="hover:text-primary transition">
                      <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button className="hover:text-primary transition">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <header className="mb-8 border-b border-gray-200 dark:border-white/5 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white mb-2">{lesson.title}</h1>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-600 dark:text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>{' '}
                      {lesson.readTime}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></span>
                    <span className="text-primary">{lesson.difficulty}</span>
                  </div>
                </div>
                <button className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 rounded font-mono text-xs border border-gray-300 dark:border-white/10 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">bookmark_add</span> SAVE
                </button>
              </div>
            </header>

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-light prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary">
              {lesson.content.introduction.map((para, index) => (
                <p key={index}>{para}</p>
              ))}

              {lesson.content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-gray-900 dark:text-white flex items-center gap-2 mt-8">
                    <span className="w-1 h-6 bg-primary block"></span>
                    {section.title}
                  </h3>
                  {section.content.map((para, pIndex) => (
                    <p key={pIndex}>{para}</p>
                  ))}

                  {section.code && (
                    <div className="not-prose mt-10 mb-10">
                      <div className="w-full bg-gray-900 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/10 rounded-sm relative group overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 dark:bg-[#111] border-b border-gray-700 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary"></div>
                            <span className="font-mono text-xs text-gray-300 dark:text-gray-400 tracking-wider">
                              {section.code.title}
                            </span>
                          </div>
                          <button className="text-xs font-mono text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-white flex items-center gap-1 transition-colors">
                            COPY{' '}
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                        <div className="p-6 overflow-x-auto relative bg-gray-900 dark:bg-[#0a0a0a]">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-transparent to-transparent"></div>
                          <pre className="font-mono text-sm leading-relaxed text-gray-100">
                            <code className="language-cpp">
                              {section.code.content.split('\n').map((line, lineIndex) => (
                                <span key={lineIndex}>
                                  {line.includes('//') ? (
                                    <>
                                      <span className="text-gray-400 dark:text-gray-600 italic">
                                        {line.substring(0, line.indexOf('//'))}
                                      </span>
                                      <span className="text-gray-400 dark:text-gray-600 italic">
                                        {line.substring(line.indexOf('//'))}
                                      </span>
                                    </>
                                  ) : (
                                    line
                                  )}
                                  {lineIndex < section.code.content.split('\n').length - 1 && '\n'}
                                </span>
                              ))}
                            </code>
                          </pre>
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-gray-600 dark:text-white/10 select-none">
                          READ_ONLY_MODE
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </article>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-4 sticky bottom-0 bg-gradient-to-t from-white dark:from-frontier-black via-white dark:via-frontier-black to-transparent pb-6 pt-12 -mx-6 px-6">
              {lesson.navigation.previous ? (
                <button
                  onClick={() =>
                    navigate(`/learn/${courseId}/lesson/${lesson.navigation.previous.id}`)
                  }
                  className="group flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-frontier-card hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all w-1/2 md:w-auto"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 uppercase">
                      Previous
                    </span>
                    <span className="font-serif text-sm text-gray-900 dark:text-white">{lesson.navigation.previous.title}</span>
                  </div>
                </button>
              ) : (
                <div></div>
              )}

              {lesson.navigation.next && (
                <button
                  onClick={() =>
                    navigate(`/learn/${courseId}/lesson/${lesson.navigation.next.id}`)
                  }
                  className="group flex items-center justify-end gap-3 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all w-1/2 md:w-auto"
                >
                  <div className="text-right">
                    <span className="block text-[10px] font-mono text-white/80 uppercase">
                      Next Lesson
                    </span>
                    <span className="font-serif text-sm">{lesson.navigation.next.title}</span>
                  </div>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              )}
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
