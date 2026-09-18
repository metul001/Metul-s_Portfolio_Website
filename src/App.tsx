import { useEffect, useState, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'
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
  const [selected, setSelected] = useState<Technology[]>([])
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

  function addToStack(technology: Technology) {
    const alreadyAdded = selected.some((item) => item.id === technology.id)

    if (alreadyAdded) {
      toast.warning(`${technology.name} is already in your stack.`)
      return
    }

    setSelected([...selected, technology])
    toast.success(`${technology.name} added to your stack.`)
  }

  function removeFromStack(id: string) {
    const item = selected.find((technology) => technology.id === id)
    setSelected(selected.filter((technology) => technology.id !== id))

    if (item) {
      toast.info(`${item.name} removed from your stack.`)
    }
  }

  function removeAll() {
    if (selected.length === 0) {
      toast.warning('Your stack is already empty.')
      return
    }

    setSelected([])
    toast.info('All technologies removed from your stack.')
  }

  // Filter public visible technologies for the interactive stack builder
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
          <Technologies
            technologies={publicTechnologies}
            selected={selected}
            onAdd={addToStack}
            onRemove={removeFromStack}
            onRemoveAll={removeAll}
          />
        )}

        <Contact />
      </main>

      <Footer />

      <ToastContainer position="top-right" autoClose={2200} />
    </>
  )
}
