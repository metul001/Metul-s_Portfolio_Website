export default function About() {
  return (
    <section className="portfolio-section about-section" id="about">
      <div className="container two-column-section">
        <div>
          <p className="section-kicker">About Me</p>
          <h2 className="portfolio-title">Building modern web applications with focus and discipline.</h2>
        </div>

        <div className="about-copy">
          <p>
            I am Mahir Faysal Metul, a Computer Science and Engineering student at
            BRAC University and a MERN Stack Web Development Intern at Bayshore
            Communications (Sunday to Thursday, 10:00 AM – 6:00 PM).
          </p>
          <p>
            My engineering foundation is built around modern web standards: HTML5, CSS3,
            Tailwind CSS, and JavaScript (ES6+), advancing into full-stack development with
            React.js, Next.js, Node.js, Express.js, and MongoDB with Mongoose. I focus on clean
            client-server architecture, modular RESTful APIs, secure authentication systems,
            and reliable database schema design.
          </p>
          <p>
            In addition to core programming, I actively leverage modern AI-assisted software
            development workflows (ChatGPT, Cursor, Claude Code) to accelerate prototyping,
            streamline debugging, enforce code quality, and build production-ready applications.
          </p>

          <div className="about-tags">
            <span>MERN Stack</span>
            <span>React.js</span>
            <span>Node.js</span>
            <span>Express.js</span>
            <span>MongoDB</span>
            <span>Next.js</span>
            <span>Tailwind CSS</span>
            <span>TypeScript</span>
            <span>REST APIs</span>
            <span>BetterAuth & Security</span>
            <span>Stripe & SSLCommerz</span>
            <span>AI-Assisted Engineering</span>
          </div>
        </div>
      </div>
    </section>
  )
}
