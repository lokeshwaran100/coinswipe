"use client"

import { Token } from '@/types/token'
import { ArrowUpRight, ArrowDownRight, X } from 'lucide-react'
import { useTokens } from '@/components/providers/token-provider'

interface PortfolioCardProps {
  token: Token
}

export function PortfolioCard({ token }: PortfolioCardProps) {
  const { removeToken } = useTokens()

  return (
    <div className="relative bg-card rounded-xl p-6 shadow-lg">
      <button
        onClick={() => removeToken(token.address)}
        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex gap-4">
        <img
          src={token.image}
          alt={token.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{token.name}</h3>
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm">{token.priceChange.toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{token.amount} ETH</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Value</p>
              <p className="font-medium">
                ${(parseFloat(token.amount) * token.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}