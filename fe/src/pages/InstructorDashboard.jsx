import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import InstructorDashboardSidebar from '../components/layout/InstructorDashboardSidebar';

// Placeholder tab components - can be expanded later
const OverviewTab = () => <div className="p-8">Instructor Overview</div>;
const CoursesTab = () => <div className="p-8">My Courses CRUD</div>;
const AnalyticsTab = () => <div className="p-8">Analytics</div>;
const PayoutsTab = () => <div className="p-8">Payouts</div>;
const SettingsTab = () => <div className="p-8">Settings</div>;

const InstructorDashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  const isInstructor = useMemo(() => user?.roles?.includes('INSTRUCTOR'), [user]);

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isInstructor) {
      navigate('/');
    }
  }, [isAuthenticated, isInstructor, loading, navigate]);

  const [currentTab, setCurrentTab] = useState('overview');

  const content = {
    overview: <OverviewTab />,
    courses: <CoursesTab />,
    analytics: <AnalyticsTab />,
    payouts: <PayoutsTab />,
    settings: <SettingsTab />,
  };

  // Render nothing or a loading spinner until user role is confirmed
  if (!isInstructor) {
    return null;
  }

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab} SidebarComponent={InstructorDashboardSidebar}>
      {content[currentTab] || <OverviewTab />}
    </DashboardLayout>
  );
};

export default InstructorDashboard;
