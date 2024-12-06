"use client"

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Skull, Star, Rocket, Brain } from 'lucide-react'
import { CategoryCard } from '@/components/ui/category-card'

const categories = [
  {
    id: 'meme-coins',
    name: 'Meme Coins',
    icon: Star,
    description: 'Popular and trending meme tokens',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'risky-degens',
    name: 'Risky Degens',
    icon: Skull,
    description: 'High risk, high reward tokens',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'newly-launched',
    name: 'Newly Launched',
    icon: Rocket,
    description: 'Recently launched tokens',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'blue-chips',
    name: 'Blue Chips',
    icon: Sparkles,
    description: 'Established and trusted tokens',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'ai-analyzed',
    name: 'AI Analyzed',
    icon: Brain,
    description: 'AI-recommended tokens',
    color: 'from-purple-500 to-violet-500',
  },
]

export function CategoryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Choose Category</h1>
          <p className="text-muted-foreground">Select a category to start swiping</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard
                category={category}
                onClick={() => router.push(`/swipe/${category.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}