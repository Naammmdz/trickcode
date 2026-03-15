import { useEffect, useState, useMemo } from 'react';
import { adminDashboardService } from '../../../services/adminDashboardService';
import StatCard from '../dashboard/StatCard';
import ActivityFeed from '../dashboard/ActivityFeed';
import DashboardChart from '../dashboard/DashboardChart';
import DashboardPieChart from '../dashboard/DashboardPieChart';

const PERIOD_OPTIONS = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
  { label: '1Y', value: 365 },
];

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState(30);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await adminDashboardService.getStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const chartsData = await adminDashboardService.getChartData(selectedDays);
        setChartData(chartsData);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    fetchCharts();
  }, [selectedDays]);

  const formatUsd = (val) => `$${(Number(val) || 0).toFixed(2)}`;

  const revenueSummary = useMemo(() => {
    if (!chartData?.dailyRevenue?.length) return { total: '$0.00', subtitle: 'Last 30 days' };
    const total = chartData.dailyRevenue.reduce((s, d) => s + (Number(d.value) || 0), 0);
    return {
      total: formatUsd(total),
      subtitle: `${chartData.dailyRevenue.length} days tracked`,
    };
  }, [chartData]);

  const signupSummary = useMemo(() => {
    if (!chartData?.dailyActivity?.length) return { total: '0', subtitle: 'Last 30 days' };
    const total = chartData.dailyActivity.reduce((s, d) => s + (d.value || 0), 0);
    return {
      total: total.toLocaleString(),
      subtitle: `${chartData.dailyActivity.length} days tracked`,
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

  const formattedRecentUsers = (stats.recentUsers || []).map(user => ({
    primaryText: user.login,
    secondaryText: user.email,
    timestamp: user.createdDate,
  }));

  const formattedRecentOrders = (stats.recentOrders || []).map(order => ({
    primaryText: `Order #${order.id} — ${order.courseTitle || 'N/A'}`,
    secondaryText: `${order.userLogin} · ${order.status}`,
    timestamp: order.createdDate,
  }));

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            A quick glance at your platform's key metrics and recent activity.
          </p>
        </div>
        {/* Export Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDays(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedDays === opt.value
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={async () => {
              setExporting(true);
              try { await adminDashboardService.exportExcel(selectedDays); }
              catch (e) { console.error('Export failed:', e); }
              finally { setExporting(false); }
            }}
            disabled={exporting}
            className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">{exporting ? 'hourglass_top' : 'download'}</span>
            {exporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={formatUsd(stats.totalRevenue)}
          icon="payments"
          color="green"
          subtitle="all time (USD)"
        />
        <StatCard
          title="Platform Revenue"
          value={formatUsd(stats.platformCommission)}
          icon="account_balance"
          color="primary"
          subtitle="20% course + 100% subscriptions"
        />
        <StatCard
          title="Instructor Payouts"
          value={formatUsd(stats.instructorPayouts)}
          icon="groups"
          color="blue"
          subtitle="80% of course sales"
        />
        <StatCard
          title="Pro Subscriptions"
          value={formatUsd(stats.subscriptionRevenue)}
          icon="workspace_premium"
          color="yellow"
          subtitle="subscription revenue"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Users"
          value={(stats.totalUsers || 0).toLocaleString()}
          icon="group"
          color="blue"
          subtitle="registered"
        />
        <StatCard
          title="Total Courses"
          value={(stats.totalCourses || 0).toLocaleString()}
          icon="school"
          color="primary"
          subtitle="all statuses"
        />
        <StatCard
          title="Pending Courses"
          value={(stats.pendingCourses || 0).toLocaleString()}
          icon="pending_actions"
          color="yellow"
          subtitle="awaiting review"
        />
      </div>

      {/* Revenue + Signups Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardChart
          title="Daily Revenue"
          data={chartData?.dailyRevenue || []}
          dataKey="value"
          color="#10b981"
          valueFormatter={(value) => formatUsd(value)}
          totalValue={revenueSummary.total}
          subtitle={revenueSummary.subtitle}
        />
        <DashboardChart
          title="New Users"
          data={chartData?.dailyActivity || []}
          dataKey="value"
          color="#3b82f6"
          valueFormatter={(value) => value.toLocaleString()}
          chartType="bar"
          totalValue={signupSummary.total}
          subtitle={signupSummary.subtitle}
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

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityFeed
          title="Recent Registrations"
          items={formattedRecentUsers}
          icon="person_add"
          emptyText="No recent registrations."
        />
        <ActivityFeed
          title="Recent Orders"
          items={formattedRecentOrders}
          icon="receipt_long"
          emptyText="No recent orders."
        />
      </div>
    </div>
  );
};

export default OverviewTab;
