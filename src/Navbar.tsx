import { useState } from 'react'

export default function Navbar() {
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
          Mahir Faysal Metul<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#technologies">Skills & Tech</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions-group">
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
          <a href="#technologies" onClick={closeMenu}>Skills & Tech</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>
      )}
    </header>
  )
}
