import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import CourseDetail from './pages/CourseDetail'
import ActiveCourse from './pages/ActiveCourse'
import VideoWorkspace from './pages/VideoWorkspace'
import QuizWorkspace from './pages/QuizWorkspace'
import QuizResult from './pages/QuizResult'
import CodeWorkspace from './pages/CodeWorkspace'
import LessonDetail from './pages/LessonDetail'
import QuizDetail from './pages/QuizDetail'
import MarketplaceHome from './pages/MarketplaceHome'
import Marketplace from './pages/Marketplace'
import Checkout from './pages/Checkout'
import MyCourses from './pages/MyCourses'
import Problems from './pages/Problems'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import TransactionHistory from './pages/TransactionHistory'
import ProCheckout from './pages/ProCheckout'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MarketplaceHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/learn" element={<Marketplace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/learn/:id" element={<CourseDetail />} />
          <Route path="/my-courses/:courseId" element={<ActiveCourse />} />
          <Route path="/my-courses/:courseId/lesson/:lessonId" element={<VideoWorkspace />} />
          <Route path="/my-courses/:courseId/quiz/:quizId" element={<QuizWorkspace />} />
          <Route path="/my-courses/:courseId/quiz/:quizId/result" element={<QuizResult />} />
          <Route path="/my-courses/:courseId/code/:codeId" element={<CodeWorkspace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/checkout/pro" element={<ProCheckout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/learn/:courseId/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="/learn/:courseId/quiz/:quizId" element={<QuizDetail />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
