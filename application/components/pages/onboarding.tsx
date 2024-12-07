"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/components/providers/wallet-provider'
import { Wallet, ArrowRight } from 'lucide-react'

export function OnboardingPage() {
  const router = useRouter()
  const { connect, isConnected } = useWallet()
  const [defaultAmount, setDefaultAmount] = useState('')

  const handleContinue = () => {
    if (isConnected && defaultAmount) {
      router.push('/categories')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-6 bg-card rounded-xl shadow-lg"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">JustSwipe</h1>
          <p className="text-muted-foreground">Swipe your way to crypto success</p>
        </div>

        <div className="space-y-6">
          {!isConnected ? (
            <button
              onClick={connect}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg p-4 hover:opacity-90 transition"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Default Buy Amount (Base ETH)</span>
                <input
                  type="number"
                  value={defaultAmount}
                  onChange={(e) => setDefaultAmount(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-input focus:border-primary outline-none transition"
                  placeholder="0.1"
                  step="0.01"
                />
              </label>

              <button
                onClick={handleContinue}
                disabled={!defaultAmount}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg p-4 hover:opacity-90 transition disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}