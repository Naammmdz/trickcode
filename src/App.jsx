import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import CoreTechnologies from './components/landing/CoreTechnologies'
import CTA from './components/landing/CTA'
import DeveloperLogs from './components/landing/DeveloperLogs'
import FAQ from './components/landing/FAQ'
import Footer from './components/layout/Footer'
import Hero from './components/landing/Hero'
import Modules from './components/landing/Modules'
import Navbar from './components/layout/Navbar'
import PlatformCapabilities from './components/landing/PlatformCapabilities'
import SystemArchitecture from './components/landing/SystemArchitecture'
import Learn from './pages/Learn'
import Login from './pages/Login'
import NewsDetail from './pages/NewsDetail'
import NewsFeed from './pages/NewsFeed'
import Contests from './pages/Contests'
import Problems from './pages/Problems'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

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
      <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
        <SystemArchitecture />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
        <CoreTechnologies />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
        <Modules />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
        <PlatformCapabilities />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
        <DeveloperLogs />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
        <FAQ />
      </div>
      <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
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
        <Route path="/contests" element={<Contests />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
