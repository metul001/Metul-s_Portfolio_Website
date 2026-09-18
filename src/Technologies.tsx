import TechnologyCard from './TechnologyCard'
import type { Technology } from './TechnologyCard'

type Props = {
  technologies: Technology[]
}

export default function Technologies({ technologies }: Props) {
  return (
    <section className="technologies-section" id="technologies">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Skills & Technologies</p>
          <h2>Core Technical <span className="gradient-inline">Stack & Tools</span></h2>
          <p>Languages, frameworks, databases, and libraries used to build reliable and responsive applications.</p>
        </div>

        <div className="technology-grid">
          {technologies.map((technology) => (
            <TechnologyCard
              key={technology.id}
              technology={technology}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
