import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';
import { courseService } from '../services/courseService';
import { codeExecutionService } from '../services/codeExecutionService';
import AiAssistantPanel from '../components/ai/AiAssistantPanel';
import { proSubscriptionService } from '../services/proService';

const CodeWorkspace = () => {
  const { courseId, codeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeData, setCodeData] = useState(null);
  const isReviewMode = location.state?.reviewMode || false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lessonData, courseData, curriculumData] = await Promise.all([
          courseService.getLesson(codeId),
          courseService.getCourse(courseId),
          courseService.getCourseCurriculum(courseId)
        ]);
        setLesson(lessonData);
        setCourse(courseData);
        setCurriculum(curriculumData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, codeId]);

  // Parse challenge config
  useEffect(() => {
    if (lesson?.codeChallengeConfig) {
      try {
        const config = JSON.parse(lesson.codeChallengeConfig);
        setCodeData(config);

        // Set initial code based on default language
        if (config.initialCode) {
          setCode(config.initialCode[language] || '');
        }
      } catch (e) {
        console.error('Failed to parse challenge config:', e);
      }
    }
  }, [lesson]);

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const editorRef = useRef(null);

  // AI Assistant states
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedFailedTest, setSelectedFailedTest] = useState(null);

  // Check Pro subscription status
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    proSubscriptionService.getStatus()
      .then(data => setIsPro(data.isStudentPro || false))
      .catch(() => setIsPro(false));
  }, []);

  // Resize states
  const [problemWidth, setProblemWidth] = useState(33.33); // 1/3 of width
  const [testResultsHeight, setTestResultsHeight] = useState(256); // h-64 = 256px
  const [isResizing, setIsResizing] = useState(null);
  const resizeRef = useRef(null);

  // Sync editor theme with app theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setEditorTheme(isDark ? 'vs-dark' : 'light');

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? 'vs-dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const container = resizeRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      if (isResizing === 'vertical') {
        // Resize problem width (vertical divider)
        const newWidthPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const minWidth = 15; // 15% minimum
        const maxWidth = 50; // 50% maximum
        setProblemWidth(Math.max(minWidth, Math.min(maxWidth, newWidthPercent)));
      } else if (isResizing === 'horizontal') {
        // Resize test results height (horizontal divider)
        const newHeight = containerRect.height - (e.clientY - containerRect.top);
        const minHeight = 150;
        const maxHeight = containerRect.height * 0.7;
        setTestResultsHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults(null);

    try {
      const data = await codeExecutionService.runCode(code, language, '', Number(codeId));

      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else if (data.compile_output) {
        setOutput(data.compile_output);
      } else if (data.stderr) {
        setOutput(data.stderr);
      } else if (data.stdout != null) {
        setOutput(data.stdout || '\n');
      } else if (data.message) {
        setOutput(data.message);
      } else {
        setOutput('Execution finished with no output.');
      }
    } catch (err) {
      setOutput(`Error: ${err.message || 'Code execution failed'}`);
    }

    setIsRunning(false);
  };

  const handleSubmit = async () => {
    if (!codeData || !codeData.testCases) return;

    setIsRunning(true);
    setOutput('');
    setTestResults(null);

    try {
      const result = await codeExecutionService.submitCode(
        Number(codeId),
        code,
        language
      );

      setTestResults({
        passed: result.testsPassed,
        total: result.testsTotal,
        tests: result.testCaseResults || [],
        submissionId: result.submissionId,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
      });

      if (result.testsPassed === result.testsTotal) {
        setOutput(`✓ All ${result.testsTotal} test cases passed! (${result.executionTime}s, ${result.memoryUsed}KB)`);
        // Mark lesson as complete when all tests pass
        if (!isReviewMode) {
          try {
            await courseService.completeLesson(codeId);
          } catch (e) {
            console.error('Failed to mark code lesson as completed:', e);
          }
        }
      } else {
        setOutput(`✗ ${result.testsTotal - result.testsPassed} of ${result.testsTotal} test cases failed.`);
      }
    } catch (err) {
      setOutput(`Error: ${err.message || 'Submission failed'}`);
    }

    setIsRunning(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (codeData?.initialCode) {
      setCode(codeData.initialCode[newLanguage] || '');
    }
    setOutput('');
    setTestResults(null);
  };

  const handleReset = () => {
    if (codeData?.initialCode) {
      setCode(codeData.initialCode[language] || '');
    }
    setOutput('');
    setTestResults(null);
  };

  const getLanguageDisplayName = (lang) => {
    const names = {
      python: 'Python 3.11',
      javascript: 'JavaScript (ES6)',
      java: 'Java 17'
    };
    return names[lang] || lang;
  };

  const getLanguageFileName = (lang) => {
    const funcName = codeData?.functionName || 'solution';
    const extensions = { python: '.py', javascript: '.js', java: '.java' };
    const ext = extensions[lang] || '';
    if (lang === 'java') return 'Solution.java';
    return funcName + ext;
  };

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
    const currentIndex = flattenedLessons.findIndex(l => l.id === Number(codeId));
    if (currentIndex > 0) prevLesson = flattenedLessons[currentIndex - 1];
    if (currentIndex !== -1 && currentIndex < flattenedLessons.length - 1) nextLesson = flattenedLessons[currentIndex + 1];
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
          <span className="text-sm text-neutral-500 font-mono">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          <h2 className="text-lg font-serif">Failed to load workspace</h2>
          <p className="text-sm text-neutral-500">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-sans uppercase tracking-widest rounded">
            Retry
          </button>
        </div>
      </div>
    );
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
          {/* Breadcrumb + Nav */}
          <div className="h-12 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-neutral-950 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-neutral-500 overflow-x-auto whitespace-nowrap">
              {isReviewMode ? (
                <>
                  <Link to="/admin" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Admin Dashboard</Link>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <Link to={`/admin/review/${courseId}`} state={{ reviewMode: true }} className="hover:text-neutral-900 dark:hover:text-white transition-colors">{course?.title || 'Review Course'}</Link>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Coding Challenge'}</span>
                </>
              ) : (
                <>
                  <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <Link to={`/my-courses/${courseId}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">{course?.title || 'Course'}</Link>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Coding Challenge'}</span>
                </>
              )}
            </div>
            {/* Prev / Next */}
            <div className="flex items-center gap-1 shrink-0 ml-4">
              {prevLesson ? (
                <Link
                  to={getLessonRoute(prevLesson)}
                  state={isReviewMode ? { reviewMode: true } : undefined}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
                  title={`Previous: ${prevLesson.title}`}
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                  <span className="text-[10px] uppercase tracking-widest font-medium hidden lg:block">Prev</span>
                </Link>
              ) : (
                <span className="w-8" />
              )}
              {nextLesson ? (
                <Link
                  to={getLessonRoute(nextLesson)}
                  state={isReviewMode ? { reviewMode: true } : undefined}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
                  title={`Next: ${nextLesson.title}`}
                >
                  <span className="text-[10px] uppercase tracking-widest font-medium hidden lg:block">Next</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
              ) : (
                <span className="w-8" />
              )}
            </div>
          </div>

          {/* Main Content: Problem Left, Code Right */}
          <div className="flex-1 overflow-hidden flex" ref={resizeRef}>
            <div className="flex-1 flex gap-0">
              {/* Left: Problem Description */}
              <div
                className="flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                style={{ width: `${problemWidth}%`, minWidth: '200px', maxWidth: '50%' }}
              >
                <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center px-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-neutral-500 text-sm">description</span>
                    <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">Problem</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  <h2 className="text-lg font-serif font-medium text-neutral-900 dark:text-white mb-4">{lesson?.title}</h2>
                  {codeData?.problemDescription ? (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                      {codeData.problemDescription.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <br key={i} />;
                        // Bold markers **text**
                        const parts = trimmed.split(/(\*\*.*?\*\*)/).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-neutral-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        });
                        // Lines starting with - as list items
                        if (trimmed.startsWith('- ')) {
                          return <div key={i} className="pl-4 flex gap-2"><span className="text-orange-400">•</span><span>{parts}</span></div>;
                        }
                        return <p key={i}>{parts}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="text-neutral-500 italic text-sm">No problem description available.</div>
                  )}

                  {/* Example Test Cases */}
                  {codeData?.testCases && codeData.testCases.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xs font-sans uppercase tracking-widest text-neutral-400 mb-3">Examples</h3>
                      <div className="space-y-2">
                        {codeData.testCases.slice(0, 3).map((tc, idx) => (
                          <div key={idx} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-xs font-mono">
                            <div className="text-neutral-500 mb-1">Input:</div>
                            <div className="text-neutral-800 dark:text-neutral-200 mb-2 pl-2">{tc.input}</div>
                            <div className="text-neutral-500 mb-1">Output:</div>
                            <div className="text-emerald-600 dark:text-emerald-400 pl-2">{tc.expected}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resize Handle - Vertical */}
              <div
                onMouseDown={() => setIsResizing('vertical')}
                className="w-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-orange-200 dark:hover:bg-orange-900/40 cursor-col-resize transition-colors group relative flex-shrink-0 flex items-center justify-center"
              >
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                </div>
              </div>

              {/* Right: Code Editor & Test Results */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-neutral-200 dark:border-neutral-800">
                  {/* Editor Header */}
                  <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-neutral-500 text-sm">code</span>
                      <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">Editor</span>
                      <span className="text-xs font-mono text-neutral-400">{getLanguageFileName(language)}</span>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="ml-3 px-2 py-1 text-xs font-sans bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none pr-6"
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                        </select>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                          <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReset}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title="Reset Code"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-black relative">
                    {/* Overlay to prevent Monaco from capturing mouse during resize */}
                    {isResizing && (
                      <div className="absolute inset-0 z-10 cursor-row-resize" />
                    )}
                    <Editor
                      height="100%"
                      language={language}
                      theme={editorTheme}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      onMount={handleEditorDidMount}
                      options={{
                        fontSize: 14,
                        lineHeight: 22,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: language === 'python' ? 4 : 2,
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: 'Monaco, "Courier New", monospace',
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        acceptSuggestionOnCommitCharacter: true,
                        acceptSuggestionOnEnter: 'on',
                        tabCompletion: 'on',
                        wordBasedSuggestions: 'allDocuments',
                      }}
                    />
                  </div>

                  {/* Editor Footer */}
                  <div className="h-11 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                      <span>{getLanguageDisplayName(language)}</span>
                      <span className="w-px h-3.5 bg-neutral-300 dark:bg-neutral-700"></span>
                      <span>{code.split('\n').length} lines</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors rounded-md border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        Run
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                      >
                        <span className="material-symbols-outlined text-[15px]">upload</span>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resize Handle - Horizontal */}
                <div
                  onMouseDown={() => setIsResizing('horizontal')}
                  className="h-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-orange-200 dark:hover:bg-orange-900/40 cursor-row-resize transition-colors group relative flex-shrink-0 flex items-center justify-center"
                >
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                    <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                  </div>
                </div>

                {/* Test Results - Bottom Section */}
                <div
                  className="flex flex-col border-t border-neutral-200 dark:border-neutral-800"
                  style={{ height: `${testResultsHeight}px`, minHeight: '150px', maxHeight: '70%' }}
                >
                  {/* Output Header */}
                  <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-neutral-500 text-sm">terminal</span>
                      <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">Output & Test Results</span>
                    </div>
                    <button
                      onClick={() => {
                        setOutput('');
                        setTestResults(null);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      title="Clear"
                    >
                      <span className="material-symbols-outlined text-sm">clear</span>
                    </button>
                  </div>

                  {/* Output & Test Results Content */}
                  <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-black">
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-neutral-500">
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        <span className="text-sm font-mono">Running...</span>
                      </div>
                    ) : output ? (
                      <div className="mb-4">
                        <div className="text-xs font-sans uppercase tracking-widest text-neutral-500 mb-2">Output:</div>
                        <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap bg-white dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-800">{output}</pre>
                      </div>
                    ) : !testResults && (
                      <div className="text-sm text-neutral-400 italic">No output yet. Click "Run" to execute your code.</div>
                    )}

                    {/* Test Results */}
                    {testResults && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`material-symbols-outlined text-sm ${testResults.passed === testResults.total
                            ? 'text-green-500'
                            : 'text-yellow-500'
                            }`}>
                            {testResults.passed === testResults.total ? 'check_circle' : 'warning'}
                          </span>
                          <span className="text-xs font-sans uppercase tracking-widest text-neutral-500">
                            Test Results: {testResults.passed}/{testResults.total} Passed
                          </span>
                          {testResults.executionTime != null && (
                            <span className="text-[10px] font-mono text-neutral-400 ml-auto flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">timer</span>
                                {testResults.executionTime}s
                              </span>
                              {testResults.memoryUsed != null && (
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">memory</span>
                                  {testResults.memoryUsed}KB
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {testResults.tests.map((test, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border text-xs ${test.passed
                                ? 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10'
                                : 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'
                                } ${selectedFailedTest?.input === test.input && !test.passed ? 'ring-2 ring-primary/50' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <span className={`material-symbols-outlined text-sm shrink-0 ${test.passed ? 'text-green-500' : 'text-red-500'
                                  }`}>
                                  {test.passed ? 'check_circle' : 'cancel'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-mono text-neutral-900 dark:text-white mb-1 break-all">
                                    {test.input}
                                  </div>
                                  <div className="text-neutral-600 dark:text-neutral-400 space-y-0.5">
                                    <div>Expected: <span className="font-mono text-green-600 dark:text-green-400">{test.expected}</span></div>
                                    {!test.passed && (
                                      <div>Got: <span className="font-mono text-red-600 dark:text-red-400">{test.actual}</span></div>
                                    )}
                                  </div>
                                  {/* Ask AI button for failed tests */}
                                  {!test.passed && (
                                    <button
                                      onClick={() => {
                                        setSelectedFailedTest({ input: test.input, expected: test.expected, actual: test.actual });
                                        setAiPanelOpen(true);
                                      }}
                                      className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-widest font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 rounded transition-all"
                                    >
                                      <span className="material-symbols-outlined text-xs">smart_toy</span>
                                      Ask AI
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </main>
      </div>

      {/* AI Assistant Button */}
      <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className="fixed bottom-6 right-8 z-50 group">
        <div className={`absolute inset-0 rounded-full blur-xl transition-colors animate-pulse duration-1000 ${aiPanelOpen ? 'bg-primary/60' : 'bg-primary/40 group-hover:bg-primary/60'}`}></div>
        <div className="relative bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 h-14 w-14 rounded-full flex items-center justify-center shadow-2xl border border-white/10 dark:border-neutral-200 overflow-hidden hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-2xl">{aiPanelOpen ? 'close' : 'smart_toy'}</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent"></div>
          {isPro && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-neutral-900"></span>}
        </div>
        {!aiPanelOpen && (
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 rounded-lg text-[10px] font-sans uppercase tracking-widest shadow-xl border border-neutral-100 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
            AI Assistant {!isPro && '🔒'}
            <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white dark:bg-neutral-800 rotate-45 border-t border-r border-neutral-100 dark:border-neutral-700"></span>
          </span>
        )}
      </button>

      {/* AI Assistant Panel */}
      <AiAssistantPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        isPro={isPro}
        mode="code"
        context={{
          sourceCode: code,
          language,
          problemDescription: codeData?.problemDescription,
          failedTest: selectedFailedTest,
        }}
      />
    </div>
  );
};

export default CodeWorkspace;
