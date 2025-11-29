import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, ArrowRight, CreditCard, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatCurrency } from '../utils/formatters'

export default function TransferModal({ isOpen, onClose }) {
  const { accounts, addTransaction, setAccounts } = useStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    recipientInfo: ''
  })

  const handleTransfer = async () => {
    if (!transferData.fromAccount || !transferData.amount || !transferData.toAccount) {
      setError('Preencha todos os campos obrigatórios')
      return
    }
    
    const amount = parseFloat(transferData.amount)
    if (amount <= 0) {
      setError('Valor deve ser maior que zero')
      return
    }
    
    const fromAccount = accounts.find(acc => acc.id == transferData.fromAccount)
    if (!fromAccount || fromAccount.balance < amount) {
      setError('Saldo insuficiente')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Simular delay da transferência
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar saldo da conta
      const updatedAccounts = accounts.map(acc => 
        acc.id == transferData.fromAccount 
          ? { ...acc, balance: acc.balance - amount }
          : acc
      )
      setAccounts(updatedAccounts)
      
      // Adicionar transação
      addTransaction({
        type: 'expense',
        amount: -amount,
        description: `Transferência ${transferData.toAccount.toUpperCase()} - ${transferData.description || 'Sem descrição'}`,
        category: 'transfer'
      })
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        resetModal()
      }, 2000)
      
    } catch (error) {
      setError('Erro ao processar transferência')
    } finally {
      setLoading(false)
    }
  }
  
  const resetModal = () => {
    setStep(1)
    setSuccess(false)
    setError('')
    setTransferData({ fromAccount: '', toAccount: '', amount: '', description: '', recipientInfo: '' })
  }

  if (!isOpen) return null
  
  if (success) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-8 max-w-md w-full text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Transferência Realizada!</h3>
            <p className="text-gray-400 mb-4">
              {formatCurrency(parseFloat(transferData.amount))} transferido com sucesso
            </p>
            <div className="w-full bg-green-500/20 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="bg-green-500 h-1 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

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
              <Send className="w-5 h-5 text-green-400" />
              Transferir
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-2 font-medium">De qual conta?</label>
                <select
                  value={transferData.fromAccount}
                  onChange={(e) => setTransferData({...transferData, fromAccount: e.target.value})}
                  className="w-full bg-dark-light border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-primary transition"
                >
                  <option value="">Selecione uma conta</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.type === 'checking' ? 'Conta Corrente' : 'Poupança'} - ${account.balance?.toLocaleString() || '0'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium">Valor</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                    className="w-full bg-dark-light border border-gray-700 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-primary transition"
                    placeholder="0.00"
                  />
                </div>
                {transferData.fromAccount && (
                  <p className="text-xs text-gray-400 mt-1">
                    Saldo disponível: {formatCurrency(accounts.find(acc => acc.id == transferData.fromAccount)?.balance || 0)}
                  </p>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!transferData.fromAccount || !transferData.amount}
                className="w-full bg-primary hover:bg-indigo-600 disabled:opacity-50 rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-2 font-medium">Para onde?</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setTransferData({...transferData, toAccount: 'pix'})}
                    className={`w-full p-3 rounded-xl border transition flex items-center gap-3 ${
                      transferData.toAccount === 'pix' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <User className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">PIX</p>
                      <p className="text-xs text-gray-400">Transferência instantânea</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setTransferData({...transferData, toAccount: 'ted'})}
                    className={`w-full p-3 rounded-xl border transition flex items-center gap-3 ${
                      transferData.toAccount === 'ted' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <p className="font-semibold">TED</p>
                      <p className="text-xs text-gray-400">Transferência bancária</p>
                    </div>
                  </button>
                </div>
              </div>

              {transferData.toAccount && (
                <div>
                  <label className="block text-sm mb-2 font-medium">
                    {transferData.toAccount === 'pix' ? 'Chave PIX' : 'Dados bancários'}
                  </label>
                  <input
                    type="text"
                    value={transferData.recipientInfo}
                    onChange={(e) => setTransferData({...transferData, recipientInfo: e.target.value})}
                    className="w-full bg-dark-light border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-primary transition"
                    placeholder={transferData.toAccount === 'pix' ? 'email@exemplo.com ou CPF' : 'Banco, agência, conta'}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2 font-medium">Descrição (opcional)</label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) => setTransferData({...transferData, description: e.target.value})}
                  className="w-full bg-dark-light border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-primary transition"
                  placeholder="Ex: Pagamento aluguel"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-3 font-semibold transition"
                >
                  Voltar
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferData.toAccount || !transferData.recipientInfo || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processando...
                    </>
                  ) : (
                    'Transferir'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}