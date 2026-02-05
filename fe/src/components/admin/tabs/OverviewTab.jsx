import { useEffect, useState } from 'react';
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

  if (loading) {
    return <div className="text-center p-8 text-neutral-500">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-neutral-500">No statistics available.</div>;
  }

  const formattedRecentUsers = stats.recentUsers.map(user => ({
    primaryText: user.login,
    secondaryText: user.email,
    timestamp: user.createdDate,
  }));

  const formattedRecentOrders = stats.recentOrders.map(order => ({
    primaryText: `Order #${order.id} - ${order.courseTitle || 'N/A'}`,
    secondaryText: `${order.userLogin} - ${order.status}`,
    timestamp: order.createdDate,
  }));

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-serif text-neutral-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          A quick glance at your platform's key metrics and recent activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${(stats.totalRevenue || 0).toLocaleString()}`} icon="payments" color="green" />
        <StatCard title="Total Users" value={(stats.totalUsers || 0).toLocaleString()} icon="group" color="blue" />
        <StatCard title="Total Courses" value={(stats.totalCourses || 0).toLocaleString()} icon="school" color="primary" />
        <StatCard title="Pending Courses" value={(stats.pendingCourses || 0).toLocaleString()} icon="pending_actions" color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardChart
          title="Daily Revenue (Last 30 Days)"
          data={chartData?.dailyRevenue || []}
          dataKey="value"
          color="#10b981"
          valueFormatter={(value) => `${(value / 100).toFixed(0)}`}
        />
        <DashboardChart
          title="New Users (Last 30 Days)"
          data={chartData?.dailySignups || []}
          dataKey="value"
          color="#3b82f6"
          valueFormatter={(value) => value.toLocaleString()}
        />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityFeed title="Recent Registrations" items={formattedRecentUsers} icon="person_add" />
        <ActivityFeed title="Recent Orders" items={formattedRecentOrders} icon="receipt_long" />
      </div>
    </div>
  );
};

export default OverviewTab;
