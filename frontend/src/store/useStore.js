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

const cleanAccounts = (accounts) => {
  if (!accounts) return []
  return Array.from(new Map(accounts.map(a => [a.id, a])).values())
}

export const useStore = create((set, get) => ({
  user: getStoredData('baas-user'),
  token: getStoredData('baas-token'),
  accounts: cleanAccounts(getStoredData('baas-accounts')),
  cards: getStoredData('baas-cards') || [],
  transactions: [],
  
  setUser: (user) => {
    setStoredData('baas-user', user)
    set({ user })
  },
  setToken: (token) => {
    setStoredData('baas-token', token)
    set({ token })
  },
  setAccounts: (accounts) => {
    const uniqueAccounts = Array.from(new Map(accounts.map(a => [a.id, a])).values())
    setStoredData('baas-accounts', uniqueAccounts)
    set({ accounts: uniqueAccounts })
  },
  setCards: (cards) => {
    setStoredData('baas-cards', cards)
    set({ cards })
  },
  setTransactions: (transactions) => set({ transactions }),
  
  logout: () => {
    localStorage.removeItem('baas-user')
    localStorage.removeItem('baas-token')
    localStorage.removeItem('baas-accounts')
    localStorage.removeItem('baas-cards')
    set({ user: null, token: null, accounts: [], cards: [], transactions: [] })
  }
}))
