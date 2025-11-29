import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Lock, Mail, User, Eye, EyeOff, ArrowRight, Shield, Zap, AlertCircle } from 'lucide-react'
import { api } from '../services/api'
import { useStore } from '../store/useStore'
import { validateEmail, validatePassword } from '../utils/formatters'

export default function Register({ onSwitch }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [errors, setErrors] = useState({})
  const { setUser, setToken } = useStore()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email'
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const data = await api.register(formData)
      if (data.token && data.user) {
        setToken(data.token)
        setUser(data.user)
      }
    } catch (error) {
      console.error('Register error:', error)
      setErrors({ general: error.message || 'Error creating account' })
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md px-4 sm:px-0"
    >
      <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 glow relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="relative"
            >
              <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-primary" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
              />
            </motion.div>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create account
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base text-gray-400 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Shield className="w-4 h-4" />
              Join the future
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.p>
          </div>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm mb-2 font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <motion.input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-light border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition text-base ${
                    errors.name 
                      ? 'border-red-500 ring-2 ring-red-500/20' 
                      : focusedField === 'name' 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20' 
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder="Your full name"
                  required
                  animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <motion.input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-light border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition text-base ${
                    errors.email 
                      ? 'border-red-500 ring-2 ring-red-500/20' 
                      : focusedField === 'email' 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20' 
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder="your@email.com"
                  required
                  animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm mb-2 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-light border rounded-xl pl-11 pr-12 py-3 focus:outline-none transition text-base ${
                    errors.password 
                      ? 'border-red-500 ring-2 ring-red-500/20' 
                      : focusedField === 'password' 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20' 
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder="••••••••"
                  required
                  animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? 
                      <EyeOff key="hide" className="w-4 h-4 text-gray-400" /> : 
                      <Eye key="show" className="w-4 h-4 text-gray-400" />
                    }
                  </AnimatePresence>
                </motion.button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <motion.input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-dark-light border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition text-base ${
                    errors.confirmPassword 
                      ? 'border-red-500 ring-2 ring-red-500/20' 
                      : focusedField === 'confirmPassword' 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20' 
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder="••••••••"
                  required
                  animate={{ scale: focusedField === 'confirmPassword' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl py-3.5 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 relative overflow-hidden mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating account...
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Create account
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <motion.p 
            className="text-center mt-6 text-sm sm:text-base text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Already have an account?{' '}
            <motion.button 
              onClick={onSwitch} 
              className="text-primary hover:underline font-medium touch-manipulation"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}