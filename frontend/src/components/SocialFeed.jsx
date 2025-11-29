import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, TrendingUp, Users, Award, Target } from 'lucide-react'

export default function SocialFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Ana Silva', avatar: '👩‍💼', level: 'Gold' },
      content: 'Consegui economizar R$ 2.000 este mês seguindo as dicas da IA! 🎉',
      type: 'achievement',
      likes: 24,
      comments: 8,
      time: '2h'
    },
    {
      id: 2,
      user: { name: 'Carlos Santos', avatar: '👨‍💻', level: 'Platinum' },
      content: 'Minha carteira de investimentos rendeu 15% este ano. Diversificação é tudo!',
      type: 'investment',
      likes: 45,
      comments: 12,
      time: '4h'
    },
    {
      id: 3,
      user: { name: 'Maria Costa', avatar: '👩‍🎓', level: 'Silver' },
      content: 'Primeira vez investindo em CDB. Nervosa mas animada! 💪',
      type: 'milestone',
      likes: 18,
      comments: 6,
      time: '6h'
    }
  ])

  const challenges = [
    { title: 'Economize R$ 500', progress: 75, reward: '100 pontos' },
    { title: 'Invista R$ 1.000', progress: 40, reward: '200 pontos' },
    { title: 'Use PIX 10x', progress: 90, reward: '50 pontos' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Social Banking
        </h2>
        <button className="bg-primary rounded-xl px-4 py-2 text-sm font-semibold">
          + Compartilhar
        </button>
      </div>

      {/* Challenges */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          Desafios da Comunidade
        </h3>
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="bg-dark-light rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">{challenge.title}</h4>
                <span className="text-xs text-yellow-400">{challenge.reward}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{challenge.progress}% completo</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Feed */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                {post.user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{post.user.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.user.level === 'Platinum' ? 'bg-gray-400/20 text-gray-300' :
                    post.user.level === 'Gold' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {post.user.level}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{post.time} atrás</p>
              </div>
              <div className="flex items-center gap-1">
                {post.type === 'achievement' && <Award className="w-4 h-4 text-yellow-400" />}
                {post.type === 'investment' && <TrendingUp className="w-4 h-4 text-green-400" />}
                {post.type === 'milestone' && <Target className="w-4 h-4 text-blue-400" />}
              </div>
            </div>

            <p className="text-sm mb-4">{post.content}</p>

            <div className="flex items-center gap-6 text-gray-400">
              <button className="flex items-center gap-2 hover:text-red-400 transition">
                <Heart className="w-4 h-4" />
                <span className="text-xs">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-green-400 transition">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Top Economizadores
        </h3>
        <div className="space-y-3">
          {[
            { name: 'João Pedro', savings: 5420, position: 1 },
            { name: 'Maria Silva', savings: 4890, position: 2 },
            { name: 'Ana Costa', savings: 4320, position: 3 }
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-light rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  user.position === 1 ? 'bg-yellow-400 text-black' :
                  user.position === 2 ? 'bg-gray-400 text-black' :
                  'bg-orange-400 text-black'
                }`}>
                  {user.position}
                </div>
                <span className="font-semibold">{user.name}</span>
              </div>
              <span className="text-green-400 font-bold">R$ {user.savings.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}