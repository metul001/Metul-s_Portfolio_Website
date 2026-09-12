const education = [
  {
    degree: 'B.Sc. in Computer Science and Engineering',
    institute: 'BRAC University',
    period: 'Ongoing',
    note: 'Studying Computer Science and Engineering with a focus on software development, problem solving, algorithms, systems, and project-based learning.',
  },
]

export default function Education() {
  return (
    <section className="portfolio-section soft-section" id="education">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Education</p>
          <h2>My academic <span className="gradient-inline">journey</span></h2>
        </div>

        <div className="education-grid">
          {education.map((item) => (
            <article className="education-card" key={item.degree}>
              <div className="education-icon">⌁</div>
              <span className="education-period">{item.period}</span>
              <h3>{item.degree}</h3>
              <h4>{item.institute}</h4>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
