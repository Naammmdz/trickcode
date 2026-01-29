import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';

const QuizWorkspace = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = () => {
    // Calculate results
    const questions = [
      { id: 'q1', correctAnswer: 1 },
      { id: 'q2', correctAnswer: 0 },
      { id: 'q3', correctAnswer: 1 },
      { id: 'q4', correctAnswer: 0 },
      { id: 'q5', correctAnswer: 0 }
    ];

    const questionData = [
      {
        id: 'q1',
        question: 'What is the space complexity of the memoized Fibonacci solution?',
        options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'Memoization stores at most n values in the hash map, so space complexity is O(n).'
      },
      {
        id: 'q2',
        question: 'Which approach uses more stack space?',
        options: ['Top-Down (Memoization)', 'Bottom-Up (Tabulation)', 'Both use the same amount', 'Neither uses stack space'],
        correctAnswer: 0,
        explanation: 'Top-down memoization uses recursion, which requires stack space for the call stack.'
      },
      {
        id: 'q3',
        question: 'What is the space complexity of bottom-up tabulation for Fibonacci?',
        options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'Tabulation uses an array of size n to store intermediate results.'
      },
      {
        id: 'q4',
        question: 'Can we optimize the space complexity of Fibonacci tabulation further?',
        options: ['Yes, to O(1) using only two variables', 'No, we need O(n) space', 'Yes, to O(log n)', 'No, space complexity cannot be optimized'],
        correctAnswer: 0,
        explanation: 'We only need the last two values to compute the next Fibonacci number, so we can use just two variables.'
      },
      {
        id: 'q5',
        question: 'What is the main trade-off between memoization and tabulation?',
        options: ['Memoization uses more stack space, tabulation uses more heap space', 'Tabulation is always faster', 'Memoization is easier to implement', 'There is no trade-off'],
        correctAnswer: 0,
        explanation: 'Memoization uses recursion (stack space) while tabulation uses an array (heap space).'
      }
    ];

    let correctAnswers = 0;
    const results = questions.map((q, idx) => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        ...questionData[idx],
        userAnswer: userAnswer !== undefined ? userAnswer : -1,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Navigate to result page with data
    navigate(`/my-courses/${courseId}/quiz/${quizId}/result`, {
      state: {
        results: {
          totalQuestions,
          correctAnswers,
          score,
          questions: results
        }
      }
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

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
            <span className="text-neutral-900 dark:text-white font-semibold">Space Complexity Quiz</span>
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
              <div className="space-y-8">
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 md:p-8">
                  {/* Question 1 */}
                  <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">1.</span>
                      <div className="flex-1">
                        <p className="text-base text-neutral-900 dark:text-white mb-4">What is the space complexity of the memoized Fibonacci solution?</p>
                        <div className="space-y-3">
                          {['O(1)', 'O(n)', 'O(2^n)', 'O(n log n)'].map((option, idx) => (
                            <label 
                              key={idx}
                              onClick={() => handleAnswerSelect('q1', idx)}
                              className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                                selectedAnswers['q1'] === idx
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="q1" 
                                checked={selectedAnswers['q1'] === idx}
                                onChange={() => handleAnswerSelect('q1', idx)}
                                className="mt-1"
                              />
                              <span className={`text-sm ${
                                selectedAnswers['q1'] === idx
                                  ? 'text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">2.</span>
                      <div className="flex-1">
                        <p className="text-base text-neutral-900 dark:text-white mb-4">Which approach uses more stack space?</p>
                        <div className="space-y-3">
                          {['Top-Down (Memoization)', 'Bottom-Up (Tabulation)', 'Both use the same amount', 'Neither uses stack space'].map((option, idx) => (
                            <label 
                              key={idx}
                              onClick={() => handleAnswerSelect('q2', idx)}
                              className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                                selectedAnswers['q2'] === idx
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="q2" 
                                checked={selectedAnswers['q2'] === idx}
                                onChange={() => handleAnswerSelect('q2', idx)}
                                className="mt-1"
                              />
                              <span className={`text-sm ${
                                selectedAnswers['q2'] === idx
                                  ? 'text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question 3 */}
                  <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">3.</span>
                      <div className="flex-1">
                        <p className="text-base text-neutral-900 dark:text-white mb-4">What is the space complexity of bottom-up tabulation for Fibonacci?</p>
                        <div className="space-y-3">
                          {['O(1)', 'O(n)', 'O(2^n)', 'O(n²)'].map((option, idx) => (
                            <label 
                              key={idx}
                              onClick={() => handleAnswerSelect('q3', idx)}
                              className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                                selectedAnswers['q3'] === idx
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="q3" 
                                checked={selectedAnswers['q3'] === idx}
                                onChange={() => handleAnswerSelect('q3', idx)}
                                className="mt-1"
                              />
                              <span className={`text-sm ${
                                selectedAnswers['q3'] === idx
                                  ? 'text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">4.</span>
                      <div className="flex-1">
                        <p className="text-base text-neutral-900 dark:text-white mb-4">Can we optimize the space complexity of Fibonacci tabulation further?</p>
                        <div className="space-y-3">
                          {['Yes, to O(1) using only two variables', 'No, we need O(n) space', 'Yes, to O(log n)', 'No, space complexity cannot be optimized'].map((option, idx) => (
                            <label 
                              key={idx}
                              onClick={() => handleAnswerSelect('q4', idx)}
                              className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                                selectedAnswers['q4'] === idx
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="q4" 
                                checked={selectedAnswers['q4'] === idx}
                                onChange={() => handleAnswerSelect('q4', idx)}
                                className="mt-1"
                              />
                              <span className={`text-sm ${
                                selectedAnswers['q4'] === idx
                                  ? 'text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question 5 */}
                  <div className="mb-8">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-sm font-serif font-medium text-neutral-900 dark:text-white">5.</span>
                      <div className="flex-1">
                        <p className="text-base text-neutral-900 dark:text-white mb-4">What is the main trade-off between memoization and tabulation?</p>
                        <div className="space-y-3">
                          {['Memoization uses more stack space, tabulation uses more heap space', 'Tabulation is always faster', 'Memoization is easier to implement', 'There is no trade-off'].map((option, idx) => (
                            <label 
                              key={idx}
                              onClick={() => handleAnswerSelect('q5', idx)}
                              className={`flex items-start gap-3 p-3 border rounded cursor-pointer transition-colors ${
                                selectedAnswers['q5'] === idx
                                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name="q5" 
                                checked={selectedAnswers['q5'] === idx}
                                onChange={() => handleAnswerSelect('q5', idx)}
                                className="mt-1"
                              />
                              <span className={`text-sm ${
                                selectedAnswers['q5'] === idx
                                  ? 'text-neutral-900 dark:text-white font-medium'
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                    <button 
                      onClick={handleReset}
                      className="px-6 py-3 border border-neutral-200 dark:border-neutral-700 text-sm font-sans uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={Object.keys(selectedAnswers).length < 5}
                      className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-sans uppercase tracking-widest hover:opacity-90 transition-opacity rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 p-4 md:px-8 flex items-center justify-between z-20 h-20">
            <Link to={`/my-courses/${courseId}/lesson/2`} className="flex items-center gap-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group text-left">
              <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center group-hover:border-neutral-900 dark:group-hover:border-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Previous Lesson</span>
                <span className="block text-xs font-medium truncate max-w-[150px]">Fibonacci: Top-Down vs Bottom-Up</span>
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
