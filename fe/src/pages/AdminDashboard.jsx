import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminDashboardSidebar from '../components/layout/AdminDashboardSidebar';

// Import tab components
import OverviewTab from '../components/admin/tabs/OverviewTab';
import UsersTab from '../components/admin/tabs/UsersTab';
import RolesTab from '../components/admin/tabs/RolesTab';
import CoursesTab from '../components/admin/tabs/CoursesTab';
import CategoriesTab from '../components/admin/tabs/CategoriesTab';
import SettingsTab from '../components/admin/tabs/SettingsTab';
import InstructorsTab from '../components/admin/tabs/InstructorsTab';
import PaymentsTab from '../components/admin/tabs/PaymentsTab';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const [currentTab, setCurrentTab] = useState(location.state?.tab || 'overview');

  const content = {
    overview: <OverviewTab />,
    users: <UsersTab />,
    roles: <RolesTab />,
    courses: <CoursesTab />,
    categories: <CategoriesTab />,
    instructors: <InstructorsTab />,
    payments: <PaymentsTab />,
    settings: <SettingsTab />,
  };

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab} SidebarComponent={AdminDashboardSidebar}>
      {content[currentTab] || <OverviewTab />}
    </DashboardLayout>
  );
};

export default AdminDashboard;
