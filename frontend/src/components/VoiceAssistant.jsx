import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X, Volume2 } from 'lucide-react'

export default function VoiceAssistant({ isOpen, onClose }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')

  const startListening = () => {
    setListening(true)
    setTimeout(() => {
      setTranscript('Qual é o meu saldo atual?')
      setTimeout(() => {
        setResponse('Seu saldo total é de R$ 15.420,50 distribuído em 2 contas.')
        setListening(false)
      }, 1500)
    }, 2000)
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
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={listening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              listening ? 'bg-red-500' : 'bg-purple-500'
            }`}
          >
            <Mic className="w-12 h-12 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold mb-2">Assistente de Voz</h3>
          <p className="text-gray-400 mb-6">
            {listening ? 'Ouvindo...' : 'Toque no microfone para falar'}
          </p>

          {transcript && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4">
              <p className="text-sm text-blue-400">Você: {transcript}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
              <p className="text-sm text-green-400">Assistente: {response}</p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={startListening}
              disabled={listening}
              className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-full p-4"
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
            <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 rounded-full p-4">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
