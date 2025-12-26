import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import CoreTechnologies from './components/CoreTechnologies'
import CTA from './components/CTA'
import DeveloperLogs from './components/DeveloperLogs'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Modules from './components/Modules'
import Navbar from './components/Navbar'
import PlatformCapabilities from './components/PlatformCapabilities'
import SystemArchitecture from './components/SystemArchitecture'
import Learn from './pages/Learn'
import Login from './pages/Login'
import NewsDetail from './pages/NewsDetail'
import NewsFeed from './pages/NewsFeed'
import Problems from './pages/Problems'
import Signup from './pages/Signup'

function HomePage() {
  return (
    <div className="selection:bg-primary/40 selection:text-white">
      <Navbar />
      <Hero />
      <SystemArchitecture />
      <CoreTechnologies />
      <Modules />
      <PlatformCapabilities />
      <DeveloperLogs />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/problems" element={<Problems />} />
      </Routes>
    </Router>
  )
}

export default App
