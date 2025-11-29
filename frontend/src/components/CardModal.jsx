import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, X, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function CardModal({ isOpen, onClose }) {
  const { cards } = useStore()
  const [showDetails, setShowDetails] = useState({})
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleDetails = (cardId) => {
    setShowDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Meus Cartões
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {cards.length > 0 ? cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">
                      {card.type === 'virtual' ? 'Cartão Virtual' : 'Cartão Físico'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleDetails(card.id)}
                    className="p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    {showDetails[card.id] ? 
                      <EyeOff className="w-4 h-4" /> : 
                      <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Número</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {showDetails[card.id] ? card.number : '**** **** **** ' + (card.number?.slice(-4) || '1234')}
                      </span>
                      <button
                        onClick={() => copyToClipboard(card.number || '**** **** **** 1234')}
                        className="p-1 hover:bg-white/10 rounded transition"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {showDetails[card.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 pt-2 border-t border-gray-700"
                    >
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">CVV</span>
                        <span className="font-mono">{card.cvv || '123'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Validade</span>
                        <span className="font-mono">{card.expiryDate || '12/28'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Limite</span>
                        <span className="font-semibold text-green-400">
                          ${(card.limit || 5000).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-lg py-2 text-sm font-semibold transition">
                    Bloquear
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-sm font-semibold transition">
                    Configurar
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">Nenhum cartão encontrado</p>
                <p className="text-sm text-gray-500">Crie um cartão nas ações rápidas</p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-primary hover:bg-indigo-600 rounded-lg py-2 font-semibold transition"
          >
            Fechar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}