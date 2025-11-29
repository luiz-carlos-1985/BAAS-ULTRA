import { mockApi } from './mockApi.js'

const API_URL = '/api/v1'
const USE_MOCK = true // Altere para false quando o backend estiver rodando

export const api = USE_MOCK ? mockApi : {
  async register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Registration failed')
    }
    return json
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Login failed')
    }
    return json
  },

  async createAccount(token, data) {
    const res = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async getAccounts(token) {
    const res = await fetch(`${API_URL}/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  async createCard(token, data) {
    const res = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async transfer(token, data) {
    const res = await fetch(`${API_URL}/accounts/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async getDashboard(token, userId) {
    const res = await fetch(`/analytics/dashboard?user_id=${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  }
}
