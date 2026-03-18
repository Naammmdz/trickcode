import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import CourseDetail from './pages/CourseDetail';
import VideoWorkspace from './pages/VideoWorkspace';
import QuizWorkspace from './pages/QuizWorkspace';
import QuizResult from './pages/QuizResult';
import CodeWorkspace from './pages/CodeWorkspace';
import LessonDetail from './pages/LessonDetail';
import QuizDetail from './pages/QuizDetail';
import MarketplaceHome from './pages/MarketplaceHome';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import PaymentReturn from './pages/PaymentReturn';
import MyCourses from './pages/MyCourses';
import Problems from './pages/Problems';
import Signup from './pages/Signup';
import ActivateAccount from './pages/ActivateAccount';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';
import ProCheckout from './pages/ProCheckout';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminCourseReview from './pages/AdminCourseReview';
import ApplyInstructor from './pages/ApplyInstructor';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
        fontFamily: 'Poppins, Arial, sans-serif',
      }}>
        {/* Header */}
        <header style={{
          width: '100%',
          padding: '1.2rem 2.5rem',
          background: 'rgba(30, 41, 59, 0.7)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '2rem',
          letterSpacing: '2px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #334155',
        }}>
          <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: '2.2rem', letterSpacing: '3px' }}>TrickCode</span>
          <span style={{ color: '#fbbf24', fontWeight: 700, marginLeft: 12 }}>Glass</span>
        </header>
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar */}
          <aside style={{
            width: '240px',
            background: 'rgba(30, 41, 59, 0.35)',
            color: '#fff',
            padding: '2.2rem 1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.7rem',
            minHeight: 'calc(100vh - 90px)',
            borderRight: '1.5px solid #334155',
            backdropFilter: 'blur(12px)',
            boxShadow: '2px 0 16px 0 rgba(56,189,248,0.08)',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.2rem', color: '#38bdf8', letterSpacing: '1px' }}>MENU</div>
            <a href="/" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>🏠 Trang chủ</a>
            <a href="/marketplace" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>🛒 Marketplace</a>
            <a href="/my-courses" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>📚 Khóa học của tôi</a>
            <a href="/profile" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>👤 Hồ sơ</a>
            <a href="/problems" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>💡 Luyện tập</a>
            <a href="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>🛠️ Admin</a>
            <a href="/instructor" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>🎓 Giảng viên</a>
          </aside>
          {/* Main Content */}
          <main style={{
            flex: 1,
            padding: '2.5rem 2rem',
            minHeight: 'calc(100vh - 90px)',
            overflow: 'auto',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '24px',
            margin: '2rem',
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(6px)',
          }}>
            <Router>
              <Routes>
                <Route path="/" element={<MarketplaceHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/activate" element={<ActivateAccount />} />
                <Route path="/account/activate" element={<ActivateAccount />} />
                <Route path="/learn" element={<Marketplace />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/learn/:id" element={<CourseDetail />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/review-course/:courseId" element={<CourseDetail />} />
                <Route path="/admin/review/:courseId" element={<CourseDetail />} />
                <Route path="/admin/review-detail/:courseId" element={<AdminCourseReview />} />
                <Route path="/my-courses/:courseId" element={<CourseDetail />} />
                <Route path="/my-courses/:courseId/lesson/:lessonId" element={<VideoWorkspace />} />
                <Route path="/my-courses/:courseId/quiz/:quizId" element={<QuizWorkspace />} />
                <Route path="/my-courses/:courseId/quiz/:quizId/result" element={<QuizResult />} />
                <Route path="/my-courses/:courseId/code/:codeId" element={<CodeWorkspace />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/return" element={<PaymentReturn />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/checkout/pro" element={<ProCheckout />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/instructor" element={<InstructorDashboard />} />
                <Route path="/apply-instructor" element={<ApplyInstructor />} />
                <Route path="/admin/review/:courseId/lesson/:lessonId" element={<VideoWorkspace />} />
                <Route path="/my-courses/:courseId/lesson/:lessonId" element={<VideoWorkspace />} />
                <Route path="/admin/review/:courseId/quiz/:quizId" element={<QuizWorkspace />} />
                <Route path="/my-courses/:courseId/quiz/:quizId" element={<QuizWorkspace />} />
                <Route path="/my-courses/:courseId/quiz/:quizId/result" element={<QuizResult />} />
                <Route path="/admin/review/:courseId/code/:codeId" element={<CodeWorkspace />} />
                <Route path="/my-courses/:courseId/code/:codeId" element={<CodeWorkspace />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App
