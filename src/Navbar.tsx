import { useState } from 'react'
import { FiLock, FiSettings, FiLogOut } from 'react-icons/fi'

interface NavbarProps {
  adminUser?: { id: number; email: string; role: string } | null
  onOpenAuthModal: () => void
  onOpenAdminDashboard: () => void
  onLogout: () => void
}

export default function Navbar({
  adminUser,
  onOpenAuthModal,
  onOpenAdminDashboard,
  onLogout,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <a href="#home" className="portfolio-brand" onClick={closeMenu}>
          MFM<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#technologies">Skills & Stacks</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions-group">
          {adminUser ? (
            <div className="nav-admin-active-wrap">
              <button
                className="nav-admin-badge-btn"
                onClick={onOpenAdminDashboard}
                title="Open Admin Dashboard"
              >
                <FiSettings /> <span>Admin Panel</span>
              </button>
              <button
                className="nav-admin-logout-icon"
                onClick={onLogout}
                title="Log Out"
                aria-label="Log Out"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button
              className="nav-admin-login-btn"
              onClick={onOpenAuthModal}
              title="Admin Login (mahirfaysalmetul724@gmail.com)"
            >
              <FiLock /> <span>Admin</span>
            </button>
          )}

          <a className="nav-contact" href="#contact">Let&apos;s Talk</a>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu container">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#experience" onClick={closeMenu}>Experience</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a href="#education" onClick={closeMenu}>Education</a>
          <a href="#technologies" onClick={closeMenu}>Skills & Stacks</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <div className="mobile-admin-divider">
            {adminUser ? (
              <button
                className="mobile-admin-btn"
                onClick={() => {
                  closeMenu()
                  onOpenAdminDashboard()
                }}
              >
                <FiSettings /> Open Admin Dashboard
              </button>
            ) : (
              <button
                className="mobile-admin-btn"
                onClick={() => {
                  closeMenu()
                  onOpenAuthModal()
                }}
              >
                <FiLock /> Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

