export type Technology = {
  id: string
  name: string
  category: string
  description: string
  icon: string
  rating: number
  difficulty: string
  badge: string
  is_visible?: number | boolean
  display_order?: number
}

type Props = {
  technology: Technology
}

export default function TechnologyCard({ technology }: Props) {
  return (
    <article className="technology-card">
      <div className="card-top">
        <img src={technology.icon} alt={`${technology.name} logo`} />
        <span className="badge">{technology.badge}</span>
      </div>

      <h3>{technology.name}</h3>
      <p className="technology-description">{technology.description}</p>

      <div className="technology-info">
        <span className="category">{technology.category}</span>
        <span>{technology.difficulty}</span>
        <span className="rating">★ {technology.rating}</span>
      </div>
    </article>
  )
}
