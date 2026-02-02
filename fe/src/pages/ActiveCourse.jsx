import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import UserAvatar from '../components/layout/UserAvatar';
import ThemeToggler from '../components/ui/ThemeToggler';
import CourseCurriculum from '../components/course/CourseCurriculum';
import { useState } from 'react';
import { courseService } from '../services/courseService';

const ActiveCourse = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isReviewMode = location.state?.reviewMode;

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = async () => {
    try {
      if (window.confirm('Are you sure you want to approve this course?')) {
        await courseService.updateStatus(courseId, 'APPROVED');
        navigate('/admin');
      }
    } catch (error) {
      alert('Failed to approve course');
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      alert('Please provide a reason');
      return;
    }
    try {
      await courseService.updateStatus(courseId, 'REJECTED', rejectReason);
      navigate('/admin');
    } catch (error) {
      alert('Failed to reject course');
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">

      {/* Admin Review Banner */}
      {isReviewMode && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-neutral-900 text-white z-[60] flex items-center justify-between px-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">ADMIN REVIEW MODE</span>
            <span className="text-sm text-neutral-300">You have full access to this course content.</span>
          </div>
          <div className="flex items-center gap-2">
            {showRejectInput ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-2 fade-in">
                <input
                  autoFocus
                  placeholder="Reason for rejection..."
                  className="text-sm text-black px-3 py-1.5 rounded outline-none border-none w-64"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <button onClick={handleReject} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-bold uppercase">Confirm</button>
                <button onClick={() => setShowRejectInput(false)} className="text-neutral-400 hover:text-white px-2 text-xs uppercase">Cancel</button>
              </div>
            ) : (
              <>
                <button onClick={() => setShowRejectInput(true)} className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                  Reject Course
                </button>
                <button onClick={handleApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-green-900/20">
                  Approve & Publish
                </button>
              </>
            )}
            <button onClick={() => navigate('/admin')} className="ml-4 text-neutral-500 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Navbar - Adjusted top padding if review mode */}
      <nav className={`fixed w-full z-50 ${isReviewMode ? 'top-16' : 'top-0'} bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className={`relative z-10 ${isReviewMode ? 'pt-40' : 'pt-24'} pb-12`}>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] md:text-xs font-sans uppercase tracking-widest text-neutral-500 mb-8">
            <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white">Dynamic Programming</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Course Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] uppercase font-sans tracking-widest rounded-full">Active Course</span>
                  <div className="flex items-center gap-1 text-primary text-xs font-sans">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-neutral-500 dark:text-neutral-400 ml-1">Purchased on Oct 24</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif mb-6 text-neutral-900 dark:text-white leading-tight">
                  Dynamic Programming <span className="italic font-light text-neutral-500">Patterns</span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-8">
                  Master the art of breaking down complex problems. Learn to identify overlapping subproblems, define optimal substructures, and construct efficient solutions from the ground up.
                </p>
                {/* Video Player */}
                <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden group cursor-pointer shadow-2xl border border-neutral-200 dark:border-neutral-800">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmRlR0G1GEt3zyZ6RH0_TdHF0-mXZSvpr-5j578HX6K7qX65Q_i5IDY5HADYZ9paECN_bYnR1Vh78Mk0TpO4gVBJh018OR1o19NdIGBemUxEfYAeHi9M8uuN4LDdRDsrbSgdN4ZB0CUp-aR77u2FloNkeKkKPtoBY9LxKzPgAFpCu-okPM92Qg0cIvTNTRHe72m-FawuIU-6o0I9RDjtWrYFQTnguH6UCFQwOfkTY6griXUwxlo8Pu8mS1UNQyre4szD31alRdPg2N')" }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-white text-4xl md:text-5xl ml-1">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <span className="block text-white/60 text-xs font-sans uppercase tracking-widest mb-1">Last Watched</span>
                      <span className="block text-white text-lg font-serif">Intro to Memoization</span>
                    </div>
                    <div className="bg-neutral-900/80 backdrop-blur px-3 py-1 rounded text-white/80 font-sans text-xs">
                      04:22 / 12:40
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div className="h-full bg-orange-500 w-[35%]"></div>
                  </div>
                </div>
              </div>

              {/* Curriculum */}
              <section>
                <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">library_books</span>
                  Curriculum
                </h3>
                <CourseCurriculum courseId={courseId} />
              </section>

              {/* Instructor */}
              <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                <h3 className="text-2xl font-serif mb-8">Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden border border-neutral-300 dark:border-neutral-700">
                    <img alt="Sarah J." className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFg26Od_q_qqorG-kvXzU5AVHlblU_8u2KikSyPBX7Tp-9TdEbrIA5wSI1Yegk8KH9XeovyT2te9O62vwfd9sn4zJewVzfEAPLtGi6EUox2sTfougsVgiA4vGrk0N4Yc0JFiL6e1nDjY-PABiaUUGx7cKylJq-Ew1-nt1nhuo6ia321UVCVv-NK88Tw6Z_6TusObN47dRbtU7MOhjJ9kGuHlSWLkwz1RaRk4mgBh-AjUG92CpbQ8T4cis6_KwREFv_KAZR8i8G8T-1" />
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

              {/* Reviews */}
              <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                <div className="flex items-end justify-between mb-10">
                  <h3 className="text-2xl font-serif">Student Reviews</h3>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1 justify-end">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-sm text-yellow-500/50" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest">4.8 Rating • 420 Reviews</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden">
                        <img alt="User" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9BUGITiKOFQuEZ-JdgSvqgA5fwufUmkCGqriAEl8WYQOtQ5zBhKjk31_0VXw73YUrMkc_VMQl7VRae5SQ_fJ_J3F5IsLuVwR2392Cweq3BzH30B-zp2EDuj8GMjzLG6kV4NwzqSP7OgMUwEmo7Iu6x8S3QlM7Su2-GOSV2gHVTfqZkHUtuV4nMSrvx4cBGg0Qi9UMTJQpvrqvdwC8hLhE5B0D4Ykz26pT2dsbw1RDb9Iu1IynfyRqe1GVCvw4a_Ld-SYlNvnRdiAT" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">David K.</p>
                        <p className="text-[10px] text-neutral-500 font-sans">Software Engineer @ Uber</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"I finally understand DP. The grid visualization technique Sarah uses changed everything for me. Just got my offer!"</p>
                  </div>
                  <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden">
                        <img alt="User" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwjV0CV5O46otQmNTcIk_NrIAFdR-aMtucqvCXHprZ0CicY4T8hlYsPf5t3JbHcwq07fbeDQ1oSWMh7AFzCYEjbDATVPScjL6YVrJrJ2t0D_7gWvY-bbWHE_aeXg8NLAbRL6H1yaqSrnHHT5N3fBQmtLxkKMCrqa34RUjLKAvUP0Yfhbz-zyfBTTEIzG2HYeQHKI5iQfHxB723NBsuckL2eLwcZOMzdbAg7zx7ZMKrkiRaouHu19yks3oz59QK7l0e-T1sQ5ux_Rh6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Emily R.</p>
                        <p className="text-[10px] text-neutral-500 font-sans">CS Student @ MIT</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"High production quality and extremely dense material. No fluff. Exactly what I needed for finals and internships."</p>
                  </div>
                </div>
                <button className="mt-8 w-full py-3 border border-neutral-200 dark:border-neutral-700 text-xs font-sans uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Load More Reviews
                </button>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-40 space-y-6">
                {/* Progress Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-xl shadow-neutral-200/50 dark:shadow-none">
                  <h5 className="text-xs font-sans uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Progress Protocol
                  </h5>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        <path className="text-neutral-100 dark:text-neutral-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                        <path className="text-orange-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeLinecap="round" strokeWidth="2.5"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-sans font-bold text-neutral-900 dark:text-white">25%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-sans text-neutral-400 tracking-widest block mb-1">Next Up</span>
                      <h4 className="font-serif font-medium text-lg leading-tight text-neutral-900 dark:text-white">1D Dynamic Programming</h4>
                    </div>
                  </div>
                  <Link to={`/my-courses/${courseId}/lesson/2`} className="w-full py-4 bg-orange-500 text-white font-sans text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 mb-8 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                    Resume Mission
                  </Link>

                  {/* Hide Locked Status in Review Mode */}
                  {!isReviewMode && (
                    <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs font-sans uppercase tracking-widest text-neutral-500">Certificate Status</h5>
                        <span className="material-symbols-outlined text-neutral-400 text-sm">lock</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="bg-neutral-300 dark:bg-neutral-600 h-full w-[25%]"></div>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic">Locked until 100% completion</p>
                    </div>
                  )}
                </div>

                {/* Resources */}
                <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <h5 className="font-serif text-lg mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">folder_zip</span>
                    Course Resources
                  </h5>
                  <p className="text-sm text-neutral-500 mb-4">Download the starter code, PDF guides, and cheat sheets for this module.</p>
                  <button className="text-neutral-900 dark:text-white text-xs font-sans uppercase tracking-widest hover:underline flex items-center gap-1">
                    Access Files <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 z-40 transform translate-y-0 transition-transform duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="hidden md:block">
            <p className="font-serif font-medium text-neutral-900 dark:text-white">Dynamic Programming Patterns</p>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8 Rating
            </div>
          </div>
          <div className="flex-1 max-w-md ml-auto flex items-center gap-4">
            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between text-[10px] font-sans uppercase text-neutral-500 tracking-widest">
                <span>Progress</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/4 rounded-full"></div>
              </div>
            </div>
            <Link to={`/my-courses/${courseId}/lesson/2`} className="hidden sm:flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 w-10 h-10 rounded-full hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-24 px-6 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 z-10 relative mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif max-w-lg mb-8 md:mb-0">
            Ready to master algorithms and <span className="italic font-light">ace your interviews?</span>
          </h2>
          <Link to="/marketplace" className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Join Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white">
              <img
                alt="TrickCode Logo"
                className="w-4 h-4 object-contain rounded"
                src={logo}
              />
              <span className="font-serif font-bold text-lg">Trickcode</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              The premier marketplace for engineering knowledge. Connected learning for the modern web.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Marketplace</span>
            <Link to="/marketplace" className="hover:underline">Browse All</Link>
            <a className="hover:underline" href="#">Instructors</a>
            <a className="hover:underline" href="#">Become a Mentor</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Resources</span>
            <a className="hover:underline" href="#">Blog</a>
            <a className="hover:underline" href="#">Documentation</a>
            <a className="hover:underline" href="#">Community</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans uppercase text-neutral-900 dark:text-white mb-2">Legal</span>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between text-[10px] font-sans uppercase text-neutral-400">
          <span>© 2023 Trickcode Inc.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#">Twitter</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#">Github</a>
            <a className="hover:text-neutral-900 dark:hover:text-white" href="#">Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ActiveCourse;
