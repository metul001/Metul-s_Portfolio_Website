import profilePhoto from './assets/profile.jpg'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container portfolio-hero">
        <div className="hero-text">
          <p className="eyebrow">Hello, I am</p>
          <h1>
            Mahir Faysal Metul
            <span className="gradient-text">CSE Student & Web Developer</span>
          </h1>

          <p className="hero-description">
            I am a Computer Science and Engineering student at BRAC University.
            I enjoy web design and development, building practical projects, and
            learning modern technologies through hands-on work.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="primary-button">View My Projects</a>
            <a href="#contact" className="outline-button">Contact Me</a>
          </div>

          <div className="hero-mini-stats">
            <div><strong>BRAC</strong><span>University CSE Student</span></div>
            <div><strong>Intern</strong><span>Bayshore Communications</span></div>
            <div><strong>12</strong><span>Technologies in My Stack</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Developer profile card">
          <div className="profile-orbit orbit-one"></div>
          <div className="profile-orbit orbit-two"></div>
          <div className="profile-card">
            <div className="profile-avatar">
              <img src={profilePhoto} alt="Mahir Faysal Metul" className="profile-img" />
            </div>
            <p className="profile-role">Web Developer • CSE Student</p>
            <div className="code-window">
              <div className="code-dots"><span></span><span></span><span></span></div>
              <code>
                <span>const developer = {'{'}</span>
                <span>&nbsp;&nbsp;name: 'Mahir',</span>
                <span>&nbsp;&nbsp;focus: 'Web Development',</span>
                <span>&nbsp;&nbsp;university: 'BRAC'</span>
                <span>{'}'}</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
