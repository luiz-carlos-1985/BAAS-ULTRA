// Mock API para desenvolvimento sem backend
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockUsers = [
  { id: 1, email: 'admin@baas.com', password: '123456', name: 'Admin User' }
]

const mockAccounts = [
  { id: 1, userId: 1, type: 'checking', balance: 15420.50, accountNumber: '12345-6' },
  { id: 2, userId: 1, type: 'savings', balance: 8750.25, accountNumber: '78901-2' }
]

export const mockApi = {
  async register(data) {
    await delay(500)
    const newUser = { 
      id: Date.now(), 
      ...data, 
      name: data.name || 'New User' 
    }
    mockUsers.push(newUser)
    return { 
      token: 'mock-jwt-token', 
      user: { id: newUser.id, email: newUser.email, name: newUser.name } 
    }
  },

  async login(email, password) {
    await delay(500)
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    return { 
      token: 'mock-jwt-token', 
      user: { id: user.id, email: user.email, name: user.name } 
    }
  },

  async createAccount(token, data) {
    await delay(300)
    const newAccount = {
      id: Date.now(),
      userId: 1,
      type: data.type,
      balance: 0,
      accountNumber: `${Math.random().toString().slice(2, 7)}-${Math.random().toString().slice(2, 3)}`
    }
    mockAccounts.push(newAccount)
    return newAccount
  },

  async getAccounts(token) {
    await delay(200)
    return mockAccounts
  },

  async createCard(token, data) {
    await delay(400)
    return {
      id: Date.now(),
      accountId: data.accountId,
      type: data.type,
      number: '**** **** **** ' + Math.random().toString().slice(2, 6),
      cvv: Math.random().toString().slice(2, 5),
      expiryDate: '12/28'
    }
  },

  async transfer(token, data) {
    await delay(600)
    return {
      id: Date.now(),
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      amount: data.amount,
      status: 'completed',
      timestamp: new Date().toISOString()
    }
  },

  async getDashboard(token, userId) {
    await delay(300)
    return {
      totalBalance: 24170.75,
      monthlyIncome: 5420.30,
      monthlyExpenses: 3210.80,
      transactions: [
        { date: '2024-01-15', amount: 1200, type: 'income' },
        { date: '2024-01-14', amount: -450, type: 'expense' },
        { date: '2024-01-13', amount: 2300, type: 'income' }
      ]
    }
  }
}