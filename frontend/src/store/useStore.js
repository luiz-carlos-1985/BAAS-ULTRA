import { create } from 'zustand'

const getStoredData = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

export const useStore = create((set, get) => ({
  // State
  user: getStoredData('baas-user'),
  token: getStoredData('baas-token'),
  accounts: getStoredData('baas-accounts') || [],
  cards: getStoredData('baas-cards') || [],
  transactions: getStoredData('baas-transactions') || [],
  loading: false,
  error: null,
  
  // Actions
  setUser: (user) => {
    setStoredData('baas-user', user)
    set({ user, error: null })
  },
  
  setToken: (token) => {
    setStoredData('baas-token', token)
    set({ token })
  },
  
  setAccounts: (accounts) => {
    setStoredData('baas-accounts', accounts)
    set({ accounts })
  },
  
  setCards: (cards) => {
    setStoredData('baas-cards', cards)
    set({ cards })
  },
  
  setTransactions: (transactions) => {
    setStoredData('baas-transactions', transactions)
    set({ transactions })
  },
  
  addTransaction: (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    }
    const updatedTransactions = [newTransaction, ...get().transactions].slice(0, 50)
    setStoredData('baas-transactions', updatedTransactions)
    set({ transactions: updatedTransactions })
  },
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  logout: () => {
    ['baas-user', 'baas-token', 'baas-accounts', 'baas-cards', 'baas-transactions'].forEach(
      key => localStorage.removeItem(key)
    )
    set({ 
      user: null, 
      token: null, 
      accounts: [], 
      cards: [], 
      transactions: [],
      loading: false,
      error: null
    })
  },
  
  // Computed values
  totalBalance: () => {
    return get().accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  },
  
  isAuthenticated: () => {
    return !!(get().user && get().token)
  }
}))