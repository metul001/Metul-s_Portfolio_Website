import bcrypt from 'bcryptjs'
import { getPool } from './db.js'

export const INITIAL_TECHNOLOGIES = [
  // Frontend
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    description: 'A component-based JavaScript library for building modern, reactive user interfaces.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    rating: 4.9,
    difficulty: 'Beginner-Friendly',
    badge: 'Popular',
    is_visible: 1,
    display_order: 1,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend',
    description: 'The React Framework for production with server-side rendering, routing, and static generation.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Full Stack',
    is_visible: 1,
    display_order: 2,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Frontend',
    description: 'A progressive, approachable framework for building engaging web interfaces.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    rating: 4.8,
    difficulty: 'Beginner-Friendly',
    badge: 'Versatile',
    is_visible: 1,
    display_order: 3,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'Frontend',
    description: 'Cybernetically enhanced web apps with ultra-lean runtime and zero virtual DOM overhead.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: 'Blazing Fast',
    is_visible: 1,
    display_order: 4,
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend',
    description: 'A robust enterprise platform and framework for building scalable single-page client applications.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    rating: 4.6,
    difficulty: 'Advanced',
    badge: 'Enterprise',
    is_visible: 0,
    display_order: 5,
  },

  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    description: 'An asynchronous event-driven JavaScript runtime designed to build scalable network applications.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Standard',
    is_visible: 1,
    display_order: 6,
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend',
    description: 'Fast, unopinionated, minimalist web framework for Node.js REST API servers.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    rating: 4.8,
    difficulty: 'Beginner-Friendly',
    badge: 'Core Backend',
    is_visible: 1,
    display_order: 7,
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend',
    description: 'A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: 'Architecture',
    is_visible: 0,
    display_order: 8,
  },
  {
    id: 'django',
    name: 'Django',
    category: 'Backend',
    description: 'High-level Python web framework that encourages rapid development and clean, pragmatic design.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    rating: 4.7,
    difficulty: 'Intermediate',
    badge: 'Batteries-Included',
    is_visible: 0,
    display_order: 9,
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend',
    description: 'Modern, fast (high-performance) Python web framework for building APIs based on standard Python type hints.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'High Speed',
    is_visible: 0,
    display_order: 10,
  },
  {
    id: 'springboot',
    name: 'Spring Boot',
    category: 'Backend',
    description: 'Makes it easy to create stand-alone, production-grade Spring-based Java applications.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
    rating: 4.7,
    difficulty: 'Advanced',
    badge: 'Enterprise',
    is_visible: 0,
    display_order: 11,
  },

  // Databases
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Database',
    description: 'The world\'s most popular open-source relational database management system for structured data.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Primary RDBMS',
    is_visible: 1,
    display_order: 12,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'A powerful, open-source object-relational database system with strong reliability and ACID compliance.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Top SQL',
    is_visible: 1,
    display_order: 13,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    description: 'Leading document-based NoSQL database offering high flexibility, scalability, and performance.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    rating: 4.8,
    difficulty: 'Beginner-Friendly',
    badge: 'NoSQL Leader',
    is_visible: 1,
    display_order: 14,
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Database',
    description: 'In-memory data structure store used as a database, cache, message broker, and streaming engine.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Ultra Cache',
    is_visible: 1,
    display_order: 15,
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'Database',
    description: 'Self-contained, serverless, zero-configuration SQL database engine suited for embedded and testing needs.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
    rating: 4.7,
    difficulty: 'Beginner-Friendly',
    badge: 'Embedded',
    is_visible: 0,
    display_order: 16,
  },

  // Languages
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    description: 'Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Essential',
    is_visible: 1,
    display_order: 17,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Language',
    description: 'The core programming language of the web that drives interactivity and rich front-end capabilities.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    rating: 4.9,
    difficulty: 'Beginner-Friendly',
    badge: 'Ubiquitous',
    is_visible: 1,
    display_order: 18,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Language',
    description: 'An elegant, high-level programming language known for versatility across web, scripts, and AI/ML.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    rating: 4.9,
    difficulty: 'Beginner-Friendly',
    badge: 'Versatile',
    is_visible: 1,
    display_order: 19,
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Language',
    description: 'Robust, concurrent, class-based object-oriented language for enterprise architectures and algorithms.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    rating: 4.7,
    difficulty: 'Intermediate',
    badge: 'Enterprise',
    is_visible: 1,
    display_order: 20,
  },
  {
    id: 'cplusplus',
    name: 'C++',
    category: 'Language',
    description: 'High-performance systems language widely used in competitive programming and computer science foundations.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    rating: 4.7,
    difficulty: 'Advanced',
    badge: 'Core CS',
    is_visible: 0,
    display_order: 21,
  },

  // Styling & UI
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    category: 'Styling',
    description: 'Utility-first CSS framework packed with classes that can be composed to build modern designs directly in markup.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    rating: 4.9,
    difficulty: 'Beginner-Friendly',
    badge: 'Modern UI',
    is_visible: 1,
    display_order: 22,
  },
  {
    id: 'sass',
    name: 'Sass / SCSS',
    category: 'Styling',
    description: 'CSS with superpowers — variables, nested rules, mixins, and modular stylesheets.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
    rating: 4.7,
    difficulty: 'Beginner-Friendly',
    badge: 'CSS Preprocessor',
    is_visible: 0,
    display_order: 23,
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'Styling',
    description: 'Powerful, extensible, and feature-packed frontend toolkit for responsive mobile-first sites.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
    rating: 4.6,
    difficulty: 'Beginner-Friendly',
    badge: 'Classic Toolkit',
    is_visible: 0,
    display_order: 24,
  },

  // Cloud & DevOps & Tools
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    description: 'OS-level virtualization platform for packaging software into isolated, portable containers.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    rating: 4.9,
    difficulty: 'Intermediate',
    badge: 'Containers',
    is_visible: 1,
    display_order: 25,
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'DevOps',
    description: 'Distributed version control system for tracking changes in source code and team collaboration.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    rating: 4.9,
    difficulty: 'Beginner-Friendly',
    badge: 'Standard',
    is_visible: 1,
    display_order: 26,
  },
  {
    id: 'aws',
    name: 'AWS Cloud',
    category: 'DevOps',
    description: 'Comprehensive cloud computing platform offering compute, storage, databases, and deployment services.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: 'Cloud Leader',
    is_visible: 0,
    display_order: 27,
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'DevOps',
    description: 'Google platform providing backend services, real-time database, auth, and cloud hosting.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    rating: 4.8,
    difficulty: 'Beginner-Friendly',
    badge: 'BaaS Platform',
    is_visible: 0,
    display_order: 28,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Backend',
    description: 'Query language for APIs and runtime for executing queries with existing data, reducing over-fetching.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: 'Modern API',
    is_visible: 0,
    display_order: 29,
  },
  {
    id: 'linux',
    name: 'Linux / Bash',
    category: 'DevOps',
    description: 'Open-source Unix-like operating system environment for server deployment, scripting, and management.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: 'System Admin',
    is_visible: 0,
    display_order: 30,
  },
]

export const INITIAL_SERVICES = [
  {
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    description: 'End-to-end web applications crafted with modern React/Next.js frontends and robust Node.js/Express & MySQL backends. Optimized for lightning performance and responsive mobile-first UX.',
    icon_name: 'Code',
    features: JSON.stringify([
      'Custom Single Page Applications (SPA)',
      'Server-Side Rendering (SSR) & Next.js',
      'Interactive State Management',
      'Clean Modular Code Architecture',
    ]),
    badge: 'Most Popular',
    is_visible: 1,
    display_order: 1,
  },
  {
    title: 'Custom RESTful & GraphQL APIs',
    slug: 'custom-api-development',
    description: 'Design and implementation of secure, high-throughput REST and GraphQL APIs with JWT authentication, role-based authorization, rate limiting, and comprehensive endpoint documentation.',
    icon_name: 'Server',
    features: JSON.stringify([
      'Secure Token & JWT Authentication',
      'CRUD Operations & Business Logic',
      'Third-Party API Integrations',
      'Postman & OpenAPI Documentation',
    ]),
    badge: 'Core Backend',
    is_visible: 1,
    display_order: 2,
  },
  {
    title: 'Database Architecture & MySQL Optimization',
    slug: 'database-architecture-mysql',
    description: 'Relational database schema design (MySQL / MariaDB / PostgreSQL), normalization, indexing strategies, complex SQL queries, migrations, and automated backups.',
    icon_name: 'Database',
    features: JSON.stringify([
      'Relational Schema Modeling (ERDs)',
      'Query Indexing & Query Tuning',
      'Data Integrity & Foreign Constraints',
      'Connection Pooling & Caching',
    ]),
    badge: 'Data Layer',
    is_visible: 1,
    display_order: 3,
  },
  {
    title: 'Modern UI/UX & Responsive Design',
    slug: 'ui-ux-responsive-design',
    description: 'Translating Figma & Penpot designs into pixel-perfect, accessible, and responsive user interfaces with fluid animations, micro-interactions, and harmonic color themes.',
    icon_name: 'Layout',
    features: JSON.stringify([
      'Mobile-First Responsive Layouts',
      'Interactive Micro-Animations',
      'Accessible HTML5 & Modern CSS3',
      'Dark / Light Theme Integration',
    ]),
    badge: 'Design & Code',
    is_visible: 1,
    display_order: 4,
  },
  {
    title: 'Cloud Deployment & DevOps Setup',
    slug: 'cloud-deployment-devops',
    description: 'Containerizing full-stack apps with Docker, configuring cloud environments (Vercel, Render, AWS, VPS), and setting up continuous deployment pipelines with Git & GitHub Actions.',
    icon_name: 'Cloud',
    features: JSON.stringify([
      'Docker Containerization',
      'Vercel / Netlify / Render Deployments',
      'CI/CD GitHub Actions Automation',
      'Environment & Secret Management',
    ]),
    badge: 'Production Ready',
    is_visible: 1,
    display_order: 5,
  },
  {
    title: 'Performance & SEO Optimization',
    slug: 'performance-seo-optimization',
    description: 'Supercharging web application loading speed, Lighthouse audit scores, SEO meta configurations, asset compression, and Core Web Vitals compliance.',
    icon_name: 'Zap',
    features: JSON.stringify([
      '90+ Lighthouse Score Audits',
      'Core Web Vitals Optimization',
      'Asset Minification & Lazy Loading',
      'Search Engine Friendly Meta Tags',
    ]),
    badge: 'Speed Boost',
    is_visible: 1,
    display_order: 6,
  },
]

export async function seedDatabase() {
  const pool = getPool()

  try {
    // 1. Seed Admin User
    const adminEmail = 'mahirfaysalmetul724@gmail.com'
    const adminPasswordPlain = 'admin123'

    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail])
    if (existingUsers.length === 0) {
      const passwordHash = await bcrypt.hash(adminPasswordPlain, 10)
      await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [adminEmail, passwordHash, 'admin']
      )
      console.log(`👤 Seeded Admin User: ${adminEmail}`)
    } else {
      // Ensure password hash matches admin123 if previously changed or reset
      const passwordHash = await bcrypt.hash(adminPasswordPlain, 10)
      await pool.query(
        'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
        [passwordHash, 'admin', adminEmail]
      )
      console.log(`👤 Updated/Verified Admin User: ${adminEmail}`)
    }

    // 2. Seed Technologies
    const [existingTechs] = await pool.query('SELECT COUNT(*) as count FROM technologies')
    if (existingTechs[0].count === 0) {
      for (const tech of INITIAL_TECHNOLOGIES) {
        await pool.query(
          `INSERT INTO technologies (id, name, category, description, icon, rating, difficulty, badge, is_visible, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            tech.id,
            tech.name,
            tech.category,
            tech.description,
            tech.icon,
            tech.rating,
            tech.difficulty,
            tech.badge,
            tech.is_visible,
            tech.display_order,
          ]
        )
      }
      console.log(`🚀 Seeded ${INITIAL_TECHNOLOGIES.length} Technologies into MySQL.`)
    }

    // 3. Seed Services
    const [existingServices] = await pool.query('SELECT COUNT(*) as count FROM services')
    if (existingServices[0].count === 0) {
      for (const service of INITIAL_SERVICES) {
        await pool.query(
          `INSERT INTO services (title, slug, description, icon_name, features, badge, is_visible, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            service.title,
            service.slug,
            service.description,
            service.icon_name,
            service.features,
            service.badge,
            service.is_visible,
            service.display_order,
          ]
        )
      }
      console.log(`🛠️ Seeded ${INITIAL_SERVICES.length} Services into MySQL.`)
    }

    console.log('✅ MySQL Database seeding completed.')
  } catch (error) {
    console.error('❌ Error seeding MySQL Database:', error)
    throw error
  }
}

export default {
  seedDatabase,
  INITIAL_TECHNOLOGIES,
  INITIAL_SERVICES,
}
