import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Lock, Mail } from 'lucide-react'
import { api } from '../services/api'
import { useStore } from '../store/useStore'

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser, setToken } = useStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.login(email, password)
      if (data.token) {
        setToken(data.token)
        setUser(data.user)
      }
    } catch (error) {
      alert('Erro ao fazer login')
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md px-4 sm:px-0"
    >
      <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 glow">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Bem-vindo de volta</h1>
        <p className="text-sm sm:text-base text-gray-400 text-center mb-6 sm:mb-8">Banking reimagined</p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm mb-2 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-light border border-gray-700 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-light border border-gray-700 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-600 active:bg-indigo-700 rounded-xl py-3.5 sm:py-4 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base shadow-lg shadow-primary/30"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base text-gray-400">
          Não tem conta?{' '}
          <button onClick={onSwitch} className="text-primary hover:underline font-medium touch-manipulation">
            Criar conta
          </button>
        </p>
      </div>
    </motion.div>
  )
}
