import { useEffect, useState, useMemo } from 'react';
import { instructorDashboardService } from '../../services/instructorDashboardService';

const InstructorPayouts = () => {
    const [stats, setStats] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, payoutsData] = await Promise.all([
                    instructorDashboardService.getStats(),
                    instructorDashboardService.getPayouts(),
                ]);
                setStats(statsData);
                setPayouts(payoutsData || []);
            } catch (err) {
                setError('Failed to load payout data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totals = useMemo(() => {
        if (!payouts.length) return { totalRevenue: 0, totalStudents: 0, avgPerCourse: 0, topCourse: null };
        const totalRevenue = payouts.reduce((s, c) => s + (c.revenue || 0), 0);
        const totalStudents = payouts.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
        const publishedCount = payouts.filter(c => c.status === 'PUBLISHED').length;
        const sorted = [...payouts].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
        return {
            totalRevenue,
            totalStudents,
            avgPerCourse: publishedCount > 0 ? (totalRevenue / publishedCount) : 0,
            topCourse: sorted[0] || null,
        };
    }, [payouts]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-500 dark:border-t-neutral-400 rounded-full animate-spin" />
                <p className="text-sm text-neutral-400 dark:text-neutral-500 animate-pulse">Loading payouts...</p>
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
                <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Payouts & Earnings</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
                    Track your earnings and revenue from course sales.
                </p>
            </div>

            {/* Earnings Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Total Earnings */}
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 group hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                                <span className="material-symbols-outlined text-lg text-emerald-500">account_balance_wallet</span>
                            </div>
                            <span className="text-[11px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Total Earnings</span>
                        </div>
                        <p className="text-4xl font-serif font-bold text-neutral-900 dark:text-white">
                            ${(totals.totalRevenue || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                            From {totals.totalStudents} enrollments across {payouts.length} courses
                        </p>
                    </div>
                </div>

                {/* Average per Course */}
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 group hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/20">
                                <span className="material-symbols-outlined text-lg text-sky-500">avg_pace</span>
                            </div>
                            <span className="text-[11px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Avg. per Course</span>
                        </div>
                        <p className="text-4xl font-serif font-bold text-neutral-900 dark:text-white">
                            ${(totals.avgPerCourse || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                            Average revenue per published course
                        </p>
                    </div>
                </div>

                {/* Top Course */}
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 group hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                                <span className="material-symbols-outlined text-lg text-amber-500">star</span>
                            </div>
                            <span className="text-[11px] font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">Best Seller</span>
                        </div>
                        {totals.topCourse ? (
                            <>
                                <p className="text-lg font-serif font-bold text-neutral-900 dark:text-white truncate">{totals.topCourse.courseTitle}</p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                                    ${((totals.topCourse.revenue || 0)).toFixed(2)} · {totals.topCourse.enrollmentCount} students
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-neutral-400">No courses yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Revenue Breakdown Table */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            <span className="material-symbols-outlined text-base text-neutral-500 dark:text-neutral-400">receipt_long</span>
                        </div>
                        <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                            Revenue by Course
                        </h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800">
                            <tr>
                                {['Course', 'Price', 'Status', 'Enrollments', 'Revenue', '%'].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-[10px] font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">
                                        No earning data available yet.
                                    </td>
                                </tr>
                            ) : (
                                [...payouts]
                                    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                                    .map((course) => {
                                        const share = totals.totalRevenue > 0 ? ((course.revenue || 0) / totals.totalRevenue * 100) : 0;
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
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                                                    {course.price === 0 || !course.price ? 'Free' : `$${course.price}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        course.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            course.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>{course.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{(course.enrollmentCount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                        ${((course.revenue || 0)).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${Math.min(share, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[11px] font-mono text-neutral-400">{share.toFixed(1)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total Row */}
                {payouts.length > 0 && (
                    <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-between items-center">
                        <span className="text-xs font-sans uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Total Earnings</span>
                        <span className="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400">
                            ${(totals.totalRevenue || 0).toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {/* Payout Note */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl text-neutral-400 mt-0.5">info</span>
                    <div>
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">About Payouts</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                            Revenue shown reflects completed orders from your published courses. Payouts are processed monthly and
                            will be sent to your configured payment method. Contact support for payout inquiries or to set up your
                            payment preferences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorPayouts;
