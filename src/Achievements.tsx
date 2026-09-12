const highlights = [
  { value: 'BRAC', label: 'University', text: 'Computer Science and Engineering student at BRAC University' },
  { value: 'Intern', label: 'Experience', text: 'Web design and development internship at Bayshore Communications' },
  { value: '12', label: 'Technologies', text: 'Technology stack featured in the Dev Stack Builder section' },
  { value: '6', label: 'Projects', text: 'Selected academic, development, systems, and research projects' },
]

export default function Achievements() {
  return (
    <section className="portfolio-section achievements-section" id="achievements">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Highlights</p>
          <h2>A few things that <span className="gradient-inline">define my journey</span></h2>
          <p>Education, practical experience, projects, and technologies I have worked with.</p>
        </div>

        <div className="achievement-grid">
          {highlights.map((item) => (
            <article className="achievement-card" key={item.text}>
              <div className="achievement-value">{item.value}</div>
              <div className="achievement-label">{item.label}</div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
