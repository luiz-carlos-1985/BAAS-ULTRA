import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, Send, TrendingUp, Wallet, LogOut, Plus, Eye, EyeOff, Zap, Shield, Brain, 
  ArrowUpRight, ArrowDownLeft, Sparkles, Bell, Settings, Search, Filter, MoreVertical, 
  Copy, Check, Smartphone, QrCode, Globe, PiggyBank, Target, Award, Users, MessageCircle,
  Camera, Mic, Bot, Star, Gift, Gamepad2, ShoppingBag, Car, Home, Plane, Coffee,
  TrendingDown, Calendar, Clock, MapPin, Headphones, Video, FileText, Download
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useStore } from '../store/useStore'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function SuperDashboard() {
  const { user, accounts, cards, transactions, totalBalance, logout } = useStore()
  const [activeSection, setActiveSection] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [aiChat, setAiChat] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const sections = [
    { id: 'home', icon: Wallet, label: 'Início' },
    { id: 'payments', icon: Send, label: 'Pagamentos' },
    { id: 'investments', icon: TrendingUp, label: 'Investimentos' },
    { id: 'cards', icon: CreditCard, label: 'Cartões' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'ai', icon: Bot, label: 'IA Assistant' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Shopping' },
    { id: 'social', icon: Users, label: 'Social' }
  ]

  const quickActions = [
    { icon: QrCode, label: 'PIX QR', color: 'bg-green-600', action: () => {} },
    { icon: Smartphone, label: 'Recarga', color: 'bg-blue-600', action: () => {} },
    { icon: Car, label: 'Uber', color: 'bg-black', action: () => {} },
    { icon: Coffee, label: 'iFood', color: 'bg-red-600', action: () => {} },
    { icon: Home, label: 'Conta Luz', color: 'bg-yellow-600', action: () => {} },
    { icon: Plane, label: 'Viagens', color: 'bg-purple-600', action: () => {} },
    { icon: Gamepad2, label: 'Games', color: 'bg-indigo-600', action: () => {} },
    { icon: Target, label: 'Metas', color: 'bg-pink-600', action: () => {} }
  ]

  const investments = [
    { name: 'CDB Premium', value: 15420, change: 2.3, risk: 'Baixo' },
    { name: 'Tesouro Direto', value: 8750, change: 1.8, risk: 'Baixo' },
    { name: 'Ações PETR4', value: 3200, change: -0.5, risk: 'Alto' },
    { name: 'Bitcoin', value: 1800, change: 5.2, risk: 'Alto' }
  ]

  const rewards = [
    { title: 'Cashback 5%', desc: 'Em supermercados', points: 250 },
    { title: 'Milhas 2x', desc: 'Em viagens', points: 500 },
    { title: 'Desconto 20%', desc: 'Em restaurantes', points: 100 }
  ]

  const renderHomeSection = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Saldo Total</p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {showBalance ? formatCurrency(totalBalance()) : '••••••'}
                </h2>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 rounded-xl">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 rounded-xl">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-300">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">+12.5% este mês</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${action.color} rounded-2xl p-4 flex flex-col items-center gap-2 text-white`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <motion.div
        className="glass rounded-2xl p-6"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">IA Insights</h3>
            <p className="text-xs text-gray-400">Análise personalizada</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-sm text-green-400">💡 Você economizou 15% este mês! Continue assim.</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-sm text-blue-400">📊 Melhor momento para investir em CDB: taxa 13.2%</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderInvestmentsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investimentos</h2>
        <button className="bg-primary rounded-xl px-4 py-2 text-sm font-semibold">
          + Investir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investments.map((investment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{investment.name}</h3>
                <p className="text-xs text-gray-400">Risco {investment.risk}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                investment.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {investment.change > 0 ? '+' : ''}{investment.change}%
              </span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(investment.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Performance dos Investimentos</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[
            { name: 'Jan', value: 25000 },
            { name: 'Fev', value: 26500 },
            { name: 'Mar', value: 28200 },
            { name: 'Abr', value: 27800 },
            { name: 'Mai', value: 29170 }
          ]}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderRewardsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rewards</h2>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="font-bold">1,250 pontos</span>
        </div>
      </div>

      <div className="grid gap-4">
        {rewards.map((reward, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{reward.title}</h3>
                <p className="text-sm text-gray-400">{reward.desc}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-400">{reward.points} pts</p>
              <button className="text-xs text-primary hover:underline">Resgatar</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Programa de Fidelidade</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Nível Atual: Gold</span>
              <span>750/1000 pts para Platinum</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{width: '75%'}} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-400">5%</p>
              <p className="text-xs text-gray-400">Cashback</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">2x</p>
              <p className="text-xs text-gray-400">Milhas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">0%</p>
              <p className="text-xs text-gray-400">Anuidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAISection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-400" />
          IA Assistant
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setVoiceMode(!voiceMode)}
            className={`p-2 rounded-xl ${voiceMode ? 'bg-red-500' : 'bg-gray-700'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-700 rounded-xl">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 h-96 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="flex gap-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-700 rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">Olá! Como posso ajudar você hoje? Posso analisar seus gastos, sugerir investimentos ou responder dúvidas financeiras.</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <div className="bg-primary rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">Analise meus gastos do mês</p>
            </div>
            <div className="p-2 bg-gray-600 rounded-xl">
              <User className="w-4 h-4" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-700 rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">📊 Análise completa:</p>
              <ul className="text-xs mt-2 space-y-1">
                <li>• Gastos: $3,210 (-2.1% vs mês anterior)</li>
                <li>• Maior categoria: Alimentação (37%)</li>
                <li>• Economia: $2,210 (meta: $3,000)</li>
                <li>• Sugestão: Reduza 10% em delivery</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <input 
            type="text" 
            placeholder="Digite sua pergunta..."
            className="flex-1 bg-dark-light border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button className="bg-primary rounded-xl px-4 py-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition">
          <h3 className="font-semibold mb-1">Análise de Gastos</h3>
          <p className="text-xs text-gray-400">Relatório detalhado mensal</p>
        </button>
        <button className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition">
          <h3 className="font-semibold mb-1">Planejamento</h3>
          <p className="text-xs text-gray-400">Metas e orçamento inteligente</p>
        </button>
      </div>
    </div>
  )

  const renderSection = () => {
    switch(activeSection) {
      case 'home': return renderHomeSection()
      case 'investments': return renderInvestmentsSection()
      case 'rewards': return renderRewardsSection()
      case 'ai': return renderAISection()
      default: return renderHomeSection()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 glass border-r border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="hidden lg:block text-xl font-bold">BaaS Ultra</h1>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                activeSection === section.id 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="hidden lg:block">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setAiChat(!aiChat)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  )
}