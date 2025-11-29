import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Send, TrendingUp, Wallet, LogOut, Plus, Eye, EyeOff, Zap, Shield, Brain } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'
import { api } from '../services/api'

export default function Dashboard() {
  const { user, token, accounts, cards, setAccounts, setCards, logout } = useStore()
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const accountsData = await api.getAccounts(token)
      if (accountsData.accounts) setAccounts(accountsData.accounts)
    } catch (error) {
      console.error('Erro ao carregar dados')
    }
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    try {
      const data = await api.createAccount(token, {
        user_id: user.id,
        currency: 'USD',
        type: 'checking'
      })
      if (data.account) {
        setAccounts([...accounts, data.account])
        alert('Conta criada com sucesso!')
      }
    } catch (error) {
      alert('Erro ao criar conta')
    }
    setLoading(false)
  }

  const handleCreateCard = async () => {
    if (accounts.length === 0) {
      alert('Crie uma conta primeiro')
      return
    }
    setLoading(true)
    try {
      const data = await api.createCard(token, {
        account_id: accounts[0].id,
        type: 'virtual',
        limit: 500000
      })
      if (data.card) {
        setCards([...cards, data.card])
        alert('Cartão criado com sucesso!')
      }
    } catch (error) {
      alert('Erro ao criar cartão')
    }
    setLoading(false)
  }

  const mockChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Abr', value: 4500 },
    { name: 'Mai', value: 6000 },
    { name: 'Jun', value: 5500 }
  ]

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
        >
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 truncate">Olá, {user?.full_name?.split(' ')[0]} 👋</h1>
            <p className="text-sm md:text-base text-gray-400">Bem-vindo ao futuro do banking</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="glass rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-red-500/20 transition text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            Sair
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 glow"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Saldo Total</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                    {showBalance ? `$${accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0).toLocaleString()}` : '••••••'}
                  </h2>
                  <button onClick={() => setShowBalance(!showBalance)} className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition">
                    {showBalance ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <Wallet className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>+12.5% este mês</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Contas Ativas</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{accounts.length}</h2>
              </div>
              <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Protegidas com IA</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Cartões</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{cards.length}</h2>
              </div>
              <CreditCard className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-purple-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Virtuais e físicos</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateAccount}
              disabled={loading}
              className="bg-primary hover:bg-indigo-600 active:bg-indigo-700 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition disabled:opacity-50 touch-manipulation"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">Nova Conta</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCard}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition disabled:opacity-50 touch-manipulation"
            >
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">Novo Cartão</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition touch-manipulation"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">Transferir</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition touch-manipulation"
            >
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">IA Insights</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 md:mb-8 overflow-hidden"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Fluxo de Caixa</h3>
          <div className="-mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} width={40} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '14px' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Accounts List */}
        {accounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Minhas Contas</h3>
            <div className="space-y-3 sm:space-y-4">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-dark-light rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 hover:bg-dark-light/80 transition touch-manipulation"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{account.type === 'checking' ? 'Conta Corrente' : 'Poupança'}</p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">{account.account_number}</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xl sm:text-2xl font-bold">${account.balance?.toLocaleString() || '0'}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{account.currency}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
