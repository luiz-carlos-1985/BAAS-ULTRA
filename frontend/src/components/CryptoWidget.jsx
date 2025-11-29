import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react'

export default function CryptoWidget() {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250, change: 2.3 },
    { symbol: 'ETH', name: 'Ethereum', price: 2680, change: -1.2 },
    { symbol: 'ADA', name: 'Cardano', price: 0.52, change: 4.1 },
    { symbol: 'SOL', name: 'Solana', price: 98.5, change: 1.8 }
  ]

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bitcoin className="w-5 h-5 text-orange-400" />
        <h3 className="font-bold">Crypto Market</h3>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Live</span>
      </div>

      <div className="space-y-3">
        {cryptos.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-dark-light rounded-xl hover:bg-dark-light/80 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{crypto.symbol}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{crypto.name}</p>
                <p className="text-xs text-gray-400">{crypto.symbol}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold">${crypto.price.toFixed(2)}</p>
              <div className={`flex items-center gap-1 text-xs ${
                crypto.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(crypto.change).toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => alert('Redirecionando para exchange de crypto...')}
        className="w-full mt-4 bg-orange-600 hover:bg-orange-700 rounded-xl py-2 text-sm font-semibold transition"
      >
        Comprar Crypto
      </button>
    </div>
  )
}