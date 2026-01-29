import { Link, useParams } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseCurriculum from '../components/course/CourseCurriculum';

const CourseDetail = () => {
  const { id } = useParams();

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img
                alt="TrickCode Logo"
                className="w-full h-full object-contain rounded"
                src={logo}
              />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Trickcode</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-sans text-neutral-500 dark:text-neutral-400">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/marketplace" className="text-primary transition-colors">Marketplace</Link>
          </div>
          <div className="flex items-center gap-4">
            <UserAvatar />
            <ThemeToggler />
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] md:text-xs font-sans uppercase tracking-widest text-neutral-500 mb-8">
            <Link to="/marketplace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Marketplace</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to="/marketplace" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Algorithms</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white">Dynamic Programming</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Header Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] uppercase font-sans tracking-widest rounded-full">Hard Difficulty</span>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-sans">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
                    <span className="text-neutral-400 dark:text-neutral-500 ml-1">(420 reviews)</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif mb-6 text-neutral-900 dark:text-white leading-tight">
                  Dynamic Programming <span className="italic font-light text-neutral-500">Patterns</span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-8">
                  Master the art of breaking down complex problems. Learn to identify overlapping subproblems, define optimal substructures, and construct efficient solutions from the ground up.
                </p>
                
                {/* Video Preview */}
                <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden group cursor-pointer shadow-2xl border border-neutral-200 dark:border-neutral-800">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200')" }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-white text-4xl md:text-5xl ml-1">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <span className="block text-white/60 text-xs font-sans uppercase tracking-widest mb-1">Preview Lesson</span>
                      <span className="block text-white text-lg font-serif">Intro to Memoization</span>
                    </div>
                    <span className="text-white/80 font-sans text-xs bg-black/50 px-2 py-1 rounded">04:22</span>
                  </div>
                </div>
              </div>

              {/* Curriculum Section */}
              <section>
                <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">library_books</span>
                  Curriculum
                </h3>
                <CourseCurriculum courseId={id} />
              </section>

              {/* Instructor Section */}
              <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                <h3 className="text-2xl font-serif mb-8">Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden border border-neutral-300 dark:border-neutral-700">
                    <div className="w-full h-full bg-neutral-300 dark:bg-neutral-700"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-medium mb-2">Sarah Jenkins</h4>
                    <p className="text-xs font-sans uppercase tracking-widest text-neutral-500 mb-4">Senior Staff Engineer @ Netflix</p>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm md:text-base mb-6">
                      Sarah has over 12 years of experience building distributed systems and high-performance algorithms. She previously led the search infrastructure team at Google and has conducted over 500+ technical interviews. Her teaching style focuses on pattern recognition rather than rote memorization.
                    </p>
                    <div className="flex gap-4">
                      <a className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">link</span>
                      </a>
                      <a className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" href="#">
                        <span className="material-symbols-outlined text-lg">terminal</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews Section */}
              <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                <div className="flex items-end justify-between mb-10">
                  <h3 className="text-2xl font-serif">Student Reviews</h3>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1 justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest">4.8 Rating • 420 Reviews</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden"></div>
                      <div>
                        <p className="text-sm font-medium">David K.</p>
                        <p className="text-[10px] text-neutral-500 font-sans">Software Engineer @ Uber</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"I finally understand DP. The grid visualization technique Sarah uses changed everything for me. Just got my offer!"</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden"></div>
                      <div>
                        <p className="text-sm font-medium">Emily R.</p>
                        <p className="text-[10px] text-neutral-500 font-sans">CS Student @ MIT</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"High production quality and extremely dense material. No fluff. Exactly what I needed for finals and internships."</p>
                  </div>
                </div>
                <button className="mt-8 w-full py-3 border border-neutral-200 dark:border-neutral-700 text-xs font-sans uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded">
                  Load More Reviews
                </button>
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-xl shadow-neutral-200/50 dark:shadow-none">
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-serif font-medium text-neutral-900 dark:text-white">$39.99</span>
                    <span className="text-sm text-neutral-400 line-through mb-1.5">$89.99</span>
                    <span className="text-xs text-primary font-sans bg-primary/10 px-2 py-1 rounded mb-1.5 ml-auto">-55%</span>
                  </div>
                  <div className="mb-8">
                    <Link to="/checkout" className="w-full block py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg shadow-neutral-900/20 rounded text-center">
                      Enroll Now
                    </Link>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h5 className="text-xs font-sans uppercase tracking-widest text-neutral-500 mb-4">What's Included</h5>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="material-symbols-outlined text-lg text-neutral-400">videocam</span>
                      <span>24 High-def Lessons</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="material-symbols-outlined text-lg text-neutral-400">terminal</span>
                      <span>10 Code Assignments</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="material-symbols-outlined text-lg text-neutral-400">download</span>
                      <span>Downloadable Resources</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="material-symbols-outlined text-lg text-neutral-400">all_inclusive</span>
                      <span>Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="material-symbols-outlined text-lg text-neutral-400">emoji_events</span>
                      <span>Certificate of Completion</span>
                    </div>
                  </div>
                </div>

                {/* Enterprise Card */}
                <div className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <h5 className="font-serif text-lg mb-2">Team Access?</h5>
                  <p className="text-sm text-neutral-500 mb-4">Get this course for your engineering team with our enterprise plan.</p>
                  <a className="text-primary text-xs font-sans uppercase tracking-widest hover:underline" href="#">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 z-40 transform translate-y-0 transition-transform duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="hidden md:block">
            <p className="font-serif font-medium text-neutral-900 dark:text-white">Dynamic Programming Patterns</p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8 Rating
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-serif text-xl md:text-2xl ml-auto md:ml-0">$39.99</span>
            <Link to="/checkout" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 font-sans text-xs uppercase tracking-widest hover:opacity-90 transition-opacity rounded inline-block">
              Purchase Access
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-24 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif max-w-lg mb-8 md:mb-0">
            Ready to master <span className="italic font-light">algorithms and ace your interviews?</span>
          </h2>
          <Link to="/login" className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors rounded">
            Join Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white">
              <img
                alt="TrickCode Logo"
                className="w-6 h-6 object-contain rounded"
                src={logo}
              />
              <span className="font-serif font-bold text-lg">Trickcode</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              The premier platform for learning data structures and algorithms. Master DSA and ace your technical interviews.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Marketplace</span>
            <Link to="/marketplace" className="hover:underline">Browse All</Link>
            <a href="#mentors" className="hover:underline">Instructors</a>
            <a href="#" className="hover:underline">Become a Mentor</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Resources</span>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Community</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Legal</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between text-[10px] font-sans uppercase text-neutral-400">
          <span>© 2024 Trickcode Inc.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Twitter</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Github</a>
            <a href="#" className="hover:text-neutral-900 dark:hover:text-white">Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetail;
