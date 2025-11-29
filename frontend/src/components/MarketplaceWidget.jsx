import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Truck, Percent, Gift, Coffee, Smartphone, Car, Home, Plane } from 'lucide-react'

export default function MarketplaceWidget() {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'Todos', icon: ShoppingBag },
    { id: 'food', label: 'Food', icon: Coffee },
    { id: 'tech', label: 'Tech', icon: Smartphone },
    { id: 'transport', label: 'Transporte', icon: Car },
    { id: 'home', label: 'Casa', icon: Home },
    { id: 'travel', label: 'Viagem', icon: Plane }
  ]

  const deals = [
    {
      id: 1,
      title: 'iFood - 30% OFF',
      description: 'Desconto em pedidos acima de R$ 30',
      cashback: '5%',
      category: 'food',
      image: '🍕',
      rating: 4.8,
      expires: '2 dias'
    },
    {
      id: 2,
      title: 'Uber - Viagem Grátis',
      description: 'Primeira corrida até R$ 20 grátis',
      cashback: '10%',
      category: 'transport',
      image: '🚗',
      rating: 4.6,
      expires: '5 dias'
    },
    {
      id: 3,
      title: 'Amazon - Frete Grátis',
      description: 'Frete grátis em compras acima de R$ 100',
      cashback: '3%',
      category: 'tech',
      image: '📦',
      rating: 4.9,
      expires: '1 semana'
    },
    {
      id: 4,
      title: 'Booking - 25% OFF',
      description: 'Desconto em hotéis selecionados',
      cashback: '8%',
      category: 'travel',
      image: '🏨',
      rating: 4.7,
      expires: '3 dias'
    }
  ]

  const filteredDeals = activeCategory === 'all' 
    ? deals 
    : deals.filter(deal => deal.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-green-400" />
          Marketplace
        </h2>
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold">Até 30% OFF</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition ${
              activeCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-dark-light text-gray-400 hover:text-white'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span className="text-sm">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Deal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <div className="text-4xl">🎉</div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-semibold">OFERTA ESPECIAL</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Cashback Duplo Weekend!</h3>
          <p className="text-sm text-white/80 mb-4">
            Ganhe 2x mais cashback em todas as compras até domingo
          </p>
          <button className="bg-white text-green-600 px-6 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition">
            Ativar Agora
          </button>
        </div>
      </motion.div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{deal.image}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{deal.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{deal.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{deal.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                      {deal.cashback} Cashback
                    </span>
                    <span className="text-xs text-gray-400">
                      Expira em {deal.expires}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 bg-primary hover:bg-indigo-600 rounded-xl py-2 text-sm font-semibold transition flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" />
              Usar Oferta
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Services */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4">Serviços Rápidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Recarga Celular', icon: '📱', cashback: '2%' },
            { name: 'Conta de Luz', icon: '💡', cashback: '1%' },
            { name: 'Internet', icon: '🌐', cashback: '3%' },
            { name: 'Streaming', icon: '📺', cashback: '5%' }
          ].map((service, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-dark-light rounded-xl p-4 text-center hover:bg-dark-light/80 transition"
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <p className="text-sm font-semibold mb-1">{service.name}</p>
              <span className="text-xs text-green-400">{service.cashback} cashback</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}