import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'

export default function MarketplaceWidget() {
  const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 7999, rating: 4.8, image: '📱', discount: 10 },
    { id: 2, name: 'MacBook Air M2', price: 9999, rating: 4.9, image: '💻', discount: 15 },
    { id: 3, name: 'AirPods Pro', price: 2499, rating: 4.7, image: '🎧', discount: 5 },
    { id: 4, name: 'Apple Watch', price: 3999, rating: 4.6, image: '⌚', discount: 8 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <button className="text-primary text-sm hover:underline">Ver todos</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-4 cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-4xl">
                {product.image}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-400">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-400">R$ {product.price}</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    -{product.discount}%
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full mt-3 bg-primary hover:bg-indigo-600 rounded-lg py-2 text-sm font-semibold transition">
              Comprar Agora
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
