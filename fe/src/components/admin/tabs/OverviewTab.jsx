import { useEffect, useState, useMemo } from 'react';
import { adminDashboardService } from '../../../services/adminDashboardService';
import StatCard from '../dashboard/StatCard';
import ActivityFeed from '../dashboard/ActivityFeed';
import DashboardChart from '../dashboard/DashboardChart';
import DashboardPieChart from '../dashboard/DashboardPieChart';

const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, chartsData] = await Promise.all([
          adminDashboardService.getStats(),
          adminDashboardService.getChartData(),
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
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          A quick glance at your platform's key metrics and recent activity.
        </p>
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
          data={chartData?.dailySignups || []}
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
