import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

export default function App() {
  const [isLogin, setIsLogin] = useState(true)
  const { user } = useStore()

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen min-h-screen-safe flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-primary/20 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <Login key="login" onSwitch={() => setIsLogin(false)} />
          ) : (
            <Register key="register" onSwitch={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
