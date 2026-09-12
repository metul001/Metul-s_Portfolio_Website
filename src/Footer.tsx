export default function Footer() {
  return (
    <footer className="footer">
      <div className="container portfolio-footer">
        <div>
          <a href="#home" className="portfolio-brand footer-logo">MFM<span>.</span></a>
          <p>Learning, building, and improving through web development and software projects.</p>
        </div>

        <div className="footer-nav">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#technologies">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 Mahir Faysal Metul. Built with React & TypeScript.</p>
        <div className="footer-socials">
          <a href="mailto:mfaysalmetul@gmail.com">Email</a>
          <a href="https://github.com/metul001" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/mahir-faysal-metul-2b2380308/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </div>
    </footer>
  )
}
