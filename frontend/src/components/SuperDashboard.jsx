import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, Send, TrendingUp, Wallet, LogOut, Plus, Eye, EyeOff, Zap, Shield, Brain, 
  ArrowUpRight, ArrowDownLeft, Sparkles, Bell, Settings, Search, Filter, MoreVertical, 
  Copy, Check, Smartphone, QrCode, Globe, PiggyBank, Target, Award, Users, MessageCircle,
  Camera, Mic, Bot, Star, Gift, Gamepad2, ShoppingBag, Car, Home, Plane, Coffee,
  TrendingDown, Calendar, Clock, MapPin, Headphones, Video, FileText, Download, X, User
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { useStore } from '../store/useStore'
import CryptoWidget from './CryptoWidget'
import SocialFeed from './SocialFeed'
import MarketplaceWidget from './MarketplaceWidget'
import PIXModal from './PIXModal'
import InvestmentModal from './InvestmentModal'
import GoalsModal from './GoalsModal'
import BillPaymentModal from './BillPaymentModal'
import VoiceAssistant from './VoiceAssistant'
import SettingsModal from './SettingsModal'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function SuperDashboard() {
  const { user, accounts, cards, transactions, totalBalance, logout } = useStore()
  const [activeSection, setActiveSection] = useState('home')
  const [showBalance, setShowBalance] = useState(true)
  const [aiChat, setAiChat] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPIXModal, setShowPIXModal] = useState(false)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [billType, setBillType] = useState('electricity')

  const sections = [
    { id: 'home', icon: Wallet, label: 'Home' },
    { id: 'payments', icon: Send, label: 'Payments' },
    { id: 'investments', icon: TrendingUp, label: 'Investments' },
    { id: 'cards', icon: CreditCard, label: 'Cards' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'ai', icon: Bot, label: 'AI Assistant' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Shopping' },
    { id: 'social', icon: Users, label: 'Social' }
  ]

  const quickActions = [
    { icon: QrCode, label: 'QR Pay', color: 'bg-green-600', action: () => setShowPIXModal(true) },
    { icon: Smartphone, label: 'Top Up', color: 'bg-blue-600', action: () => alert('Mobile top-up - Coming soon!') },
    { icon: Car, label: 'Uber', color: 'bg-black', action: () => alert('Redirecting to Uber...') },
    { icon: Coffee, label: 'Food', color: 'bg-red-600', action: () => alert('Opening food delivery!') },
    { icon: Home, label: 'Bills', color: 'bg-yellow-600', action: () => { setBillType('electricity'); setShowBillModal(true) } },
    { icon: Plane, label: 'Travel', color: 'bg-purple-600', action: () => alert('Travel deals loading...') },
    { icon: Gamepad2, label: 'Games', color: 'bg-indigo-600', action: () => alert('Game store - Coming soon!') },
    { icon: Target, label: 'Goals', color: 'bg-pink-600', action: () => setShowGoalsModal(true) }
  ]

  const investments = [
    { name: 'Premium CDB', value: 15420, change: 2.3, risk: 'Low' },
    { name: 'Treasury Direct', value: 8750, change: 1.8, risk: 'Low' },
    { name: 'PETR4 Stocks', value: 3200, change: -0.5, risk: 'High' },
    { name: 'Bitcoin', value: 1800, change: 5.2, risk: 'High' }
  ]

  const rewards = [
    { title: '5% Cashback', desc: 'On groceries', points: 250 },
    { title: '2x Miles', desc: 'On travel', points: 500 },
    { title: '20% Discount', desc: 'On restaurants', points: 100 }
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
              <p className="text-white/80 text-sm">Total Balance</p>
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
              <button 
                onClick={() => setShowNotifications(true)}
                className="p-2 bg-white/20 rounded-xl relative"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white/20 rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-300">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">+12.5% this month</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
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
            <h3 className="font-bold">AI Insights</h3>
            <p className="text-xs text-gray-400">Personalized analysis</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-sm text-green-400">💡 You saved 15% this month! Keep it up.</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-sm text-blue-400">📊 Best time to invest in CDB: 13.2% rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderInvestmentsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investments</h2>
        <button 
          onClick={() => setShowInvestmentModal(true)}
          className="bg-primary rounded-xl px-4 py-2 text-sm font-semibold"
        >
          + Invest
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
                <p className="text-xs text-gray-400">{investment.risk} Risk</p>
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
        <h3 className="font-bold mb-4">Investment Performance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[
            { name: 'Jan', value: 25000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 28200 },
            { name: 'Apr', value: 27800 },
            { name: 'May', value: 29170 }
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
          <span className="font-bold">1,250 points</span>
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
              <button 
                onClick={() => alert(`Redeeming ${reward.points} points...`)}
                className="text-xs text-primary hover:underline"
              >
                Redeem
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Loyalty Program</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Current Level: Gold</span>
              <span>750/1000 pts to Platinum</span>
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
              <p className="text-xs text-gray-400">Miles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">0%</p>
              <p className="text-xs text-gray-400">Annual Fee</p>
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
          AI Assistant
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
              <p className="text-sm">Hello! How can I help you today? I can analyze your spending, suggest investments, or answer financial questions.</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <div className="bg-primary rounded-2xl px-4 py-2 max-w-xs">
              <p className="text-sm">Analyze my monthly spending</p>
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
              <p className="text-sm">📊 Complete analysis:</p>
              <ul className="text-xs mt-2 space-y-1">
                <li>• Expenses: $3,210 (-2.1% vs last month)</li>
                <li>• Top category: Food (37%)</li>
                <li>• Savings: $2,210 (goal: $3,000)</li>
                <li>• Suggestion: Reduce 10% on delivery</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <input 
            type="text" 
            placeholder="Type your question..."
            className="flex-1 bg-dark-light border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button 
            onClick={() => alert('Message sent to AI!')}
            className="bg-primary rounded-xl px-4 py-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => alert('Generating expense report...')}
          className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition"
        >
          <h3 className="font-semibold mb-1">Expense Analysis</h3>
          <p className="text-xs text-gray-400">Detailed monthly report</p>
        </button>
        <button 
          onClick={() => alert('Opening financial planner...')}
          className="glass rounded-2xl p-4 text-left hover:bg-white/5 transition"
        >
          <h3 className="font-semibold mb-1">Planning</h3>
          <p className="text-xs text-gray-400">Smart goals & budget</p>
        </button>
      </div>
    </div>
  )

  const renderCardsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meus Cartões</h2>
      <div className="grid gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm opacity-80">Cartão {card.type === 'virtual' ? 'Virtual' : 'Físico'}</p>
                <p className="text-xs opacity-60 mt-1">Válido até {card.expiryDate || '12/28'}</p>
              </div>
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="font-mono text-lg mb-4">{card.number || '**** **** **** 1234'}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-60">Limite disponível</p>
                <p className="text-xl font-bold">R$ {(card.limit || 5000).toLocaleString()}</p>
              </div>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-semibold transition">
                Gerenciar
              </button>
            </div>
          </motion.div>
        ))}
        {cards.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Nenhum cartão encontrado</p>
            <button className="bg-primary rounded-lg px-6 py-2 font-semibold">Criar Cartão</button>
          </div>
        )}
      </div>
    </div>
  )

  const renderPaymentsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pagamentos</h2>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setShowPIXModal(true)} className="glass rounded-2xl p-6 text-left hover:bg-white/5 transition">
          <QrCode className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-semibold mb-1">PIX</h3>
          <p className="text-xs text-gray-400">Transferência instantânea</p>
        </button>
        <button onClick={() => { setBillType('electricity'); setShowBillModal(true) }} className="glass rounded-2xl p-6 text-left hover:bg-white/5 transition">
          <Home className="w-8 h-8 text-yellow-400 mb-3" />
          <h3 className="font-semibold mb-1">Contas</h3>
          <p className="text-xs text-gray-400">Pagar boletos</p>
        </button>
        <button className="glass rounded-2xl p-6 text-left hover:bg-white/5 transition">
          <Smartphone className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="font-semibold mb-1">Recarga</h3>
          <p className="text-xs text-gray-400">Celular e transporte</p>
        </button>
        <button className="glass rounded-2xl p-6 text-left hover:bg-white/5 transition">
          <Send className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="font-semibold mb-1">Transferir</h3>
          <p className="text-xs text-gray-400">TED e DOC</p>
        </button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Pagamentos Recentes</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{t.description}</p>
                <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
              </div>
              <p className="font-bold text-red-400">-R$ {Math.abs(t.amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch(activeSection) {
      case 'home': return renderHomeSection()
      case 'payments': return renderPaymentsSection()
      case 'investments': return renderInvestmentsSection()
      case 'cards': return renderCardsSection()
      case 'rewards': return renderRewardsSection()
      case 'ai': return renderAISection()
      case 'social': return <SocialFeed />
      case 'marketplace': return <MarketplaceWidget />
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
            <span className="hidden lg:block">Logout</span>
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
        onClick={() => setShowVoiceAssistant(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modals */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNotifications(false)}>
          <div className="glass rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="bg-dark-light rounded-lg p-3">
                <p className="font-semibold text-sm">Cashback received!</p>
                <p className="text-xs text-gray-400">You earned $25 in cashback</p>
              </div>
              <div className="bg-dark-light rounded-lg p-3">
                <p className="font-semibold text-sm">Goal achieved</p>
                <p className="text-xs text-gray-400">Congratulations! Savings goal completed</p>
              </div>
            </div>
            <button onClick={() => setShowNotifications(false)} className="w-full mt-4 bg-primary rounded-lg py-2">
              Close
            </button>
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <VoiceAssistant isOpen={showVoiceAssistant} onClose={() => setShowVoiceAssistant(false)} />

      {/* Advanced Modals */}
      <PIXModal isOpen={showPIXModal} onClose={() => setShowPIXModal(false)} />
      <InvestmentModal isOpen={showInvestmentModal} onClose={() => setShowInvestmentModal(false)} />
      <GoalsModal isOpen={showGoalsModal} onClose={() => setShowGoalsModal(false)} />
      <BillPaymentModal isOpen={showBillModal} onClose={() => setShowBillModal(false)} billType={billType} />
    </div>
  )
}