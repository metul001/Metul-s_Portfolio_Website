import { useState, useMemo } from 'react'
import {
  FiX,
  FiLogOut,
  FiLayers,
  FiBriefcase,
  FiLock,
  FiSearch,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiEdit2,
  FiCheckCircle,
  FiRefreshCw,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import type { Technology } from '../TechnologyCard'
import type { ServiceItem } from '../Services'

interface AdminUser {
  id: number
  email: string
  role: string
}

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
  adminUser: AdminUser | null
  token: string | null
  technologies: Technology[]
  services: ServiceItem[]
  onRefreshData: () => Promise<void>
  onLogout: () => void
}

type TabType = 'techs' | 'services' | 'security'

export default function AdminDashboard({
  isOpen,
  onClose,
  adminUser,
  token,
  technologies,
  services,
  onRefreshData,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('techs')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [updatingId, setUpdatingId] = useState<string | number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // New Tech Modal Form
  const [showAddTechModal, setShowAddTechModal] = useState(false)
  const [newTech, setNewTech] = useState({
    id: '',
    name: '',
    category: 'Frontend',
    description: '',
    icon: '',
    rating: 4.8,
    difficulty: 'Intermediate',
    badge: '',
    is_visible: 1,
  })

  // New/Edit Service Form
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon_name: 'Code',
    featuresText: '',
    badge: '',
    is_visible: 1,
  })

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(technologies.map((t) => t.category)))
    return ['All', ...cats]
  }, [technologies])

  const filteredTechs = useMemo(() => {
    return technologies.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCat =
        selectedCategory === 'All' || tech.category === selectedCategory

      return matchesSearch && matchesCat
    })
  }, [technologies, searchQuery, selectedCategory])

  const visibleCount = technologies.filter((t) => t.is_visible).length
  const hiddenCount = technologies.length - visibleCount

  if (!isOpen) return null

  async function handleRefresh() {
    setRefreshing(true)
    await onRefreshData()
    setRefreshing(false)
    toast.info('Database data synced.')
  }

  // Toggle Tech Visibility
  async function toggleTechVisibility(tech: Technology) {
    if (!token) return
    setUpdatingId(tech.id)

    const nextVisibility = !tech.is_visible

    try {
      const response = await fetch(`/api/technologies/${tech.id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_visible: nextVisibility }),
      })

      if (!response.ok) throw new Error('Failed to update visibility')

      await onRefreshData()
      toast.success(
        `${tech.name} is now ${nextVisibility ? 'VISIBLE' : 'HIDDEN'} on the public site.`
      )
    } catch {
      toast.error(`Could not toggle visibility for ${tech.name}`)
    } finally {
      setUpdatingId(null)
    }
  }

  // Add New Tech
  async function handleAddTech(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !newTech.name) return

    const techId =
      newTech.id.trim() ||
      newTech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    try {
      const response = await fetch('/api/technologies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTech,
          id: techId,
          icon:
            newTech.icon ||
            `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${techId}/${techId}-original.svg`,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to add technology')
      }

      await onRefreshData()
      toast.success(`${newTech.name} added to MySQL stack catalog!`)
      setShowAddTechModal(false)
      setNewTech({
        id: '',
        name: '',
        category: 'Frontend',
        description: '',
        icon: '',
        rating: 4.8,
        difficulty: 'Intermediate',
        badge: '',
        is_visible: 1,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding tech'
      toast.error(msg)
    }
  }

  // Delete Tech
  async function handleDeleteTech(id: string, name: string) {
    if (!token) return
    if (!window.confirm(`Are you sure you want to delete ${name} from the database?`)) return

    try {
      const response = await fetch(`/api/technologies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to delete technology')

      await onRefreshData()
      toast.info(`${name} removed from database.`)
    } catch {
      toast.error('Failed to delete technology')
    }
  }

  // Toggle Service Visibility
  async function toggleServiceVisibility(service: ServiceItem) {
    if (!token) return
    setUpdatingId(service.id)

    const nextVisibility = !service.is_visible

    try {
      const response = await fetch(`/api/services/${service.id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_visible: nextVisibility }),
      })

      if (!response.ok) throw new Error('Failed to update service visibility')

      await onRefreshData()
      toast.success(
        `"${service.title}" is now ${nextVisibility ? 'VISIBLE' : 'HIDDEN'} on the public site.`
      )
    } catch {
      toast.error('Could not toggle service visibility')
    } finally {
      setUpdatingId(null)
    }
  }

  // Add / Edit Service Submit
  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !serviceForm.title || !serviceForm.description) return

    const featuresArray = serviceForm.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const payload = {
        title: serviceForm.title,
        description: serviceForm.description,
        icon_name: serviceForm.icon_name,
        badge: serviceForm.badge,
        features: featuresArray,
        is_visible: serviceForm.is_visible,
      }

      if (editingServiceId) {
        const res = await fetch(`/api/services/${editingServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update service')
        toast.success('Service updated successfully!')
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create service')
        toast.success('Service created successfully!')
      }

      await onRefreshData()
      setShowAddServiceModal(false)
      setEditingServiceId(null)
      setServiceForm({
        title: '',
        description: '',
        icon_name: 'Code',
        featuresText: '',
        badge: '',
        is_visible: 1,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving service'
      toast.error(msg)
    }
  }

  // Delete Service
  async function handleDeleteService(id: number, title: string) {
    if (!token) return
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete service')

      await onRefreshData()
      toast.info(`Service "${title}" deleted.`)
    } catch {
      toast.error('Failed to delete service')
    }
  }

  // Open Edit Service Modal
  function openEditService(s: ServiceItem) {
    setEditingServiceId(s.id)
    setServiceForm({
      title: s.title,
      description: s.description,
      icon_name: s.icon_name || 'Code',
      featuresText: Array.isArray(s.features) ? s.features.join('\n') : '',
      badge: s.badge || '',
      is_visible: s.is_visible ? 1 : 0,
    })
    setShowAddServiceModal(true)
  }

  // Change Password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    setPasswordLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change password')

      toast.success('Admin password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating password'
      toast.error(msg)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            <div className="admin-badge-icon">
              <FiLayers />
            </div>
            <div>
              <h2>DevStack Admin Suite</h2>
              <p className="admin-user-sub">
                Logged in as: <strong>{adminUser?.email}</strong> (Full Access)
              </p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              className="outline-button sync-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Sync latest data from MySQL"
            >
              <FiRefreshCw className={refreshing ? 'spin-icon' : ''} />
              <span>Sync</span>
            </button>
            <button className="logout-btn" onClick={onLogout} title="Log out">
              <FiLogOut /> <span>Logout</span>
            </button>
            <button className="admin-close-btn" onClick={onClose} aria-label="Close Admin Panel">
              <FiX />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="admin-tab-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'techs' ? 'active' : ''}`}
            onClick={() => setActiveTab('techs')}
          >
            <FiLayers /> Tech Stacks & Visibility
            <span className="tab-pill-badge">{technologies.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <FiBriefcase /> Services Provided
            <span className="tab-pill-badge">{services.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock /> Account & MySQL
          </button>
        </nav>

        {/* Tab 1: Tech Stacks Management */}
        {activeTab === 'techs' && (
          <div className="admin-content-area">
            {/* Stats Bar */}
            <div className="admin-stats-row">
              <div className="admin-stat-card">
                <span>Total Technologies</span>
                <strong>{technologies.length}</strong>
              </div>
              <div className="admin-stat-card stat-success">
                <span>Visible to Visitors</span>
                <strong>{visibleCount}</strong>
              </div>
              <div className="admin-stat-card stat-muted">
                <span>Hidden from Visitors</span>
                <strong>{hiddenCount}</strong>
              </div>
              <button
                className="primary-button add-tech-trigger-btn"
                onClick={() => setShowAddTechModal(true)}
              >
                <FiPlus /> Add New Tech Stack
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-controls-bar">
              <div className="admin-search-wrap">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search technologies (e.g. React, MySQL, Docker)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-category-filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Technologies Table / Grid */}
            <div className="admin-tech-table-wrap">
              <table className="admin-tech-table">
                <thead>
                  <tr>
                    <th>Technology</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Difficulty</th>
                    <th>Badge</th>
                    <th>Visibility on Site</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechs.map((tech) => (
                    <tr
                      key={tech.id}
                      className={tech.is_visible ? 'row-visible' : 'row-hidden'}
                    >
                      <td className="tech-name-cell">
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="tech-table-icon"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
                          }}
                        />
                        <div>
                          <strong>{tech.name}</strong>
                          <span className="tech-desc-preview">{tech.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-tag category-tag">{tech.category}</span>
                      </td>
                      <td>⭐ {tech.rating || 4.8}</td>
                      <td>
                        <span className="table-tag difficulty-tag">{tech.difficulty}</span>
                      </td>
                      <td>
                        {tech.badge ? (
                          <span className="table-tag badge-tag">{tech.badge}</span>
                        ) : (
                          <span className="dash-placeholder">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`visibility-toggle-btn ${tech.is_visible ? 'is-visible' : 'is-hidden'}`}
                          onClick={() => toggleTechVisibility(tech)}
                          disabled={updatingId === tech.id}
                          title={tech.is_visible ? 'Click to hide from site' : 'Click to show on site'}
                        >
                          {tech.is_visible ? (
                            <>
                              <FiEye /> <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <FiEyeOff /> <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="table-action-delete"
                          onClick={() => handleDeleteTech(tech.id, tech.name)}
                          title={`Delete ${tech.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTechs.length === 0 && (
                <div className="admin-empty-state">
                  <p>No technologies matched your filter query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Services Management */}
        {activeTab === 'services' && (
          <div className="admin-content-area">
            <div className="admin-services-top">
              <div>
                <h3>Manage Provided Services ({services.length})</h3>
                <p>Customize the services presented to visitors and recruiters.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setEditingServiceId(null)
                  setServiceForm({
                    title: '',
                    description: '',
                    icon_name: 'Code',
                    featuresText: '',
                    badge: '',
                    is_visible: 1,
                  })
                  setShowAddServiceModal(true)
                }}
              >
                <FiPlus /> Add New Service
              </button>
            </div>

            <div className="admin-services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`admin-service-card ${service.is_visible ? '' : 'service-inactive'}`}
                >
                  <div className="admin-service-card-top">
                    <span className="service-icon-label">{service.icon_name}</span>
                    <div className="service-actions">
                      <button
                        className={`visibility-toggle-btn ${service.is_visible ? 'is-visible' : 'is-hidden'}`}
                        onClick={() => toggleServiceVisibility(service)}
                        disabled={updatingId === service.id}
                      >
                        {service.is_visible ? <FiEye /> : <FiEyeOff />}
                        <span>{service.is_visible ? 'Visible' : 'Hidden'}</span>
                      </button>
                      <button
                        className="service-edit-btn"
                        onClick={() => openEditService(service)}
                        title="Edit Service"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="service-delete-btn"
                        onClick={() => handleDeleteService(service.id, service.title)}
                        title="Delete Service"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <h4 className="service-card-title">{service.title}</h4>
                  <p className="service-card-desc">{service.description}</p>

                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="service-features-pills">
                      {service.features.map((f, i) => (
                        <span key={i} className="feature-pill">
                          <FiCheckCircle /> {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Security & MySQL Settings */}
        {activeTab === 'security' && (
          <div className="admin-content-area">
            <div className="admin-security-grid">
              {/* Account Settings */}
              <div className="security-card">
                <h3>Admin Account Details</h3>
                <div className="account-info-box">
                  <div>
                    <label>Admin Email</label>
                    <p>{adminUser?.email}</p>
                  </div>
                  <div>
                    <label>Role</label>
                    <span className="role-tag">Super Admin (All Access)</span>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="change-pass-form">
                  <h4>Change Admin Password</h4>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="primary-button" disabled={passwordLoading}>
                    {passwordLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* MySQL Status */}
              <div className="security-card">
                <h3>MySQL Database Information</h3>
                <div className="db-info-list">
                  <div className="db-info-row">
                    <span>Database Engine:</span>
                    <strong>MySQL / MariaDB</strong>
                  </div>
                  <div className="db-info-row">
                    <span>Database Name:</span>
                    <strong>devstack_portfolio</strong>
                  </div>
                  <div className="db-info-row">
                    <span>Connection Port:</span>
                    <strong>3306</strong>
                  </div>
                  <div className="db-info-row">
                    <span>Technologies Stored:</span>
                    <strong>{technologies.length} records</strong>
                  </div>
                  <div className="db-info-row">
                    <span>Services Stored:</span>
                    <strong>{services.length} records</strong>
                  </div>
                  <div className="db-info-row">
                    <span>Backend Server:</span>
                    <strong>http://localhost:5000</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Tech Stack */}
        {showAddTechModal && (
          <div className="sub-modal-overlay" onClick={() => setShowAddTechModal(false)}>
            <div className="sub-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sub-modal-header">
                <h3>Add New Tech Stack</h3>
                <button onClick={() => setShowAddTechModal(false)}><FiX /></button>
              </div>

              <form onSubmit={handleAddTech} className="sub-modal-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Technology Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. GraphQL, Next.js"
                      value={newTech.name}
                      onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newTech.category}
                      onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Language">Language</option>
                      <option value="Styling">Styling</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of technology..."
                    value={newTech.description}
                    onChange={(e) => setNewTech({ ...newTech, description: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Devicon / SVG URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://... icon.svg"
                      value={newTech.icon}
                      onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Badge Tag (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Top SQL, Modern, Fast"
                      value={newTech.badge}
                      onChange={(e) => setNewTech({ ...newTech, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      value={newTech.difficulty}
                      onChange={(e) => setNewTech({ ...newTech, difficulty: e.target.value })}
                    >
                      <option value="Beginner-Friendly">Beginner-Friendly</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Show on Live Site Immediately?</label>
                    <select
                      value={newTech.is_visible}
                      onChange={(e) => setNewTech({ ...newTech, is_visible: Number(e.target.value) })}
                    >
                      <option value={1}>Yes (Visible to Visitors)</option>
                      <option value={0}>No (Hidden in Admin Only)</option>
                    </select>
                  </div>
                </div>

                <div className="sub-modal-actions">
                  <button type="button" className="outline-button" onClick={() => setShowAddTechModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Save to MySQL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Service */}
        {showAddServiceModal && (
          <div className="sub-modal-overlay" onClick={() => setShowAddServiceModal(false)}>
            <div className="sub-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sub-modal-header">
                <h3>{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setShowAddServiceModal(false)}><FiX /></button>
              </div>

              <form onSubmit={handleServiceSubmit} className="sub-modal-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Full-Stack Web Development"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Icon Type</label>
                    <select
                      value={serviceForm.icon_name}
                      onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })}
                    >
                      <option value="Code">Code (Full Stack / Web)</option>
                      <option value="Server">Server (APIs / Backend)</option>
                      <option value="Database">Database (MySQL / SQL)</option>
                      <option value="Layout">Layout (UI/UX Design)</option>
                      <option value="Cloud">Cloud (DevOps / Deployment)</option>
                      <option value="Zap">Zap (Performance / Speed)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description of the service..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Key Features / Capabilities (1 per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    value={serviceForm.featuresText}
                    onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Badge Highlight (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Most Popular, Core Backend"
                      value={serviceForm.badge}
                      onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Visibility</label>
                    <select
                      value={serviceForm.is_visible}
                      onChange={(e) => setServiceForm({ ...serviceForm, is_visible: Number(e.target.value) })}
                    >
                      <option value={1}>Visible on Public Site</option>
                      <option value={0}>Hidden (Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="sub-modal-actions">
                  <button type="button" className="outline-button" onClick={() => setShowAddServiceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    {editingServiceId ? 'Update Service' : 'Save Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
