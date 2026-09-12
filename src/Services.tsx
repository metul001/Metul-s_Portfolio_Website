import { FiCode, FiServer, FiDatabase, FiLayout, FiCloud, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

export interface ServiceItem {
  id: number
  title: string
  slug: string
  description: string
  icon_name: string
  features: string[]
  badge?: string
  is_visible: number | boolean
  display_order: number
}

interface ServicesProps {
  services: ServiceItem[]
  loading?: boolean
}

const iconMap: Record<string, typeof FiCode> = {
  Code: FiCode,
  Server: FiServer,
  Database: FiDatabase,
  Layout: FiLayout,
  Cloud: FiCloud,
  Zap: FiZap,
}

export default function Services({ services, loading }: ServicesProps) {
  if (loading) {
    return (
      <section className="portfolio-section services-section" id="services">
        <div className="container">
          <div className="section-heading portfolio-heading">
            <p className="section-kicker">Services</p>
            <h2>What I <span className="gradient-inline">Offer & Build</span></h2>
            <p>Loading available engineering services...</p>
          </div>
          <div className="services-loading-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="service-card skeleton-card"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const visibleServices = services.filter((s) => s.is_visible)

  return (
    <section className="portfolio-section services-section" id="services">
      <div className="container">
        <div className="section-heading portfolio-heading">
          <p className="section-kicker">Services</p>
          <h2>
            What I <span className="gradient-inline">Offer & Build</span>
          </h2>
          <p>
            Comprehensive full-stack web engineering, database architecture, and performance-driven solutions tailored for modern digital products.
          </p>
        </div>

        <div className="services-grid">
          {visibleServices.map((service, index) => {
            const IconComponent = iconMap[service.icon_name] || FiCode
            const features = Array.isArray(service.features)
              ? service.features
              : []

            return (
              <div className="service-card" key={service.id || index}>
                <div className="service-card-header">
                  <div className="service-icon-wrap">
                    <IconComponent className="service-icon" />
                  </div>
                  {service.badge && (
                    <span className="service-badge">{service.badge}</span>
                  )}
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>

                {features.length > 0 && (
                  <div className="service-features">
                    <div className="service-features-title">Key Capabilities:</div>
                    <ul className="service-feature-list">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="service-feature-item">
                          <FiCheckCircle className="check-icon" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="service-card-footer">
                  <a href="#contact" className="service-cta-link">
                    <span>Discuss this service</span>
                    <FiArrowRight className="arrow-icon" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="services-banner">
          <div className="services-banner-content">
            <h3>Have a customized requirement or project in mind?</h3>
            <p>I can help design, develop, and deploy your web solution from concept to production.</p>
          </div>
          <a href="#contact" className="primary-button">
            Let&apos;s Build Together
          </a>
        </div>
      </div>
    </section>
  )
}
