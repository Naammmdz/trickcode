import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import Navbar from '../components/layout/Navbar';
import CourseCurriculum from '../components/course/CourseCurriculum';
import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

const ActiveCourse = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isReviewMode = location.state?.reviewMode;

  const [course, setCourse] = useState(null);
  const [courseAccess, setCourseAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch course data
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData);

        // Check access if user is logged in
        if (user) {
          const accessData = await courseService.checkCourseAccess(courseId);
          setCourseAccess(accessData);
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error);
        setError('Failed to load course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  const handleApprove = async () => {
    try {
      if (window.confirm('Are you sure you want to approve and publish this course?')) {
        await courseService.approveCourse(courseId);
        alert('Course approved and published successfully!');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Failed to approve course:', error);
      alert('Failed to approve course: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason || rejectReason.trim() === '') {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await courseService.rejectCourse(courseId, rejectReason);
      alert('Course rejected successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to reject course:', error);
      alert('Failed to reject course: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Course not found'}</p>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-white">

      {/* Admin Review Banner */}
      {isReviewMode && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-neutral-900 text-white z-[60] flex items-center justify-between px-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">ADMIN REVIEW MODE</span>
            <span className="text-sm text-neutral-300">You have full access to this course content.</span>
            {course?.status && (
              <span className="text-xs text-neutral-400 ml-2">
                Status: <span className="text-white font-bold">{course.status}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {course?.status && (course.status === 'PENDING' || course.status === 'REJECTED') && (
              <>
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
              </>
            )}
            {course?.status === 'PUBLISHED' && (
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

      {/* Navbar - offset when review banner is shown */}
      <div className={isReviewMode ? 'pt-16' : ''}>
        <Navbar />
      </div>

      <main className={`relative z-10 ${isReviewMode ? 'pt-40' : 'pt-24'} pb-12`}>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] md:text-xs font-sans uppercase tracking-widest text-neutral-500 mb-8">
            <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <Link to="/my-courses" className="hover:text-neutral-900 dark:hover:text-white transition-colors">My Courses</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-neutral-900 dark:text-white">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Course Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {!isReviewMode && courseAccess?.isEnrolled && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] uppercase font-sans tracking-widest rounded-full">
                      Active Course
                    </span>
                  )}
                  {!isReviewMode && (
                    <div className="flex items-center gap-1 text-primary text-xs font-sans">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-neutral-500 dark:text-neutral-400 ml-1">Enrolled</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-serif mb-6 text-neutral-900 dark:text-white leading-tight">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-2xl mb-8">
                    {course.description}
                  </p>
                )}

                {/* Video Preview - Only show if course has preview video */}
                {course.videoPreviewUrl && (
                  <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden group cursor-pointer shadow-2xl border border-neutral-200 dark:border-neutral-800 mb-8">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ backgroundImage: course.thumbnailUrl ? `url('${course.thumbnailUrl}')` : 'none' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-white text-4xl md:text-5xl ml-1">play_arrow</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="block text-white text-sm font-sans">Course Preview</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Curriculum */}
              <section>
                <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined">library_books</span>
                  Curriculum
                </h3>
                <CourseCurriculum courseId={courseId} isReviewMode={isReviewMode} />
              </section>

              {/* Instructor */}
              {course.instructor && (
                <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                  <h3 className="text-2xl font-serif mb-8">Instructor</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                      {course.instructor.imageUrl ? (
                        <img alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                          className="w-full h-full object-cover"
                          src={course.instructor.imageUrl} />
                      ) : (
                        <span className="text-4xl text-neutral-400">
                          {course.instructor.firstName?.[0]}{course.instructor.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-serif font-medium mb-2">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </h4>
                      {course.instructor.email && (
                        <p className="text-xs font-sans text-neutral-500 mb-4">{course.instructor.email}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Reviews - Hide in review mode */}
              {!isReviewMode && (
                <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-700 mb-4">rate_review</span>
                    <p className="text-neutral-500 dark:text-neutral-400">Reviews coming soon</p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-40 space-y-6">
                {/* Progress Card - Hide in review mode */}
                {!isReviewMode && (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-xl shadow-neutral-200/50 dark:shadow-none">
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-700 mb-4">pending</span>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">Progress tracking coming soon</p>
                    </div>
                  </div>
                )}

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

      {/* Bottom Bar - Hide in review mode */}
      {!isReviewMode && (
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
      )}

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
