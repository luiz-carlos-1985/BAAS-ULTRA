import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Send, TrendingUp, Wallet, LogOut, Plus, Eye, EyeOff, Zap, Shield, Brain, ArrowUpRight, ArrowDownLeft, Sparkles, Bell, Settings, Search, Filter, MoreVertical, Copy, Check } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useStore } from '../store/useStore'
import { api } from '../services/api'
import { formatCurrency, formatDate } from '../utils/formatters'
import TransferModal from './TransferModal'
import CardModal from './CardModal'

export default function Dashboard() {
  const { user, token, accounts, cards, transactions, totalBalance, setAccounts, setCards, logout } = useStore()
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (accounts.length > 0) return
    try {
      if (token) {
        const accountsData = await api.getAccounts(token)
        if (accountsData && accountsData.accounts) {
          setAccounts(accountsData.accounts)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
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
      if (data) {
        setAccounts([...accounts, data])
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
      if (data) {
        setCards([...cards, data])
        alert('Cartão criado com sucesso!')
      }
    } catch (error) {
      alert('Erro ao criar cartão')
    }
    setLoading(false)
  }

  const mockChartData = [
    { name: 'Jan', income: 4000, expense: 2800, net: 1200 },
    { name: 'Fev', income: 3500, expense: 2200, net: 1300 },
    { name: 'Mar', income: 5200, expense: 3100, net: 2100 },
    { name: 'Abr', income: 4800, expense: 2900, net: 1900 },
    { name: 'Mai', income: 6200, expense: 3400, net: 2800 },
    { name: 'Jun', income: 5800, expense: 3200, net: 2600 }
  ]

  const expenseData = [
    { name: 'Alimentação', value: 1200, color: '#ef4444' },
    { name: 'Transporte', value: 800, color: '#f97316' },
    { name: 'Lazer', value: 600, color: '#eab308' },
    { name: 'Outros', value: 400, color: '#6366f1' }
  ]

  const recentTransactions = transactions.length > 0 ? transactions.slice(0, 5) : [
    { id: 1, type: 'income', amount: 2500, description: 'Salário', date: '2024-01-15', category: 'work' },
    { id: 2, type: 'expense', amount: -120, description: 'Supermercado', date: '2024-01-14', category: 'food' },
    { id: 3, type: 'expense', amount: -45, description: 'Uber', date: '2024-01-14', category: 'transport' },
    { id: 4, type: 'income', amount: 150, description: 'Freelance', date: '2024-01-13', category: 'work' },
    { id: 5, type: 'expense', amount: -80, description: 'Netflix', date: '2024-01-12', category: 'entertainment' }
  ]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">Olá, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
            <p className="text-sm md:text-base text-gray-400">Banking reimagined for the future</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (notifications > 0) setNotifications(0)
              }}
              className="glass rounded-xl p-3 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="glass rounded-xl p-3"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="glass rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 hover:bg-red-500/20 transition text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Sair</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 glow cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Saldo Total</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.h2 
                    className="text-xl sm:text-2xl md:text-3xl font-bold truncate"
                    animate={showBalance ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {showBalance ? formatCurrency(totalBalance()) : '••••••'}
                  </motion.h2>
                  <motion.button 
                    onClick={() => setShowBalance(!showBalance)} 
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showBalance ? 
                        <EyeOff key="hide" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : 
                        <Eye key="show" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      }
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Wallet className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary flex-shrink-0" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>+12.5% este mês</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Receita Mensal</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">$5,420</h2>
              </div>
              <ArrowUpRight className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">+8.2% vs mês anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Gastos Mensais</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">$3,210</h2>
              </div>
              <ArrowDownLeft className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-red-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">-2.1% vs mês anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Economia</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400">$2,210</h2>
              </div>
              <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Meta: $3,000</p>
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
              onClick={() => setShowTransferModal(true)}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition touch-manipulation"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">Transferir</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCardModal(true)}
              className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2 transition touch-manipulation"
            >
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm font-semibold">Ver Cartões</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:col-span-2 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Fluxo de Caixa
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Receita</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Gastos</span>
                </div>
              </div>
            </div>
            <div className="-mx-2 sm:mx-0">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} width={50} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontSize: '14px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                    }} 
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Gastos por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">${item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions & Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Transações Recentes
              </h3>
              <button 
                onClick={() => alert('Visualizando todas as transações...')}
                className="text-primary hover:underline text-sm"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-dark-light rounded-lg p-3 flex items-center justify-between hover:bg-dark-light/80 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type === 'income' ? 
                        <ArrowUpRight className="w-5 h-5" /> : 
                        <ArrowDownLeft className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{transaction.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Minhas Contas
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateAccount}
                className="bg-primary hover:bg-indigo-600 rounded-lg px-3 py-1.5 text-sm font-semibold transition"
              >
                + Nova
              </motion.button>
            </div>
            <div className="space-y-4">
              {accounts.length > 0 ? accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl p-4 border border-primary/30 hover:border-primary/50 transition cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{account.type === 'checking' ? 'Conta Corrente' : 'Poupança'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-400">{account.accountNumber || '12345-6'}</p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(account.accountNumber || '12345-6')}
                          className="p-1 hover:bg-white/10 rounded transition"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                        </motion.button>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance || 15420.50)}</p>
                      <p className="text-xs text-gray-400">USD</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+5.2%</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">Nenhuma conta encontrada</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateAccount}
                    className="bg-primary hover:bg-indigo-600 rounded-lg px-6 py-2 font-semibold transition"
                  >
                    Criar primeira conta
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Notificações
                </h3>
                <div className="space-y-3">
                  <div className="bg-dark-light rounded-lg p-3">
                    <p className="font-semibold text-sm">Nova transação</p>
                    <p className="text-xs text-gray-400">Recebimento de $2,500 - Salário</p>
                  </div>
                  <div className="bg-dark-light rounded-lg p-3">
                    <p className="font-semibold text-sm">Cartão criado</p>
                    <p className="text-xs text-gray-400">Seu novo cartão virtual está pronto</p>
                  </div>
                  <div className="bg-dark-light rounded-lg p-3">
                    <p className="font-semibold text-sm">Meta atingida</p>
                    <p className="text-xs text-gray-400">Parabéns! Você economizou $2,210</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-4 bg-primary hover:bg-indigo-600 rounded-lg py-2 font-semibold transition"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Configurações
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Notificações Push</span>
                    <button className="bg-primary rounded-full w-12 h-6 flex items-center px-1">
                      <div className="bg-white w-4 h-4 rounded-full ml-auto"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Biometria</span>
                    <button className="bg-gray-600 rounded-full w-12 h-6 flex items-center px-1">
                      <div className="bg-white w-4 h-4 rounded-full"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Modo Escuro</span>
                    <button className="bg-primary rounded-full w-12 h-6 flex items-center px-1">
                      <div className="bg-white w-4 h-4 rounded-full ml-auto"></div>
                    </button>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <button className="text-red-400 hover:underline text-sm">Excluir conta</button>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-4 bg-primary hover:bg-indigo-600 rounded-lg py-2 font-semibold transition"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transfer Modal */}
        <TransferModal 
          isOpen={showTransferModal} 
          onClose={() => setShowTransferModal(false)} 
        />

        {/* Card Modal */}
        <CardModal 
          isOpen={showCardModal} 
          onClose={() => setShowCardModal(false)} 
        />
      </div>
    </div>
  )
}