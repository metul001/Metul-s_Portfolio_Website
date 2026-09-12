import { useState } from 'react'
import { FiLock, FiMail, FiX, FiKey, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (token: string, user: { id: number; email: string; role: string }) => void
}

type AuthView = 'login' | 'forgot' | 'reset'

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [generatedCodeHint, setGeneratedCodeHint] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function resetForm() {
    setEmail('')
    setPassword('')
    setResetCode('')
    setNewPassword('')
    setGeneratedCodeHint('')
    setView('login')
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function fillDemoCredentials() {
    setEmail('mahirfaysalmetul724@gmail.com')
    setPassword('admin123')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success('Admin authentication successful! Welcome, Mahir.')
      onLoginSuccess(data.token, data.user)
      handleClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your admin email address.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reset code.')
      }

      setGeneratedCodeHint(data.resetCode)
      setResetCode(data.resetCode)
      toast.info(`Reset code generated: ${data.resetCode}`)
      setView('reset')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating reset code'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetCode || !newPassword) {
      toast.error('Please provide the reset code and a new password.')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resetToken: resetCode,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.')
      }

      toast.success('Password updated successfully! You can now log in.')
      setPassword(newPassword)
      setView('login')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resetting password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
          <FiX />
        </button>

        {view === 'login' && (
          <div>
            <div className="auth-header">
              <div className="auth-icon-badge">
                <FiLock />
              </div>
              <h2>Admin Login</h2>
              <p>Manage tech stacks, services, and live site display settings.</p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <div className="input-with-icon">
                  <FiMail className="input-icon" />
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="mahirfaysalmetul724@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="admin-password">Password</label>
                  <button
                    type="button"
                    className="text-link-btn"
                    onClick={() => setView('forgot')}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-with-icon">
                  <FiKey className="input-icon" />
                  <input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>

              <div className="demo-credentials-helper">
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={fillDemoCredentials}
                >
                  ⚡ Auto-fill Admin Credentials
                </button>
                <span className="demo-hint">mahirfaysalmetul724@gmail.com • admin123</span>
              </div>
            </form>
          </div>
        )}

        {view === 'forgot' && (
          <div>
            <button className="back-step-btn" onClick={() => setView('login')}>
              <FiArrowLeft /> Back to Login
            </button>

            <div className="auth-header">
              <div className="auth-icon-badge warning-badge">
                <FiMail />
              </div>
              <h2>Forgot Password</h2>
              <p>Enter your admin email to receive a password reset verification code.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="reset-email">Registered Admin Email</label>
                <div className="input-with-icon">
                  <FiMail className="input-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="mahirfaysalmetul724@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
                {loading ? 'Generating Code...' : 'Get Reset Code'}
              </button>
            </form>
          </div>
        )}

        {view === 'reset' && (
          <div>
            <button className="back-step-btn" onClick={() => setView('forgot')}>
              <FiArrowLeft /> Back
            </button>

            <div className="auth-header">
              <div className="auth-icon-badge success-badge">
                <FiCheck />
              </div>
              <h2>Set New Password</h2>
              <p>Enter the verification code and choose your new password.</p>
            </div>

            {generatedCodeHint && (
              <div className="code-hint-banner">
                <span>Verification Code:</span>
                <strong>{generatedCodeHint}</strong>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="verification-code">Verification Code</label>
                <input
                  id="verification-code"
                  type="text"
                  placeholder="e.g. 849201"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <div className="input-with-icon">
                  <FiKey className="input-icon" />
                  <input
                    id="new-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
                {loading ? 'Updating Password...' : 'Save & Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
