const projects = [
  {
    number: '01',
    title: 'Explainable AI E-Commerce & Product Recommendation',
    type: 'Full-Stack / AI / E-Commerce',
    description: 'A research-driven e-commerce recommendation system combining personalized product discovery, user profiling, and explainable AI-backed suggestions.',
    tags: ['MERN Stack', 'Explainable AI', 'E-Commerce', 'Node.js'],
  },
  {
    number: '02',
    title: 'Praetor Online Judge & Contest System',
    type: 'Team Software Project',
    description: 'An online judge platform featuring contest registration, problem discovery, solve metrics, submission history, and secure user dashboards.',
    tags: ['React.js', 'Java', 'REST APIs', 'RBAC'],
  },
  {
    number: '03',
    title: 'Full-Stack Interactive DevStack Builder',
    type: 'React & Web Application',
    description: 'A responsive full-stack technology stack curation platform with interactive filtering, state management, custom stack building, and data synchronization.',
    tags: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    number: '04',
    title: 'SimpleFS File System Image Builder',
    type: 'Operating Systems / C',
    description: 'A low-level file-system architecture implementation in C that manages blocks, inodes, and file directory structures within custom file-system images.',
    tags: ['C Language', 'File Systems', 'Data Structures'],
  },
  {
    number: '05',
    title: '3D OpenGL Robot Simulation & Battle',
    type: 'Computer Graphics / Python',
    description: 'Interactive 3D simulation with dynamic entity generation, movement vectors, collision detection, weapon targeting, and state handling.',
    tags: ['OpenGL', 'Python', 'Game Logic', 'Math'],
  },
  {
    number: '06',
    title: 'Interactive Management & Analytics Dashboard',
    type: 'Data & Dashboard Automation',
    description: 'Comprehensive business tracking workbooks with automated payment reconciliation, lease management formulas, summaries, and dashboard navigation.',
    tags: ['Analytics', 'Automation', 'Data Validation'],
  },
]

export default function Projects() {
  return (
    <section className="portfolio-section" id="projects">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Projects</p>
          <h2>Selected <span className="gradient-inline">work</span></h2>
          <p>A curated collection of full-stack web applications, AI research concepts, systems engineering, and tools.</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className="project-number">{project.number}</div>
              <p className="project-type">{project.type}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
