import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';
import AiAssistantPanel from '../components/ai/AiAssistantPanel';
import { proSubscriptionService } from '../services/proService';

const QuizResult = () => {
  const { courseId, quizId } = useParams();
  const location = useLocation();

  // AI Panel state
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    proSubscriptionService.getStatus()
      .then(data => setIsPro(data.isStudentPro || false))
      .catch(() => setIsPro(false));
  }, []);
  
  // Mock data - trong thực tế sẽ lấy từ location.state hoặc API
  const quizResults = location.state?.results || {
    totalQuestions: 5,
    correctAnswers: 4,
    score: 80,
    questions: [
      {
        id: 'q1',
        question: 'What is the space complexity of the memoized Fibonacci solution?',
        userAnswer: 1,
        correctAnswer: 1,
        options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n log n)'],
        isCorrect: true,
        explanation: 'Memoization stores at most n values in the hash map, so space complexity is O(n).'
      },
      {
        id: 'q2',
        question: 'Which approach uses more stack space?',
        userAnswer: 0,
        correctAnswer: 0,
        options: ['Top-Down (Memoization)', 'Bottom-Up (Tabulation)', 'Both use the same amount', 'Neither uses stack space'],
        isCorrect: true,
        explanation: 'Top-down memoization uses recursion, which requires stack space for the call stack.'
      },
      {
        id: 'q3',
        question: 'What is the space complexity of bottom-up tabulation for Fibonacci?',
        userAnswer: 1,
        correctAnswer: 1,
        options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n²)'],
        isCorrect: true,
        explanation: 'Tabulation uses an array of size n to store intermediate results.'
      },
      {
        id: 'q4',
        question: 'Can we optimize the space complexity of Fibonacci tabulation further?',
        userAnswer: 0,
        correctAnswer: 0,
        options: ['Yes, to O(1) using only two variables', 'No, we need O(n) space', 'Yes, to O(log n)', 'No, space complexity cannot be optimized'],
        isCorrect: true,
        explanation: 'We only need the last two values to compute the next Fibonacci number, so we can use just two variables.'
      },
      {
        id: 'q5',
        question: 'What is the main trade-off between memoization and tabulation?',
        userAnswer: 0,
        correctAnswer: 0,
        options: ['Memoization uses more stack space, tabulation uses more heap space', 'Tabulation is always faster', 'Memoization is easier to implement', 'There is no trade-off'],
        isCorrect: true,
        explanation: 'Memoization uses recursion (stack space) while tabulation uses an array (heap space).'
      }
    ]
  };

  const { totalQuestions, correctAnswers, score, questions } = quizResults;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-hidden selection:bg-primary selection:text-white h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 h-16 shrink-0">
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
            <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to={`/my-courses/${courseId}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Dynamic Programming Patterns</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to={`/my-courses/${courseId}/quiz/${quizId}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">Space Complexity Quiz</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Results</span>
          </div>

          {/* Result Content */}
          <div className="flex-1 overflow-y-auto scroll-smooth pb-20">
            <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-10 pb-8">
              {/* Result Header */}
              <div className="text-center mb-12">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl font-serif font-bold ${
                  score >= 80 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : score >= 60
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                  {score}%
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-medium text-neutral-900 dark:text-white mb-4">
                  {score >= 80 ? 'Excellent Work!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  You answered {correctAnswers} out of {totalQuestions} questions correctly
                </p>
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">{correctAnswers}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-sans">Correct</div>
                  </div>
                  <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">{totalQuestions - correctAnswers}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-sans">Incorrect</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  to={`/my-courses/${courseId}/quiz/${quizId}`}
                  className="px-8 py-3 border border-neutral-200 dark:border-neutral-700 text-sm font-sans uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded text-center"
                >
                  Retake Quiz
                </Link>
                <Link 
                  to={`/my-courses/${courseId}`}
                  className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity rounded text-center"
                >
                  Continue Learning
                </Link>
              </div>

              {/* Detailed Results */}
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-medium text-neutral-900 dark:text-white mb-6">Review Your Answers</h2>
                
                {questions.map((q, index) => (
                  <div 
                    key={q.id}
                    className={`border rounded-lg p-6 ${
                      q.isCorrect 
                        ? 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10' 
                        : 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-bold shrink-0 ${
                        q.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium text-neutral-900 dark:text-white mb-4">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, optIdx) => {
                            const isUserAnswer = optIdx === q.userAnswer;
                            const isCorrectAnswer = optIdx === q.correctAnswer;
                            
                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded border ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-100 dark:bg-green-900/20'
                                    : isUserAnswer && !q.isCorrect
                                    ? 'border-red-500 bg-red-100 dark:bg-red-900/20'
                                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`material-symbols-outlined text-lg ${
                                    isCorrectAnswer
                                      ? 'text-green-600 dark:text-green-400'
                                      : isUserAnswer && !q.isCorrect
                                      ? 'text-red-600 dark:text-red-400'
                                      : 'text-neutral-400'
                                  }`}>
                                    {isCorrectAnswer 
                                      ? 'check_circle' 
                                      : isUserAnswer && !q.isCorrect
                                      ? 'cancel'
                                      : 'radio_button_unchecked'}
                                  </span>
                                  <span className={`text-sm ${
                                    isCorrectAnswer || (isUserAnswer && !q.isCorrect)
                                      ? 'text-neutral-900 dark:text-white font-medium'
                                      : 'text-neutral-600 dark:text-neutral-400'
                                  }`}>
                                    {option}
                                  </span>
                                  {isCorrectAnswer && (
                                    <span className="ml-auto text-xs font-sans uppercase tracking-widest text-green-600 dark:text-green-400">
                                      Correct Answer
                                    </span>
                                  )}
                                  {isUserAnswer && !q.isCorrect && (
                                    <span className="ml-auto text-xs font-sans uppercase tracking-widest text-red-600 dark:text-red-400">
                                      Your Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {q.explanation && (
                          <div className={`mt-4 p-4 rounded border-l-4 ${
                            q.isCorrect
                              ? 'bg-green-50 dark:bg-green-900/10 border-green-500'
                              : 'bg-red-50 dark:bg-red-900/10 border-red-500'
                          }`}>
                            <div className="flex items-start gap-2">
                              <span className={`material-symbols-outlined text-lg ${
                                q.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {q.isCorrect ? 'lightbulb' : 'info'}
                              </span>
                              <p className={`text-sm ${
                                q.isCorrect ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                              }`}>
                                <strong>{q.isCorrect ? 'Explanation:' : 'Why this is incorrect:'}</strong> {q.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                        {/* Ask AI Button */}
                        <button
                          onClick={() => {
                            setSelectedQuestion({
                              quizQuestion: q.question,
                              studentAnswer: q.options[q.userAnswer],
                              correctAnswer: q.options[q.correctAnswer],
                            });
                            setAiPanelOpen(true);
                          }}
                          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-primary border border-neutral-200 dark:border-neutral-700 hover:border-primary/50 rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">smart_toy</span>
                          Ask AI {!isPro && '🔒'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 p-4 md:px-8 flex items-center justify-between z-20 h-20">
            <Link to={`/my-courses/${courseId}/quiz/${quizId}`} className="flex items-center gap-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group text-left">
              <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center group-hover:border-neutral-900 dark:group-hover:border-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Back to Quiz</span>
                <span className="block text-xs font-medium truncate max-w-[150px]">Space Complexity Quiz</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button className="hidden lg:hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 rounded">
                <span className="material-symbols-outlined text-lg">list</span> View Syllabus
              </button>
            </div>
            <Link to={`/my-courses/${courseId}/code/4`} className="flex items-center gap-4 text-neutral-900 dark:text-white group text-right">
              <div className="hidden sm:block">
                <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Next Lesson</span>
                <span className="block text-xs font-medium truncate max-w-[150px]">Climbing Stairs</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>
          </div>
        </main>
      </div>

      {/* AI Assistant Panel */}
      <AiAssistantPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        isPro={isPro}
        mode="quiz"
        context={selectedQuestion || {}}
      />
    </div>
  );
};

export default QuizResult;
