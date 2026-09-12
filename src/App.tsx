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
import AuthModal from './admin/AuthModal'
import AdminDashboard from './admin/AdminDashboard'
import type { Technology } from './TechnologyCard'
import './App.css'

interface AdminUser {
  id: number
  email: string
  role: string
}

export default function App() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selected, setSelected] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [error, setError] = useState('')

  // Admin Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('devstack_admin_token'))
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('devstack_admin_user')
    return saved ? JSON.parse(saved) : null
  })

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false)

  // Fetch Technologies & Services
  const fetchData = useCallback(async () => {
    try {
      const headers: HeadersInit = {}
      const savedToken = localStorage.getItem('devstack_admin_token')
      if (savedToken) {
        headers['Authorization'] = `Bearer ${savedToken}`
      }

      // 1. Fetch Techs (all for admin, visible for public)
      const techUrl = savedToken ? '/api/technologies?all=true' : '/api/technologies'
      const techRes = await fetch(techUrl, { headers })

      if (techRes.ok) {
        const techData = await techRes.json()
        setTechnologies(techData)
      } else {
        // Fallback to static technologies.json if server is still starting
        const fallback = await fetch('/technologies.json')
        if (fallback.ok) {
          const fallbackData = await fallback.json()
          setTechnologies(fallbackData)
        }
      }

      // 2. Fetch Services
      const servUrl = savedToken ? '/api/services?all=true' : '/api/services'
      const servRes = await fetch(servUrl, { headers })
      if (servRes.ok) {
        const servData = await servRes.json()
        setServices(servData)
      }
    } catch {
      setError('Could not connect to database API. Retrying...')
    } finally {
      setLoading(false)
      setServicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Login handler
  function handleLoginSuccess(newToken: string, user: AdminUser) {
    setToken(newToken)
    setAdminUser(user)
    localStorage.setItem('devstack_admin_token', newToken)
    localStorage.setItem('devstack_admin_user', JSON.stringify(user))
    fetchData()
    setAdminDashboardOpen(true)
  }

  // Logout handler
  function handleLogout() {
    setToken(null)
    setAdminUser(null)
    localStorage.removeItem('devstack_admin_token')
    localStorage.removeItem('devstack_admin_user')
    setAdminDashboardOpen(false)
    toast.info('Logged out from admin panel.')
    fetchData()
  }

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
      <Navbar
        adminUser={adminUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        onLogout={handleLogout}
      />

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
            <p>Loading technologies from MySQL database...</p>
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

      {/* Admin Auth Modal (Login & Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Panel */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        adminUser={adminUser}
        token={token}
        technologies={technologies}
        services={services}
        onRefreshData={fetchData}
        onLogout={handleLogout}
      />

      <ToastContainer position="top-right" autoClose={2200} />
    </>
  )
}
