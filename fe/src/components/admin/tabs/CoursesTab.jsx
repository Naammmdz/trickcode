import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pill from '../common/Pill';
import Pagination from '../common/Pagination';
import { courseService } from '../../../services/courseService';

const CoursesTab = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Dropdown State
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('[data-dropdown]')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  // Tabs Configuration
  const tabs = [
    { id: 'ALL', label: 'All', icon: 'apps' },
    { id: 'PENDING', label: 'Pending', icon: 'pending_actions' },
    { id: 'PUBLISHED', label: 'Published', icon: 'check_circle' },
    { id: 'DRAFT', label: 'Draft', icon: 'edit_note' },
    { id: 'REJECTED', label: 'Rejected', icon: 'cancel' },
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const statusFilter = activeTab === 'ALL' ? null : activeTab;
      const resp = await courseService.getCourses({ page, size, status: statusFilter, q: query });

      setCourses(resp.content || []);
      setTotalPages(resp.totalPages || 0);
      setTotalElements(resp.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, size, activeTab]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchCourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Tab Change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(0);
  };

  const handleReviewClick = (course) => {
    navigate(`/review-course/${course.id}`, { state: { reviewMode: true, courseId: course.id } });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      await courseService.deleteCourse(courseId);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course: ' + (err.message || 'Unknown error'));
    }
  };

  const handleApproveCourse = async (course) => {
    try {
      await courseService.approveCourse(course.id);
      fetchCourses();
    } catch (err) {
      alert('Failed to approve course: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRejectCourse = async (course) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    try {
      await courseService.rejectCourse(course.id, reason);
      fetchCourses();
    } catch (err) {
      alert('Failed to reject course: ' + (err.message || 'Unknown error'));
    }
  };

  const handlePublishCourse = async (course) => {
    try {
      await courseService.publishCourse(course.id);
      fetchCourses();
    } catch (err) {
      alert('Failed to publish course: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUnpublishCourse = async (course) => {
    try {
      await courseService.unpublishCourse(course.id);
      fetchCourses();
    } catch (err) {
      alert('Failed to unpublish course: ' + (err.message || 'Unknown error'));
    }
  };


  const statusTone = (s) =>
    s === 'PUBLISHED' || s === 'APPROVED' ? 'green' :
      s === 'PENDING' ? 'blue' :
        s === 'REJECTED' ? 'red' : 'yellow';

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const getInstructorName = (instructor) => {
    if (!instructor) return 'Unknown';
    if (instructor.firstName && instructor.lastName) {
      return `${instructor.firstName} ${instructor.lastName}`;
    }
    if (instructor.firstName) return instructor.firstName;
    if (instructor.login) return instructor.login;
    return 'Unknown';
  };

  const getInstructorInitial = (instructor) => {
    if (!instructor) return 'U';
    if (instructor.firstName) return instructor.firstName.charAt(0).toUpperCase();
    if (instructor.login) return instructor.login.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Course Management</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
          Review and manage instructor courses.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 dark:text-red-400">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Toolbar: Tabs + Search */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-lg">search</span>
            <input
              className="pl-10 pr-3 py-2.5 w-full md:w-72 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:border-transparent transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              placeholder="Search course, instructor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-100 dark:border-neutral-800">
              <tr>
                {['Course', 'Instructor', 'Price', 'Status', 'Submitted', 'Actions'].map((c) => (
                  <th key={c} className="text-left px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-400 dark:border-t-neutral-500 rounded-full animate-spin" />
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">school</span>
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">No courses found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{c.title}</span>
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">ID: {c.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300">
                          {getInstructorInitial(c.instructor)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{getInstructorName(c.instructor)}</span>
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{c.instructor?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-neutral-700 dark:text-neutral-200">
                      {c.price === 0 ? <span className="text-emerald-500 font-medium">Free</span> : formatCurrency(c.price)}
                    </td>
                    <td className="px-6 py-4"><Pill tone={statusTone(c.status)}>{c.status}</Pill></td>
                    <td className="px-6 py-4 text-xs text-neutral-400 dark:text-neutral-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative" data-dropdown>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === c.id ? null : c.id);
                          }}
                          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
                        >
                          <span className="material-symbols-outlined text-base">more_vert</span>
                        </button>

                        {activeDropdown === c.id && (
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 z-10 py-1.5 flex flex-col" data-dropdown>
                            {c.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => { setActiveDropdown(null); handleApproveCourse(c); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                  Approve & Publish
                                </button>
                                <button
                                  onClick={() => { setActiveDropdown(null); handleRejectCourse(c); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-sm">cancel</span>
                                  Reject Course
                                </button>
                                <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1 mx-3" />
                              </>
                            )}
                            {c.status === 'PUBLISHED' && (
                              <>
                                <button
                                  onClick={() => { setActiveDropdown(null); handleUnpublishCourse(c); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-sm">unpublished</span>
                                  Unpublish
                                </button>
                                <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1 mx-3" />
                              </>
                            )}
                            {(c.status === 'DRAFT' || c.status === 'REJECTED') && (
                              <>
                                <button
                                  onClick={() => { setActiveDropdown(null); handlePublishCourse(c); }}
                                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-sm">publish</span>
                                  Publish Course
                                </button>
                                <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1 mx-3" />
                              </>
                            )}
                            <button
                              onClick={() => { setActiveDropdown(null); handleReviewClick(c); }}
                              className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              View Course
                            </button>
                            {c.rejectionReason && (
                              <button
                                onClick={() => { setActiveDropdown(null); alert(`Rejection reason: ${c.rejectionReason}`); }}
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm">info</span>
                                Rejection Reason
                              </button>
                            )}
                            <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1 mx-3" />
                            <button
                              onClick={() => { setActiveDropdown(null); handleDeleteCourse(c.id); }}
                              className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalElements={totalElements}
          pageSize={size}
        />
      </div>
    </div>
  );
};

export default CoursesTab;
