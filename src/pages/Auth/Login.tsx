import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Milk, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Input } from '../../components/UI/Input'
import { Button } from '../../components/UI/Button'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      console.error('Login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-500 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-scale-in">
        {/* Glass Card */}
        <div className="card-glass backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo with Gradient */}
          <div className="text-center mb-8 animate-slide-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4 shadow-glow transform hover:scale-110 transition-transform duration-300">
              <Milk className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">DairyPro</h1>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Management System</p>
          </div>

          {/* Error Alert with Modern Design */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-slide-up">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="text-white" size={18} />
              </div>
              <span className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@dairy.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 transition-all cursor-pointer"
                />
                <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                  Remember me
                </span>
              </label>

              <Link 
                to="/password-recovery" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Test Credentials</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <span className="text-sm font-mono text-neutral-700 dark:text-neutral-300">
                  admin@dairy.com / admin123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80 drop-shadow-lg">
            © 2024 DairyPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
