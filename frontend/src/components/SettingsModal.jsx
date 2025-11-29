import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Bell, Lock, Moon, Globe, User, CreditCard, Shield } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    notifications: true,
    biometrics: false,
    darkMode: true,
    twoFactor: true,
    emailAlerts: true
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="glass rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Settings
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">NOTIFICATIONS</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span>Push Notifications</span>
                  </div>
                  <button
                    onClick={() => toggleSetting('notifications')}
                    className={`w-12 h-6 rounded-full transition ${
                      settings.notifications ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.notifications ? 24 : 0 }}
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span>Email Alerts</span>
                  </div>
                  <button
                    onClick={() => toggleSetting('emailAlerts')}
                    className={`w-12 h-6 rounded-full transition ${
                      settings.emailAlerts ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.emailAlerts ? 24 : 0 }}
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">SECURITY</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span>Biometrics</span>
                  </div>
                  <button
                    onClick={() => toggleSetting('biometrics')}
                    className={`w-12 h-6 rounded-full transition ${
                      settings.biometrics ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.biometrics ? 24 : 0 }}
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>Two-Factor Auth</span>
                  </div>
                  <button
                    onClick={() => toggleSetting('twoFactor')}
                    className={`w-12 h-6 rounded-full transition ${
                      settings.twoFactor ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.twoFactor ? 24 : 0 }}
                      className="w-5 h-5 bg-white rounded-full m-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">APPEARANCE</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <span>Dark Mode</span>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-12 h-6 rounded-full transition ${
                    settings.darkMode ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.darkMode ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full m-0.5"
                  />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">ACCOUNT</h4>
              <div className="space-y-2">
                <button className="w-full glass rounded-xl p-3 text-left hover:bg-white/5 transition flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>Edit Profile</span>
                </button>
                <button className="w-full glass rounded-xl p-3 text-left hover:bg-white/5 transition flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span>Manage Cards</span>
                </button>
                <button className="w-full glass rounded-xl p-3 text-left hover:bg-red-500/20 transition flex items-center gap-3 text-red-400">
                  <X className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-primary hover:bg-indigo-600 rounded-xl py-3 font-semibold transition"
          >
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
