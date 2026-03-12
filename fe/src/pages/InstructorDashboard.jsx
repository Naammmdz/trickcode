import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import InstructorDashboardSidebar from '../components/layout/InstructorDashboardSidebar';
import InstructorOverview from '../components/instructor/InstructorOverview';
import InstructorCourses from '../components/instructor/InstructorCourses';
import InstructorAnalytics from '../components/instructor/InstructorAnalytics';
import InstructorPayouts from '../components/instructor/InstructorPayouts';

const SettingsTab = () => (
  <div className="p-8">
    <h2 className="text-3xl font-serif text-neutral-900 dark:text-white mb-2">Settings</h2>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">Coming soon.</p>
  </div>
);

const InstructorDashboard = () => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  const isInstructor = useMemo(() => hasRole('ROLE_INSTRUCTOR'), [hasRole, user]);

  useEffect(() => {
    if (loading) return;

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
    overview: <InstructorOverview onTabChange={setCurrentTab} />,
    courses: <InstructorCourses />,
    analytics: <InstructorAnalytics />,
    payouts: <InstructorPayouts />,
    settings: <SettingsTab />,
  };

  if (!isInstructor) {
    return null;
  }

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab} SidebarComponent={InstructorDashboardSidebar}>
      {content[currentTab] || <InstructorOverview onTabChange={setCurrentTab} />}
    </DashboardLayout>
  );
};

export default InstructorDashboard;
