import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminModal from '../AdminModal';
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
      if (activeDropdown && !event.target.closest('button')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  // Tabs Configuration
  const tabs = [
    { id: 'ALL', label: 'All Courses' },
    { id: 'PENDING', label: 'Pending Review' },
    { id: 'PUBLISHED', label: 'Published' },
    { id: 'DRAFT', label: 'Draft' },
    { id: 'REJECTED', label: 'Rejected' },
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
    setPage(0); // Reset page on tab switch
  };

  const handleReviewClick = (course) => {
    navigate(`/my-courses/${course.id}`, { state: { reviewMode: true, courseId: course.id } });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      await courseService.deleteCourse(courseId);
      fetchCourses(); // Refresh list
    } catch (err) {
      alert('Failed to delete course: ' + (err.message || 'Unknown error'));
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
    <div className="p-8 max-w-6xl space-y-6">
      {/* Header & Tabs */}
      <div className="border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-lg font-serif text-neutral-900 dark:text-white">Course Management</div>
              <div className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">Review and manage instructor courses.</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base">search</span>
                <input
                  className="pl-10 pr-3 py-2 w-64 max-w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-zinc-600 rounded-[4px]"
                  placeholder="Search course, instructor..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-transparent">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                    ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="min-w-full">
            <thead className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-100 dark:border-zinc-800">
              <tr>
                {['Course', 'Instructor', 'Price', 'Status', 'Submitted', 'Actions'].map((c) => (
                  <th key={c} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">Loading...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-sm text-center text-neutral-500 dark:text-zinc-400">No courses found.</td></tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-100 dark:border-zinc-800 last:border-b-0">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{c.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono bg-neutral-100 dark:bg-zinc-800 px-1 rounded text-neutral-600 dark:text-zinc-400">ID: {c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-zinc-300">
                          {getInstructorInitial(c.instructor)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-700 dark:text-zinc-300">{getInstructorName(c.instructor)}</span>
                          <span className="text-[10px] text-neutral-500 dark:text-zinc-500">{c.instructor?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-neutral-700 dark:text-zinc-200">
                      {c.price === 0 ? 'Free' : formatCurrency(c.price)}
                    </td>
                    <td className="px-6 py-4"><Pill tone={statusTone(c.status)}>{c.status}</Pill></td>
                    <td className="px-6 py-4 text-xs text-neutral-500 dark:text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === c.id ? null : c.id);
                          }}
                          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">more_vert</span>
                        </button>

                        {activeDropdown === c.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded shadow-lg z-10 py-1 flex flex-col">
                            {c.status === 'PENDING' && (
                              <button
                                onClick={() => { setActiveDropdown(null); handleReviewClick(c); }}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                              >
                                Review Course
                              </button>
                            )}
                            <button
                              onClick={() => { setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Edit Details
                            </button>
                            <button
                              onClick={() => { setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              View History
                            </button>
                            <div className="h-px bg-neutral-100 dark:bg-zinc-800 my-1"></div>
                            <button
                              onClick={() => { setActiveDropdown(null); handleDeleteCourse(c.id); }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
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
