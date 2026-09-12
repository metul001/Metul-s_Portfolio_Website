const projects = [
  {
    number: '01',
    title: 'Explainable AI Product Recommendation Engine',
    type: 'Research / Full-Stack / AI',
    description: 'A research-focused e-commerce recommendation concept combining personalized fashion, body and skin analysis, product suggestions, and explainable AI.',
    tags: ['Explainable AI', 'Recommendation', 'E-Commerce'],
  },
  {
    number: '02',
    title: 'Praetor Online Judge',
    type: 'Team Software Project',
    description: 'An online judge platform project with work around contest registration, problem discovery, solve statistics, submission history, and user-facing application features.',
    tags: ['React', 'Java', 'Testing'],
  },
  {
    number: '03',
    title: 'SimpleFS File System',
    type: 'Operating Systems Project',
    description: 'A small file-system project in C that creates a file-system image, manages blocks and inodes, and supports adding files into the image.',
    tags: ['C', 'File System', 'Operating Systems'],
  },
  {
    number: '04',
    title: '3D OpenGL Robot Battle',
    type: 'Computer Graphics Project',
    description: 'A team-based 3D OpenGL project featuring enemy generation, movement, targeting, firing, explosions, state handling, and game logic.',
    tags: ['OpenGL', 'Python', 'Game Logic'],
  },
  {
    number: '05',
    title: 'Interactive Excel Management Trackers',
    type: 'Excel Automation',
    description: 'Reusable workbooks for loans, payments, pond lease management, summaries, status tracking, formulas, dashboards, and interactive navigation.',
    tags: ['Excel', 'Automation', 'Dashboard'],
  },
  {
    number: '06',
    title: 'Dev Stack Builder',
    type: 'React Frontend Project',
    description: 'A responsive React website that loads technology data from JSON and lets users build a personal development stack with add, remove, and toast interactions.',
    tags: ['React', 'TypeScript', 'Vite'],
  },
]

export default function Projects() {
  return (
    <section className="portfolio-section" id="projects">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Projects</p>
          <h2>Selected <span className="gradient-inline">work</span></h2>
          <p>A mix of academic, research, development, systems, and productivity projects.</p>
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
