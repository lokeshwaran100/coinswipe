"use client"

import { useState } from 'react'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useTokens } from '@/components/providers/token-provider'
import { TokenCard } from '@/components/ui/token-card'
import { mockTokens } from '@/lib/mock-data'

export function SwipePage({ category }: { category: string }) {
  const router = useRouter()
  const { addToken, defaultAmount } = useTokens()
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        await controls.start({ x: 500, opacity: 0 })
        addToken({ ...mockTokens[currentIndex], amount: defaultAmount })
      } else {
        await controls.start({ x: -500, opacity: 0 })
      }
      controls.set({ x: 0, opacity: 1 })
      setCurrentIndex(prev => (prev + 1) % mockTokens.length)
    } else {
      controls.start({ x: 0, opacity: 1 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex gap-4">
            <ThumbsDown className="w-6 h-6 text-red-500" />
            <ThumbsUp className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="touch-none"
        >
          <TokenCard token={mockTokens[currentIndex]} />
        </motion.div>
      </div>
    </div>
  )
}