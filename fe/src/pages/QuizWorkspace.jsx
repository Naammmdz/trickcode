import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';
import { courseService } from '../services/courseService';

const QuizWorkspace = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizData, setQuizData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const isReviewMode = location.state?.reviewMode || false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lessonData, courseData, curriculumData] = await Promise.all([
          courseService.getLesson(quizId),
          courseService.getCourse(courseId),
          courseService.getCourseCurriculum(courseId)
        ]);
        setLesson(lessonData);
        setCourse(courseData);
        setCurriculum(curriculumData);

        // Parse quiz config if available
        if (lessonData.quizConfig) {
          try {
            const parsedQuiz = JSON.parse(lessonData.quizConfig);
            setQuizData(parsedQuiz);
          } catch (e) {
            console.error('Failed to parse quiz config:', e);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, quizId]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    if (!quizData || !quizData.questions) return;

    const questions = quizData.questions;

    let correctCount = 0;
    const results = questions.map((q) => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { ...q, userAnswer: userAnswer !== undefined ? userAnswer : -1, isCorrect };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passingScore = quizData.passingScore || 60;
    const passed = score >= passingScore;

    // Mark as complete if score passes
    if (passed && !isReviewMode) {
      try {
        await courseService.completeLesson(quizId);
        console.log('Quiz completed successfully:', quizId);
      } catch (err) {
        console.error('Failed to mark quiz as completed', err);
      }
    }

    setQuizResult({ totalQuestions, correctCount, score, passingScore, passed, questions: results });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setQuizResult(null);
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
    const currentIndex = flattenedLessons.findIndex(l => l.id === Number(quizId));
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
                <Link to={`/admin/review/${courseId}`} state={{ reviewMode: true }} className="hover:text-neutral-900 dark:hover:text-white transition-colors">{course?.title || 'Review Course'}</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Quiz'}</span>
              </>
            ) : (
              <>
                <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <Link to={`/my-courses/${courseId}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">{course?.title || 'Course'}</Link>
                <span className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="text-neutral-900 dark:text-white font-semibold">{lesson?.title || 'Quiz'}</span>
              </>
            )}
          </div>

          {/* Quiz Content */}
          <div className="flex-1 overflow-y-auto scroll-smooth pb-20 mb-20">
            <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-10 pb-8">
              {/* Quiz Header */}
              <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white">Space Complexity Quiz</h1>
                  <div className="flex gap-2">
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <span className="material-symbols-outlined text-lg">bookmark</span>
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <span className="material-symbols-outlined text-lg">share</span>
                    </button>
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl font-light">
                  Test your understanding of space complexity in Dynamic Programming solutions. Answer all 5 questions to complete the quiz.
                </p>
              </div>

              {/* Quiz Questions */}
              {/* Result Banner */}
              {submitted && quizResult && (
                <div className={`mb-8 p-6 rounded-xl border ${quizResult.passed
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40'
                  }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${quizResult.passed ? 'bg-emerald-500' : 'bg-red-500'
                      }`}>
                      <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {quizResult.passed ? 'check_circle' : 'cancel'}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${quizResult.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                        {quizResult.passed ? 'Quiz Passed!' : 'Quiz Failed'}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Score: <span className="font-bold">{quizResult.score}%</span> ({quizResult.correctCount}/{quizResult.totalQuestions} correct) · Passing: {quizResult.passingScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/my-courses/${courseId}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      Back to Course
                    </Link>
                    {!quizResult.passed && (
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">refresh</span>
                        Retry Quiz
                      </button>
                    )}
                    {quizResult.passed && nextLesson && (
                      <Link
                        to={getLessonRoute(nextLesson)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        Next Lesson
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 md:p-8">
                  {!quizData ? (
                    <div className="text-center py-10 text-neutral-500">
                      No quiz configuration found.
                    </div>
                  ) : (
                    quizData.questions?.map((question, qIdx) => {
                      const resultQ = submitted && quizResult ? quizResult.questions.find(r => r.id === question.id) : null;
                      return (
                        <div key={question.id} className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800 last:border-0 last:mb-0 last:pb-0">
                          <div className="flex items-start gap-3 mb-4">
                            <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">{qIdx + 1}.</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-4">
                                <p className="text-base text-neutral-900 dark:text-white">{question.question}</p>
                                {resultQ && (
                                  <span className={`material-symbols-outlined text-lg ${resultQ.isCorrect ? 'text-emerald-500' : 'text-red-500'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {resultQ.isCorrect ? 'check_circle' : 'cancel'}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-3">
                                {question.options.map((option, oIdx) => {
                                  let borderClass = 'border-neutral-200 dark:border-neutral-700';
                                  let bgClass = '';
                                  if (submitted && resultQ) {
                                    if (oIdx === question.correctAnswer) {
                                      borderClass = 'border-emerald-400 dark:border-emerald-600';
                                      bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
                                    } else if (oIdx === selectedAnswers[question.id] && !resultQ.isCorrect) {
                                      borderClass = 'border-red-400 dark:border-red-600';
                                      bgClass = 'bg-red-50 dark:bg-red-900/20';
                                    }
                                  } else if (selectedAnswers[question.id] === oIdx) {
                                    borderClass = 'border-orange-400 dark:border-orange-500';
                                    bgClass = 'bg-orange-50 dark:bg-orange-900/10';
                                  }
                                  return (
                                    <label
                                      key={oIdx}
                                      onClick={() => !submitted && handleAnswerSelect(question.id, oIdx)}
                                      className={`flex items-start gap-3 p-3 border rounded transition-colors ${borderClass} ${bgClass} ${submitted ? 'cursor-default' : 'cursor-pointer hover:border-orange-300 dark:hover:border-orange-500/40'}`}
                                    >
                                      <input
                                        type="radio"
                                        name={String(question.id)}
                                        checked={selectedAnswers[question.id] === oIdx}
                                        onChange={() => !submitted && handleAnswerSelect(question.id, oIdx)}
                                        disabled={submitted}
                                        className="mt-1"
                                      />
                                      <span className={`text-sm ${submitted && oIdx === question.correctAnswer
                                          ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                                          : submitted && oIdx === selectedAnswers[question.id] && !resultQ?.isCorrect
                                            ? 'text-red-600 dark:text-red-400 line-through'
                                            : selectedAnswers[question.id] === oIdx
                                              ? 'text-neutral-900 dark:text-white font-medium'
                                              : 'text-neutral-600 dark:text-neutral-400'
                                        }`}>{option}</span>
                                      {submitted && oIdx === question.correctAnswer && (
                                        <span className="ml-auto text-[10px] uppercase tracking-widest font-bold text-emerald-500">Correct</span>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Submit / Reset Buttons */}
                  {!submitted && (
                    <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-sm font-sans uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!quizData || !quizData.questions || Object.keys(selectedAnswers).length < quizData.questions.length}
                        className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answers
                      </button>
                    </div>
                  )}
                </div>
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

export default QuizWorkspace;
