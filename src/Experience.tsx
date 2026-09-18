import { FiClock, FiMail, FiCheckCircle } from 'react-icons/fi'

const experiences = [
  {
    title: 'MERN Stack & Web Development Intern',
    place: 'Bayshore Communications',
    schedule: 'Sun to Thu (10:00 AM – 6:00 PM)',
    hrEmail: 'hr.bayshorecommunication@gmail.com',
    period: 'Internship',
    coreStack: 'MongoDB • Express.js • React.js • Node.js (MERN Stack)',
    summary:
      'Gaining hands-on production experience in full-stack web engineering, building modular client-server applications, developing robust REST APIs, and creating responsive user interfaces.',
    modules: [
      {
        category: 'Web Fundamentals & Frontend',
        details:
          'HTML5, CSS3, Responsive Design, JavaScript (ES6+), DOM/BOM manipulation, React.js, Next.js, TypeScript, and Tailwind CSS with component-based state management.',
      },
      {
        category: 'Backend Architecture & REST APIs',
        details:
          'Developing scalable RESTful APIs using Node.js & Express.js with custom middleware, comprehensive error handling, modular routing, and third-party integrations.',
      },
      {
        category: 'Database Modeling & MongoDB',
        details:
          'Schema design, data validation, relationship mapping, and optimized CRUD operations using MongoDB and Mongoose ODM.',
      },
      {
        category: 'Authentication, Security & Payments',
        details:
          'Implementation of secure login/register flows, session/auth management, Role-Based Access Control (RBAC), secure route protection, and payment gateway integrations with Stripe & SSLCommerz.',
      },
      {
        category: 'UI Systems & AI-Assisted Workflows',
        details:
          'Building reusable accessible components with ShadCN UI & Hero UI, and leveraging modern AI-assisted engineering tools (ChatGPT, Cursor, Claude Code) for debugging, refactoring, and clean code architecture.',
      },
    ],
    skills: [
      'MERN Stack',
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Tailwind CSS',
      'Next.js',
      'TypeScript',
      'REST APIs',
      'Stripe / SSLCommerz',
      'ShadCN UI',
      'AI-Assisted Coding',
    ],
  },
]

export default function Experience() {
  return (
    <section className="portfolio-section soft-section" id="experience">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Experience</p>
          <h2>Professional <span className="gradient-inline">experience</span></h2>
          <p>Practical engineering experience and structured full-stack development competencies.</p>
        </div>

        <div className="timeline">
          {experiences.map((item) => (
            <article className="timeline-item" key={item.title}>
              <div className="timeline-dot"></div>
              <div className="timeline-card experience-rich-card">
                <div className="timeline-top">
                  <div>
                    <h3 className="exp-role-title">{item.title}</h3>
                    <p className="exp-company-name">{item.place}</p>
                  </div>
                  <span className="exp-period-badge">{item.period}</span>
                </div>

                <div className="exp-meta-bar">
                  <span className="exp-meta-item">
                    <FiClock className="exp-meta-icon" />
                    <strong>Schedule:</strong> {item.schedule}
                  </span>
                  <a href={`mailto:${item.hrEmail}`} className="exp-meta-item exp-hr-link">
                    <FiMail className="exp-meta-icon" />
                    <strong>HR Contact:</strong> {item.hrEmail}
                  </a>
                </div>

                <div className="exp-stack-callout">
                  <strong>Core Stack:</strong> {item.coreStack}
                </div>

                <p className="timeline-description exp-summary-text">{item.summary}</p>

                <div className="exp-modules-container">
                  <h4 className="exp-modules-title">Key Responsibilities & Competencies:</h4>
                  <div className="exp-modules-grid">
                    {item.modules.map((mod, idx) => (
                      <div className="exp-module-item" key={idx}>
                        <div className="exp-module-head">
                          <FiCheckCircle className="check-icon" />
                          <strong>{mod.category}</strong>
                        </div>
                        <p>{mod.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="exp-skills-tags">
                  {item.skills.map((skill) => (
                    <span className="exp-skill-pill" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
