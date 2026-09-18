import { useEffect, useState, useCallback } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Services, { type ServiceItem } from './Services'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Achievements from './Achievements'
import Technologies from './Technologies'
import Contact from './Contact'
import Footer from './Footer'
import type { Technology } from './TechnologyCard'
import './App.css'

export default function App() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch Technologies & Services
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Technologies
      try {
        const techRes = await fetch('/api/technologies')
        if (techRes.ok) {
          const techData = await techRes.json()
          setTechnologies(techData)
        } else {
          const fallback = await fetch('/technologies.json')
          if (fallback.ok) {
            const fallbackData = await fallback.json()
            setTechnologies(fallbackData)
          }
        }
      } catch {
        const fallback = await fetch('/technologies.json')
        if (fallback.ok) {
          const fallbackData = await fallback.json()
          setTechnologies(fallbackData)
        }
      }

      // 2. Fetch Services
      try {
        const servRes = await fetch('/api/services')
        if (servRes.ok) {
          const servData = await servRes.json()
          setServices(servData)
        } else {
          const fallbackServ = await fetch('/services.json')
          if (fallbackServ.ok) {
            const fallbackServData = await fallbackServ.json()
            setServices(fallbackServData)
          }
        }
      } catch {
        const fallbackServ = await fetch('/services.json')
        if (fallbackServ.ok) {
          const fallbackServData = await fallbackServ.json()
          setServices(fallbackServData)
        }
      }
    } catch {
      setError('Could not load portfolio data.')
    } finally {
      setLoading(false)
      setServicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter public visible technologies
  const publicTechnologies = technologies.filter((t) => t.is_visible !== 0 && t.is_visible !== false)

  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services services={services} loading={servicesLoading} />
        <Experience />
        <Projects />
        <Education />
        <Achievements />

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading technologies...</p>
          </div>
        ) : error && publicTechnologies.length === 0 ? (
          <div className="error-state">{error}</div>
        ) : (
          <Technologies technologies={publicTechnologies} />
        )}

        <Contact />
      </main>

      <Footer />
    </>
  )
}
