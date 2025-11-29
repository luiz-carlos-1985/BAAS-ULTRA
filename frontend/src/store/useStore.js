import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      accounts: [],
      cards: [],
      transactions: [],
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAccounts: (accounts) => set({ accounts }),
      setCards: (cards) => set({ cards }),
      setTransactions: (transactions) => set({ transactions }),
      
      logout: () => {
        set({ user: null, token: null, accounts: [], cards: [], transactions: [] })
      }
    }),
    {
      name: 'baas-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        accounts: state.accounts,
        cards: state.cards
      })
    }
  )
)
