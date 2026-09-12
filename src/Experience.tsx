const experiences = [
  {
    title: 'Web Design & Development Intern',
    place: 'Bayshore Communications',
    period: 'Internship',
    description: 'Worked on web design and development tasks while gaining practical experience with real project workflows, responsive interfaces, and website development.',
  },
]

export default function Experience() {
  return (
    <section className="portfolio-section soft-section" id="experience">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Experience</p>
          <h2>Professional <span className="gradient-inline">experience</span></h2>
          <p>Practical experience gained through web design and development work.</p>
        </div>

        <div className="timeline">
          {experiences.map((item) => (
            <article className="timeline-item" key={item.title}>
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.place}</p>
                  </div>
                  <span>{item.period}</span>
                </div>
                <p className="timeline-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
