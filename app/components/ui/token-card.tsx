"use client"

import { Token } from '@/types/token'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface TokenCardProps {
  token: Token
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="w-full aspect-[3/4] rounded-xl bg-card p-6 shadow-lg">
      <img
        src={token.image}
        alt={token.name}
        className="w-full aspect-square rounded-lg object-cover mb-4"
      />
      
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">{token.name}</h3>
          <p className="text-sm text-muted-foreground">{token.symbol}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">${token.price.toFixed(4)}</p>
          </div>
          
          <div className="flex items-center gap-1 text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">
              {token.priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}