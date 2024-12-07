"use client"

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { TokenPair } from '@/components/providers/token-provider'
import Image from 'next/image'

interface TokenCardProps {
  token: TokenPair
}

export function TokenCard({ token }: TokenCardProps) {
  // Get 24h price change and determine if it's positive
  const priceChange = parseFloat(token.priceChange?.h24 || '0')
  const isPositive = priceChange >= 0

  return (
    <div className="w-full aspect-[3/4] rounded-xl bg-card p-6 shadow-lg">
      <Image
        src={token.info.imageUrl}
        alt={token.baseToken.name}
        className="w-full aspect-square rounded-lg object-cover mb-4"
        width={400}
        height={400}
      />
      
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">{token.baseToken.name}</h3>
          <p className="text-sm text-muted-foreground">{token.baseToken.symbol}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">${token.priceUsd}</p>
          </div>
          
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
