import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useEffect } from 'react'
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    const sections = document.querySelectorAll('.scroll-reveal')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div className="selection:bg-primary/40 selection:text-white">
      <Navbar />
      <Hero />
      <div className="scroll-reveal" style={{transitionDelay: '0.1s'}}>
        <SystemArchitecture />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.2s'}}>
        <CoreTechnologies />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.1s'}}>
        <Modules />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.2s'}}>
        <PlatformCapabilities />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.1s'}}>
        <DeveloperLogs />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.2s'}}>
        <FAQ />
      </div>
      <div className="scroll-reveal" style={{transitionDelay: '0.1s'}}>
        <CTA />
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router basename="/trickcode">
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
