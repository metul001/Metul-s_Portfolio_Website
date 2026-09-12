import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { initDatabase, getPool } from './db.js'
import { seedDatabase } from './seed.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'devstack_portfolio_jwt_secret_key_2026_super_secure'

app.use(cors())
app.use(express.json())

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' })
    }
    req.user = user
    next()
  })
}

// Optional Auth Middleware (attaches user if present)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    req.user = null
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user
    }
    next()
  })
}

// --- Health Check ---
app.get('/api/health', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT 1 as connected')
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// ==========================================
// 🔐 AUTHENTICATION ENDPOINTS
// ==========================================

// 1. Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const pool = getPool()
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error during login.' })
  }
})

// 2. Forgot Password - Request Reset Code / Token
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' })
    }

    const pool = getPool()
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])

    if (users.length === 0) {
      return res.status(404).json({ error: 'No account found with this email address.' })
    }

    // Generate a 6-digit verification code and a secure token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const resetToken = crypto.randomBytes(24).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [`${resetCode}:${resetToken}`, expiresAt, email.toLowerCase().trim()]
    )

    // Return the reset token / code to the client (with simulation for direct reset UI)
    res.json({
      message: 'Password reset code generated successfully.',
      resetCode,
      resetToken: `${resetCode}:${resetToken}`,
      expiresInMinutes: 60,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Failed to process forgot password request.' })
  }
})

// 3. Reset Password with Token / Code
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }

    const pool = getPool()
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const user = users[0]

    // Verify token if provided, or allow reset if token matches
    if (user.reset_token) {
      if (resetToken && !user.reset_token.includes(resetToken) && user.reset_token !== resetToken) {
        return res.status(400).json({ error: 'Invalid or expired reset code/token.' })
      }

      if (user.reset_token_expires && new Date() > new Date(user.reset_token_expires)) {
        return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' })
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await pool.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
      [passwordHash, email.toLowerCase().trim()]
    )

    res.json({ message: 'Password has been successfully updated. You can now login.' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Failed to reset password.' })
  }
})

// 4. Authenticated Change Password
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' })
    }

    const pool = getPool()
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id])

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const user = users[0]
    const valid = await bcrypt.compare(currentPassword, user.password_hash)

    if (!valid) {
      return res.status(400).json({ error: 'Incorrect current password.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, user.id])

    res.json({ message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to update password.' })
  }
})

// 5. Get Current Authenticated User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool()
    const [users] = await pool.query('SELECT id, email, role, created_at FROM users WHERE id = ?', [req.user.id])

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    res.json({ user: users[0] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user session.' })
  }
})

// ==========================================
// 💻 TECHNOLOGIES ENDPOINTS
// ==========================================

// 1. Get Technologies (Visitors get visible only; Admin with ?all=true gets all)
app.get('/api/technologies', optionalAuth, async (req, res) => {
  try {
    const pool = getPool()
    const showAll = req.query.all === 'true' && req.user

    let query = 'SELECT * FROM technologies'
    if (!showAll) {
      query += ' WHERE is_visible = 1'
    }
    query += ' ORDER BY display_order ASC, id ASC'

    const [technologies] = await pool.query(query)
    res.json(technologies)
  } catch (error) {
    console.error('Error fetching technologies:', error)
    res.status(500).json({ error: 'Failed to fetch technologies.' })
  }
})

// 2. Toggle Technology Visibility (Admin only)
app.patch('/api/technologies/:id/visibility', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { is_visible } = req.body

    const pool = getPool()
    const [result] = await pool.query(
      'UPDATE technologies SET is_visible = ? WHERE id = ?',
      [is_visible ? 1 : 0, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Technology not found.' })
    }

    const [updated] = await pool.query('SELECT * FROM technologies WHERE id = ?', [id])
    res.json({ message: 'Visibility updated', technology: updated[0] })
  } catch (error) {
    console.error('Error toggling visibility:', error)
    res.status(500).json({ error: 'Failed to update visibility.' })
  }
})

// 3. Create Technology (Admin only)
app.post('/api/technologies', authenticateToken, async (req, res) => {
  try {
    const { id, name, category, description, icon, rating, difficulty, badge, is_visible, display_order } = req.body

    if (!id || !name || !category) {
      return res.status(400).json({ error: 'ID, Name, and Category are required.' })
    }

    const pool = getPool()
    await pool.query(
      `INSERT INTO technologies (id, name, category, description, icon, rating, difficulty, badge, is_visible, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id.toLowerCase().replace(/\s+/g, '-'),
        name,
        category,
        description || '',
        icon || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        rating ? parseFloat(rating) : 4.8,
        difficulty || 'Beginner-Friendly',
        badge || '',
        is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
        display_order || 0,
      ]
    )

    const [newTech] = await pool.query('SELECT * FROM technologies WHERE id = ?', [id.toLowerCase().replace(/\s+/g, '-')])
    res.status(201).json(newTech[0])
  } catch (error) {
    console.error('Error creating technology:', error)
    res.status(500).json({ error: 'Failed to create technology. (ID may already exist)' })
  }
})

// 4. Update Technology (Admin only)
app.put('/api/technologies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, description, icon, rating, difficulty, badge, is_visible, display_order } = req.body

    const pool = getPool()
    const [result] = await pool.query(
      `UPDATE technologies 
       SET name = ?, category = ?, description = ?, icon = ?, rating = ?, difficulty = ?, badge = ?, is_visible = ?, display_order = ?
       WHERE id = ?`,
      [
        name,
        category,
        description,
        icon,
        rating ? parseFloat(rating) : 4.8,
        difficulty,
        badge,
        is_visible ? 1 : 0,
        display_order || 0,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Technology not found.' })
    }

    const [updated] = await pool.query('SELECT * FROM technologies WHERE id = ?', [id])
    res.json(updated[0])
  } catch (error) {
    console.error('Error updating technology:', error)
    res.status(500).json({ error: 'Failed to update technology.' })
  }
})

// 5. Delete Technology (Admin only)
app.delete('/api/technologies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const pool = getPool()
    const [result] = await pool.query('DELETE FROM technologies WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Technology not found.' })
    }

    res.json({ message: 'Technology deleted successfully.' })
  } catch (error) {
    console.error('Error deleting technology:', error)
    res.status(500).json({ error: 'Failed to delete technology.' })
  }
})

// ==========================================
// 🛠️ SERVICES ENDPOINTS
// ==========================================

// 1. Get Services (Visitors get visible only; Admin with ?all=true gets all)
app.get('/api/services', optionalAuth, async (req, res) => {
  try {
    const pool = getPool()
    const showAll = req.query.all === 'true' && req.user

    let query = 'SELECT * FROM services'
    if (!showAll) {
      query += ' WHERE is_visible = 1'
    }
    query += ' ORDER BY display_order ASC, id ASC'

    const [services] = await pool.query(query)

    // Parse JSON features if stringified
    const formattedServices = services.map((s) => {
      let parsedFeatures = []
      try {
        parsedFeatures = typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || [])
      } catch {
        parsedFeatures = []
      }
      return { ...s, features: parsedFeatures }
    })

    res.json(formattedServices)
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({ error: 'Failed to fetch services.' })
  }
})

// 2. Toggle Service Visibility (Admin only)
app.patch('/api/services/:id/visibility', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { is_visible } = req.body

    const pool = getPool()
    const [result] = await pool.query('UPDATE services SET is_visible = ? WHERE id = ?', [is_visible ? 1 : 0, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found.' })
    }

    res.json({ message: 'Service visibility updated' })
  } catch (error) {
    console.error('Error toggling service visibility:', error)
    res.status(500).json({ error: 'Failed to update service visibility.' })
  }
})

// 3. Create Service (Admin only)
app.post('/api/services', authenticateToken, async (req, res) => {
  try {
    const { title, slug, description, icon_name, features, badge, is_visible, display_order } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' })
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : [features].filter(Boolean))

    const pool = getPool()
    const [result] = await pool.query(
      `INSERT INTO services (title, slug, description, icon_name, features, badge, is_visible, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        finalSlug,
        description,
        icon_name || 'Code',
        featuresJson,
        badge || '',
        is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
        display_order || 0,
      ]
    )

    const [newService] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId])
    res.status(201).json(newService[0])
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ error: 'Failed to create service.' })
  }
})

// 4. Update Service (Admin only)
app.put('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, description, icon_name, features, badge, is_visible, display_order } = req.body

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : [features].filter(Boolean))

    const pool = getPool()
    const [result] = await pool.query(
      `UPDATE services 
       SET title = ?, slug = ?, description = ?, icon_name = ?, features = ?, badge = ?, is_visible = ?, display_order = ?
       WHERE id = ?`,
      [
        title,
        slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        icon_name || 'Code',
        featuresJson,
        badge || '',
        is_visible ? 1 : 0,
        display_order || 0,
        id,
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found.' })
    }

    const [updated] = await pool.query('SELECT * FROM services WHERE id = ?', [id])
    res.json(updated[0])
  } catch (error) {
    console.error('Error updating service:', error)
    res.status(500).json({ error: 'Failed to update service.' })
  }
})

// 5. Delete Service (Admin only)
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const pool = getPool()
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found.' })
    }

    res.json({ message: 'Service deleted successfully.' })
  } catch (error) {
    console.error('Error deleting service:', error)
    res.status(500).json({ error: 'Failed to delete service.' })
  }
})

// Start Server & Database
async function startServer() {
  try {
    await initDatabase()
    await seedDatabase()

    app.listen(PORT, () => {
      console.log(`🚀 DevStack API Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
