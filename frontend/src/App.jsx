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
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/25 to-purple-600/25 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [120, 0, 120],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/25 to-primary/25 rounded-full blur-3xl"
          style={{ willChange: 'transform' }}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: '100%'
            }}
          />
        ))}
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
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
    </div>
  )
}
