import { useEffect, useState, useMemo } from 'react';
import { instructorDashboardService } from '../../services/instructorDashboardService';
import StatCard from '../admin/dashboard/StatCard';
import ActivityFeed from '../admin/dashboard/ActivityFeed';
import DashboardChart from '../admin/dashboard/DashboardChart';
import DashboardPieChart from '../admin/dashboard/DashboardPieChart';

const InstructorOverview = ({ onTabChange }) => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, chartsData] = await Promise.all([
                    instructorDashboardService.getStats(),
                    instructorDashboardService.getChartData(),
                ]);
                setStats(statsData);
                setChartData(chartsData);
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (val) => {
        const num = Number(val) || 0;
        return `$${num.toFixed(2)}`;
    };

    const revenueSummary = useMemo(() => {
        if (!chartData?.dailyRevenue?.length) return { total: '$0.00', subtitle: 'Last 30 days' };
        const total = chartData.dailyRevenue.reduce((s, d) => s + (Number(d.value) || 0), 0);
        return {
            total: formatCurrency(total),
            subtitle: `${chartData.dailyRevenue.length} days tracked`,
        };
    }, [chartData]);

    const enrollmentSummary = useMemo(() => {
        if (!chartData?.dailySignups?.length) return { total: '0', subtitle: 'Last 30 days' };
        const total = chartData.dailySignups.reduce((s, d) => s + (d.value || 0), 0);
        return {
            total: total.toLocaleString(),
            subtitle: `${chartData.dailySignups.length} days tracked`,
        };
    }, [chartData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-500 dark:border-t-neutral-400 rounded-full animate-spin" />
                <p className="text-sm text-neutral-400 dark:text-neutral-500 animate-pulse">Loading dashboard...</p>
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

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <span className="material-symbols-outlined text-4xl text-neutral-300 dark:text-neutral-600">analytics</span>
                <p className="text-sm text-neutral-400 dark:text-neutral-500">No statistics available.</p>
            </div>
        );
    }

    const formattedEnrollments = (stats.recentEnrollments || []).map(e => ({
        primaryText: `${e.userLogin} enrolled in "${e.courseTitle}"`,
        secondaryText: e.userEmail,
        timestamp: e.enrolledAt,
    }));

    return (
        <div className="space-y-8 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Instructor Dashboard</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
                        Overview of your courses, students, and earnings.
                    </p>
                </div>
                <button
                    onClick={() => onTabChange?.('courses')}
                    className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Course
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    title="Total Courses"
                    value={(stats.totalCourses || 0).toLocaleString()}
                    icon="menu_book"
                    color="blue"
                    subtitle={`${stats.publishedCourses || 0} published`}
                />
                <StatCard
                    title="Total Students"
                    value={(stats.totalStudents || 0).toLocaleString()}
                    icon="group"
                    color="green"
                    subtitle="enrolled"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon="payments"
                    color="primary"
                    subtitle="all time"
                />
                <StatCard
                    title="Pending Review"
                    value={(stats.pendingCourses || 0).toLocaleString()}
                    icon="pending_actions"
                    color="yellow"
                    subtitle={`${stats.draftCourses || 0} drafts`}
                />
            </div>

            {/* Charts: Revenue + Enrollments */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DashboardChart
                    title="Daily Revenue"
                    data={chartData?.dailyRevenue || []}
                    dataKey="value"
                    color="#10b981"
                    valueFormatter={(value) => `$${Number(value).toFixed(2)}`}
                    totalValue={revenueSummary.total}
                    subtitle={revenueSummary.subtitle}
                />
                <DashboardChart
                    title="New Enrollments"
                    data={chartData?.dailySignups || []}
                    dataKey="value"
                    color="#3b82f6"
                    valueFormatter={(value) => value.toLocaleString()}
                    chartType="bar"
                    totalValue={enrollmentSummary.total}
                    subtitle={enrollmentSummary.subtitle}
                />
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DashboardPieChart
                    title="Courses by Level"
                    data={chartData?.coursesByLevel || []}
                />
                <DashboardPieChart
                    title="Courses by Status"
                    data={chartData?.coursesByStatus || []}
                />
            </div>

            {/* Course Stats Table + Recent Enrollments */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Performing Courses */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/30 dark:hover:shadow-neutral-900/30">
                    <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <span className="material-symbols-outlined text-base text-neutral-500 dark:text-neutral-400">trending_up</span>
                            </div>
                            <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                                Course Performance
                            </h3>
                        </div>
                        <button
                            onClick={() => onTabChange?.('analytics')}
                            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                        {(stats.courseStats || []).length > 0 ? (
                            stats.courseStats.slice(0, 5).map((course, index) => (
                                <div key={course.courseId} className="px-5 py-3.5 flex justify-between items-center group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-200">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-neutral-800 dark:text-neutral-200 truncate">{course.courseTitle}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    course.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>{course.status}</span>
                                                <span className="text-[11px] text-neutral-400">{course.enrollmentCount} students</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-mono font-semibold text-neutral-900 dark:text-white flex-shrink-0 ml-4">
                                        {formatCurrency(course.revenue)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <span className="material-symbols-outlined text-3xl text-neutral-200 dark:text-neutral-700 mb-2 block">inbox</span>
                                <p className="text-sm text-neutral-400 dark:text-neutral-500">No courses yet. Create your first course!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Enrollments */}
                <ActivityFeed
                    title="Recent Enrollments"
                    items={formattedEnrollments}
                    icon="person_add"
                    emptyText="No recent enrollments."
                    maxItems={5}
                />
            </div>
        </div>
    );
};

export default InstructorOverview;
