import profilePhoto from './assets/profile.jpg'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container portfolio-hero">
        <div className="hero-text">
          <p className="eyebrow">Hello, I am</p>
          <h1>
            Mahir Faysal Metul
            <span className="gradient-text">MERN Stack Developer & CSE Student</span>
          </h1>

          <p className="hero-description">
            Computer Science and Engineering student at BRAC University and Web Development
            Intern at Bayshore Communications. Specializing in MERN stack web applications,
            responsive interfaces with Tailwind CSS, and scalable REST API backend systems.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="primary-button">View My Projects</a>
            <a href="#experience" className="outline-button">View Experience</a>
            <a href="#contact" className="outline-button">Contact Me</a>
          </div>

          <div className="hero-mini-stats">
            <div><strong>BRAC</strong><span>University CSE Student</span></div>
            <div><strong>Intern</strong><span>Bayshore Communications (Sun-Thu)</span></div>
            <div><strong>MERN</strong><span>MongoDB • Express • React • Node</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Developer profile card">
          <div className="profile-orbit orbit-one"></div>
          <div className="profile-orbit orbit-two"></div>
          <div className="profile-card">
            <div className="profile-avatar">
              <img src={profilePhoto} alt="Mahir Faysal Metul" className="profile-img" />
            </div>
            <p className="profile-role">MERN Stack Developer • CSE Student</p>
            <div className="code-window">
              <div className="code-dots"><span></span><span></span><span></span></div>
              <code>
                <span>const developer = {'{'}</span>
                <span>&nbsp;&nbsp;name: &apos;Mahir Faysal Metul&apos;,</span>
                <span>&nbsp;&nbsp;stack: &apos;MERN (Mongo, Express, React, Node)&apos;,</span>
                <span>&nbsp;&nbsp;internship: &apos;Bayshore Communications&apos;,</span>
                <span>&nbsp;&nbsp;schedule: &apos;Sun-Thu (10am-6pm)&apos;</span>
                <span>{'}'}</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
