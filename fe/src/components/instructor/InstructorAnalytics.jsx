import { useEffect, useState, useMemo } from 'react';
import { instructorDashboardService } from '../../services/instructorDashboardService';
import DashboardChart from '../admin/dashboard/DashboardChart';
import DashboardPieChart from '../admin/dashboard/DashboardPieChart';

const InstructorAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [sortBy, setSortBy] = useState('enrollmentCount');
    const [sortDir, setSortDir] = useState('desc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, chartsData, enrollData] = await Promise.all([
                    instructorDashboardService.getStats(),
                    instructorDashboardService.getChartData(),
                    instructorDashboardService.getEnrollments(),
                ]);
                setStats(statsData);
                setChartData(chartsData);
                setEnrollments(enrollData || []);
            } catch (err) {
                setError('Failed to load analytics data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const courseStats = useMemo(() => {
        if (!stats?.courseStats) return [];
        return [...stats.courseStats].sort((a, b) => {
            const aVal = a[sortBy] || 0;
            const bVal = b[sortBy] || 0;
            return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
        });
    }, [stats, sortBy, sortDir]);

    const totals = useMemo(() => {
        if (!courseStats.length) return { students: 0, courses: 0, published: 0, avgStudents: 0 };
        const students = courseStats.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
        const published = courseStats.filter(c => c.status === 'PUBLISHED').length;
        return {
            students,
            courses: courseStats.length,
            published,
            avgStudents: published > 0 ? Math.round(students / published) : 0,
        };
    }, [courseStats]);

    const filteredEnrollments = useMemo(() => {
        if (selectedCourse === 'all') return enrollments;
        return enrollments.filter(e => String(e.courseId) === selectedCourse);
    }, [enrollments, selectedCourse]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortDir('desc');
        }
    };

    const SortIcon = ({ field }) => (
        <span className={`material-symbols-outlined text-[14px] ml-1 transition-transform ${sortBy === field ? 'text-neutral-900 dark:text-white' : 'text-neutral-300 dark:text-neutral-600'} ${sortBy === field && sortDir === 'asc' ? 'rotate-180' : ''}`}>
            arrow_downward
        </span>
    );

    const timeAgo = (dateStr) => {
        const now = new Date();
        const d = new Date(dateStr);
        const diffMs = now - d;
        const mins = Math.floor(diffMs / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return d.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-500 dark:border-t-neutral-400 rounded-full animate-spin" />
                <p className="text-sm text-neutral-400 dark:text-neutral-500 animate-pulse">Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Course Analytics</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
                    Course performance and enrollment insights.
                </p>
            </div>

            {/* Summary Cards — focused on courses, not revenue */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL COURSES', value: totals.courses, icon: 'menu_book', color: 'text-sky-500' },
                    { label: 'PUBLISHED', value: totals.published, icon: 'check_circle', color: 'text-emerald-500' },
                    { label: 'TOTAL ENROLLMENTS', value: totals.students, icon: 'group', color: 'text-amber-500' },
                    { label: 'AVG ENROLLMENTS/COURSE', value: totals.avgStudents, icon: 'trending_up', color: 'text-rose-500' },
                ].map((card) => (
                    <div key={card.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`material-symbols-outlined text-lg ${card.color}`}>{card.icon}</span>
                            <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">{card.label}</span>
                        </div>
                        <p className="text-2xl font-serif font-bold text-neutral-900 dark:text-white">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts: Enrollment + Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DashboardChart
                    title="New Enrollments (30 days)"
                    data={chartData?.dailyActivity || []}
                    dataKey="value"
                    color="#3b82f6"
                    valueFormatter={(v) => v.toLocaleString()}
                    chartType="bar"
                />
                <DashboardPieChart
                    title="Courses by Level"
                    data={chartData?.coursesByLevel || []}
                />
            </div>

            {/* Course Performance Table */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            <span className="material-symbols-outlined text-base text-neutral-500 dark:text-neutral-400">leaderboard</span>
                        </div>
                        <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                            Course Performance
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {courseStats.length} courses
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
                            <tr>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Course</th>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Status</th>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Level</th>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                    <button className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors" onClick={() => handleSort('price')}>
                                        Price <SortIcon field="price" />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                    <button className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors" onClick={() => handleSort('enrollmentCount')}>
                                        Students <SortIcon field="enrollmentCount" />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Popularity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseStats.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">
                                        No courses found. Create your first course to see analytics.
                                    </td>
                                </tr>
                            ) : (
                                courseStats.map((course) => {
                                    const maxEnrollment = Math.max(...courseStats.map(c => c.enrollmentCount || 0), 1);
                                    const barWidth = ((course.enrollmentCount || 0) / maxEnrollment) * 100;
                                    return (
                                        <tr key={course.courseId} className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-9 h-9 rounded bg-neutral-200 dark:bg-neutral-800 bg-cover bg-center shrink-0"
                                                        style={{ backgroundImage: course.thumbnailUrl ? `url('${course.thumbnailUrl}')` : 'none' }}
                                                    >
                                                        {!course.thumbnailUrl && <span className="material-symbols-outlined text-neutral-400 flex items-center justify-center h-full text-sm">image</span>}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{course.courseTitle}</p>
                                                        <p className="text-[10px] text-neutral-400 mt-0.5">ID: {course.courseId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    course.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        course.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>{course.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {course.level ? (
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.level === 'BEGINNER' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            course.level === 'INTERMEDIATE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>{course.level}</span>
                                                ) : (
                                                    <span className="text-xs text-neutral-300 dark:text-neutral-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                                                {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                    {(course.enrollmentCount || 0).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24">
                                                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enrollment History — detailed who enrolled what */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/20">
                            <span className="material-symbols-outlined text-base text-sky-500">person_add</span>
                        </div>
                        <div>
                            <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                                Enrollment History
                            </h3>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{filteredEnrollments.length} enrollments</p>
                        </div>
                    </div>
                    {/* Course filter */}
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                    >
                        <option value="all">All Courses</option>
                        {courseStats.map(c => (
                            <option key={c.courseId} value={String(c.courseId)}>
                                {c.courseTitle}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredEnrollments.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-3xl text-neutral-200 dark:text-neutral-700 mb-2 block">group_off</span>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500">No enrollments found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50 max-h-[420px] overflow-y-auto">
                        {filteredEnrollments.map((e, idx) => (
                            <div key={idx} className="px-6 py-3.5 flex items-center gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-200">
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-bold shrink-0 uppercase">
                                    {(e.userLogin || '?')[0]}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                            {e.userLogin}
                                        </p>
                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                                            {e.userEmail}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                        Enrolled in <span className="font-medium text-neutral-700 dark:text-neutral-300">{e.courseTitle}</span>
                                    </p>
                                </div>
                                {/* Time */}
                                <div className="text-right shrink-0">
                                    <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                                        {timeAgo(e.enrolledAt)}
                                    </p>
                                    <p className="text-[10px] text-neutral-300 dark:text-neutral-600 mt-0.5">
                                        {new Date(e.enrolledAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorAnalytics;
