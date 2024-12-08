"use client"

import { Token } from '@/types/token'
import { ArrowUpRight, ArrowDownRight, X } from 'lucide-react'
import { useTokens } from '@/components/providers/token-provider'
import Image from 'next/image'

interface PortfolioCardProps {
  token: Token
}

export function PortfolioCard({ token }: PortfolioCardProps) {
  const { removeToken } = useTokens()

  return (
    <div className="relative bg-card rounded-xl p-4 sm:p-6 shadow-lg">
      <button
        onClick={() => removeToken(token.address)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-muted-foreground hover:text-destructive transition"
      >
        {/* <X className="w-5 h-5" /> */}
      </button>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className=' w-full flex items-center gap-4'>
        <Image
          width={32}
          height={32}
          src={token.image}
          alt={token.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
        />
        <h2 className=' break-words overflow-hidden'>{token.name}</h2>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm sm:text-base break-words overflow-hidden">{token.name}</h3>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{token.priceChange.toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Amount</p>
              <p className="text-sm sm:text-base font-medium">{token.amount} ETH</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Value</p>
              <p className="text-sm sm:text-base font-medium">
                {token.value} ETH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}