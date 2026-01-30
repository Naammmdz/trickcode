import { Link, useParams } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseSyllabus from '../components/course/CourseSyllabus';

const VideoWorkspace = () => {
  const { courseId, lessonId } = useParams();

  const youtubeEmbedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

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
            <span className="text-neutral-900 dark:text-white font-semibold">Fibonacci: Top-Down vs Bottom-Up</span>
          </div>

          {/* Video Player */}
          <div className="flex-1 overflow-y-auto scroll-smooth pb-20">
            <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-10 pb-8">
              <div className="relative aspect-video bg-neutral-900 rounded-lg shadow-2xl overflow-hidden mb-8 border border-neutral-800">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={youtubeEmbedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* Lesson Info */}
              <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white">Fibonacci: Top-Down vs Bottom-Up</h1>
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
                  In this lesson, we break down the two main approaches to Dynamic Programming. We'll start with the naive recursive solution, identify the overlapping subproblems, and then optimize using both Memoization (Top-Down) and Tabulation (Bottom-Up).
                </p>
              </div>

              {/* Transcript Content */}
              <div className="prose dark:prose-invert prose-neutral max-w-none">
                <div className="mb-6 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 p-2 rounded -ml-2 transition-colors">
                  <p className="text-neutral-600 dark:text-neutral-400 m-0">Alright, let's talk about the Fibonacci sequence. It's the "Hello World" of Dynamic Programming for a reason. It perfectly illustrates the problem with pure recursion.</p>
                </div>
                <div className="mb-6 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 p-2 rounded -ml-2 transition-colors">
                  <p className="text-neutral-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded m-0 border-l-2 border-yellow-400">So, if we look at the recursion tree for F(5), you'll see we calculate F(3) multiple times. This is what we call <strong>overlapping subproblems</strong>.</p>
                </div>
                <div className="mb-6 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 p-2 rounded -ml-2 transition-colors">
                  <p className="text-neutral-600 dark:text-neutral-400 m-0">Top-down is essentially "recursion + caching". We keep the recursive structure but store the result of each subproblem in a hash map or an array. Let's implement that.</p>
                </div>
                <div className="my-8 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <span className="text-xs font-sans text-neutral-500">fibonacci_memo.py</span>
                    <button className="text-xs text-neutral-500 hover:text-primary transition-colors flex items-center gap-1 font-sans uppercase tracking-widest">
                      <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                    </button>
                  </div>
                  <div className="bg-neutral-50 dark:bg-black p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-300 leading-relaxed"><code><span className="text-orange-500">def</span> <span className="text-blue-600 dark:text-blue-400">fib</span>(n, memo={}):
    <span className="text-orange-500">if</span> n <span className="text-orange-500">in</span> memo: <span className="text-orange-500">return</span> memo[n]
    <span className="text-orange-500">if</span> n &lt;= 2: <span className="text-orange-500">return</span> 1
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    <span className="text-orange-500">return</span> memo[n]</code></pre>
                  </div>
                </div>
                <div className="mb-6 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 p-2 rounded -ml-2 transition-colors">
                  <p className="text-neutral-600 dark:text-neutral-400 m-0">Now observe the time complexity. By memoizing, we reduce the complexity from O(2^n) to O(n). That is a massive improvement for larger inputs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 p-4 md:px-8 flex items-center justify-between z-20 h-20">
            <Link to={`/my-courses/${courseId}/lesson/1`} className="flex items-center gap-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group text-left">
              <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center group-hover:border-neutral-900 dark:group-hover:border-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Previous Lesson</span>
                <span className="block text-xs font-medium truncate max-w-[150px]">Intro to DP Concepts</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button className="hidden lg:hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 rounded">
                <span className="material-symbols-outlined text-lg">list</span> View Syllabus
              </button>
            </div>
            <Link to={`/my-courses/${courseId}/quiz/3`} className="flex items-center gap-4 text-neutral-900 dark:text-white group text-right">
              <div className="hidden sm:block">
                <span className="block text-[10px] uppercase font-sans tracking-widest text-neutral-400 mb-0.5">Next Lesson</span>
                <span className="block text-xs font-medium truncate max-w-[150px]">Space Complexity Quiz</span>
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

export default VideoWorkspace;
