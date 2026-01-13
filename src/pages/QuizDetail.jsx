import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import { fetchQuizByLessonId, submitQuizAnswer } from '../data/quizData';

const QuizDetail = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        // For now, use quizId as lessonId to fetch quiz (will be updated when backend is ready)
        const data = await fetchQuizByLessonId(courseId, quizId);
        setQuiz(data);
        // Set initial selected answer if exists
        const currentQuestion = data.questions[data.currentQuestion - 1];
        const selected = currentQuestion.options.find((opt) => opt.isSelected);
        if (selected) {
          setSelectedAnswer(selected.id);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [courseId, quizId]);

  const handleAnswerSelect = (answerId) => {
    if (!submitted) {
      setSelectedAnswer(answerId);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    setSubmitting(true);
    try {
      const currentQuestion = quiz.questions[quiz.currentQuestion - 1];
      await submitQuizAnswer(quiz.id, currentQuestion.id, selectedAnswer);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (quiz.currentQuestion < quiz.totalQuestions) {
      const nextQuestion = quiz.currentQuestion + 1;
      setSelectedAnswer(null);
      setSubmitted(false);
      setQuiz({
        ...quiz,
        currentQuestion: nextQuestion,
        progress: (nextQuestion / quiz.totalQuestions) * 100
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (quiz.currentQuestion > 1) {
      const prevQuestion = quiz.currentQuestion - 1;
      setSelectedAnswer(null);
      setSubmitted(false);
      setQuiz({
        ...quiz,
        currentQuestion: prevQuestion,
        progress: (prevQuestion / quiz.totalQuestions) * 100
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-primary font-mono">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">Quiz not found</h1>
          <Link to={`/learn/${courseId}`} className="text-primary hover:text-primary-hover font-mono">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[quiz.currentQuestion - 1];
  const selectedOption = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="bg-gray-50 text-gray-900 dark:bg-frontier-black dark:text-gray-200 antialiased font-sans selection:bg-primary/40 selection:text-white flex flex-col h-screen overflow-hidden">
      {/* Compact Navbar */}
      <nav className="w-full py-3 px-6 md:px-8 flex justify-between items-center backdrop-blur-md bg-white/90 dark:bg-frontier-black/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-lg z-50 shrink-0 h-16">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="relative w-8 h-8 flex items-center justify-center"
          >
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
            {quiz.breadcrumb.map((crumb, index) => (
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
                {index < quiz.breadcrumb.length - 1 && <span>/</span>}
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

        {/* Left Sidebar - Syllabus (same as LessonDetail) */}
        <aside className="w-80 bg-gray-50 dark:bg-[#080808] border-r border-gray-200 dark:border-white/5 flex-col hidden lg:flex shrink-0 z-20">
          <div className="p-5 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-frontier-black/50 backdrop-blur-sm">
            <h2 className="text-sm font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">segment</span>
              Lesson Syllabus
            </h2>
            <div className="mt-2 w-full bg-gray-200 dark:bg-white/5 h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                style={{ width: '50%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-mono text-gray-600 dark:text-gray-500">
              <span>PROGRESS</span>
              <span>50%</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-[10px] font-mono text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-3 pl-2">
                1. Memory Fundamentals
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/1`)}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group"
                  >
                    <span className="material-symbols-outlined text-sm text-terminal-green">
                      check_circle
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Pointers & References
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/2`)}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group"
                  >
                    <span className="material-symbols-outlined text-sm text-terminal-green">
                      check_circle
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Heap vs Stack Memory
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3 pl-2 border-l-2 border-primary">
                2. Linked Lists
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/3`)}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group"
                  >
                    <span className="material-symbols-outlined text-sm text-terminal-green">
                      check_circle
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Introduction to Nodes
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/4`)}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group"
                  >
                    <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                      play_circle
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      Singly vs Doubly
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/quiz/${quizId}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-left relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Quiz: Linked Lists</span>
                      <span className="text-[9px] font-mono text-primary">CURRENT_QUIZ</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/learn/${courseId}/lesson/5`)}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group opacity-60"
                  >
                    <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-600">
                      radio_button_unchecked
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Insertion & Deletion
                    </span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-left group opacity-60">
                    <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-600">lock</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      Cycle Detection (Floyd's)
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth p-6 flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-8 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 rounded bg-primary/10 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-sm block">
                    school
                  </span>
                </span>
                <span className="text-primary font-mono text-xs tracking-widest uppercase font-bold">
                  {quiz.type}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">{quiz.title}</h1>
            </div>

            {/* Quiz Card */}
            <div className="flex-1 mb-8">
              <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-primary"></div>
                <div className="p-8 md:p-10">
                  {/* Question Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <h2 className="text-xl md:text-2xl font-serif text-gray-900 dark:text-white leading-relaxed max-w-2xl">
                      {currentQuestion.highlightedText ? (
                        <>
                          {currentQuestion.question.split(currentQuestion.highlightedText)[0]}
                          <span className="text-primary border-b border-primary/30">
                            {currentQuestion.highlightedText}
                          </span>
                          {currentQuestion.question.split(currentQuestion.highlightedText)[1]}
                        </>
                      ) : (
                        currentQuestion.question
                      )}
                    </h2>
                    <span className="px-3 py-1 rounded bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-[10px] font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      Q {String(quiz.currentQuestion).padStart(2, '0')} / {String(quiz.totalQuestions).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="grid gap-4">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const showCorrect = submitted && option.isCorrect;
                      const showIncorrect = submitted && isSelected && !option.isCorrect;

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          disabled={submitted}
                          className={`w-full text-left group p-4 md:p-5 rounded-lg border transition-all flex items-center gap-4 relative overflow-hidden ${
                            showCorrect
                              ? 'border-terminal-green bg-terminal-green/5 shadow-[0_0_20px_rgba(74,222,128,0.15)]'
                              : showIncorrect
                              ? 'border-red-500 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                              : isSelected
                              ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                              : 'border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:border-gray-400 dark:hover:border-white/20'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {isSelected && !submitted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-30"></div>
                          )}
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-mono text-sm shadow-sm relative z-10 ${
                              showCorrect
                                ? 'bg-terminal-green text-white font-bold'
                                : showIncorrect
                                ? 'bg-red-500 text-white font-bold'
                                : isSelected
                                ? 'bg-blue-500 text-white font-bold'
                                : 'bg-gray-200 dark:bg-black border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-500 group-hover:border-gray-400 dark:group-hover:border-white/30 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}
                          >
                            {option.id}
                          </div>
                          <span
                            className={`font-mono text-sm relative z-10 ${
                              showCorrect || (isSelected && !showIncorrect)
                                ? 'text-gray-900 dark:text-white font-medium'
                                : showIncorrect
                                ? 'text-red-600 dark:text-red-300'
                                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                            }`}
                          >
                            {option.text}
                          </span>
                          {showCorrect && (
                            <span className="ml-auto material-symbols-outlined text-terminal-green">
                              check_circle
                            </span>
                          )}
                          {showIncorrect && (
                            <span className="ml-auto material-symbols-outlined text-red-500">
                              cancel
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (shown after submission) */}
                  {submitted && (
                    <div
                      className={`mt-6 p-4 rounded-lg border ${
                        isCorrect
                          ? 'bg-terminal-green/10 border-terminal-green/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`material-symbols-outlined ${
                            isCorrect ? 'text-terminal-green' : 'text-red-500'
                          }`}
                        >
                          {isCorrect ? 'check_circle' : 'cancel'}
                        </span>
                        <div>
                          <p
                            className={`font-mono text-sm font-bold mb-1 ${
                              isCorrect ? 'text-terminal-green' : 'text-red-400'
                            }`}
                          >
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8 flex justify-end">
                    {!submitted ? (
                      <button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || submitting}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all font-mono text-sm font-bold tracking-wide flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Submit Answer'}
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        disabled={quiz.currentQuestion >= quiz.totalQuestions}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all font-mono text-sm font-bold tracking-wide flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {quiz.currentQuestion >= quiz.totalQuestions ? 'Quiz Complete' : 'Next Question'}
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              {quiz.navigation.previous ? (
                <button
                  onClick={() => {
                    if (quiz.navigation.previous.type === 'lesson') {
                      navigate(`/learn/${courseId}/lesson/${quiz.navigation.previous.id}`);
                    } else if (quiz.navigation.previous.type === 'quiz') {
                      navigate(`/learn/${courseId}/quiz/${quiz.navigation.previous.id}`);
                    }
                  }}
                  className="group flex items-center gap-3 px-6 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-frontier-card hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 uppercase">
                      Previous
                    </span>
                    <span className="font-serif text-sm text-gray-900 dark:text-white">{quiz.navigation.previous.title}</span>
                  </div>
                </button>
              ) : (
                <div></div>
              )}

              {quiz.navigation.next && (
                <button
                  onClick={() => {
                    if (quiz.currentQuestion < quiz.totalQuestions) {
                      handleNextQuestion();
                    } else {
                      if (quiz.navigation.next.type === 'lesson') {
                        navigate(`/learn/${courseId}/lesson/${quiz.navigation.next.id}`);
                      } else if (quiz.navigation.next.type === 'quiz') {
                        navigate(`/learn/${courseId}/quiz/${quiz.navigation.next.id}`);
                      }
                    }
                  }}
                  disabled={quiz.currentQuestion < quiz.totalQuestions && !submitted}
                  className="group flex items-center justify-end gap-3 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-right">
                    <span className="block text-[10px] font-mono text-white/80 uppercase">
                      {quiz.currentQuestion < quiz.totalQuestions ? 'Next Question' : 'Next'}
                    </span>
                    {quiz.currentQuestion >= quiz.totalQuestions && (
                      <span className="font-serif text-sm">{quiz.navigation.next.title}</span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              )}
            </div>

            <footer className="mt-8 text-center text-[10px] text-gray-600 dark:text-gray-700 font-mono uppercase tracking-widest">
              TrickCode System V.2.0 - All Rights Reserved
            </footer>
          </div>
        </main>

        {/* Right Sidebar - Tools (same as LessonDetail) */}
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

export default QuizDetail;
