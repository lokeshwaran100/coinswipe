"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signIn, useSession, signOut } from 'next-auth/react'
import { ArrowRight, LogIn } from 'lucide-react'
import { createUser } from '@/lib/dbOperations'
import Link from 'next/link'

export function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [defaultAmount, setDefaultAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    console.log(session);
    // Check if user is authenticated and has email
    if (status === 'authenticated' && session?.user?.email) {
      const initUser = async () => {
        await createUser(session?.user?.email as string);
      };
      initUser();
      // Call the wallet API with email as query parameter
      // fetch(`/api/wallet?email=${encodeURIComponent(session.user.email)}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     if (data.success) {
      //       setWalletAddress(data.data.walletAddress)
      //     } else {
      //       console.error('Failed to create/fetch wallet:', data.error)
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error accessing wallet API:', error);
      //     signOut();
      //   })
    }
  }, [session, status])

  const handleContinue = () => {
    if (session && defaultAmount && walletAddress) {
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
          <h1 className="text-4xl font-bold text-primary">CoinSwipe</h1>
          <p className="text-muted-foreground">Swipe your way to crypto success</p>
        </div>

        <div className="space-y-6">
          {!session ? (
            <button
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg p-4 hover:opacity-90 transition"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google
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
              <Link href="/categories">
                <button
                  onClick={handleContinue}
                disabled={!defaultAmount}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg p-4 hover:opacity-90 transition disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}