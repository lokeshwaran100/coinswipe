"use client"

import { ArrowUpRight, ArrowDownRight, Link as LinkIcon } from 'lucide-react'
import { TokenPair } from '@/components/providers/token-provider'
import Image from 'next/image'
import Link from 'next/link'

interface TokenCardProps {
  token: TokenPair
}

export function TokenCard({ token }: TokenCardProps) {
  // Get 24h price change and determine if it's positive
  const priceChange = parseFloat(token.priceChange?.h24 || '0')
  const isPositive = priceChange >= 0

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  // Handle missing image URL
  const imageUrl = token.info?.imageUrl || '/placeholder-token.png'

  return (
    <div className="w-full aspect-auto rounded-xl bg-card p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24">
          <Image
            src={imageUrl}
            alt={token.baseToken.name}
            className="rounded-lg object-cover"
            fill
            sizes="96px"
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-2xl font-bold">{token.baseToken.name}</h3>
            <p className="text-sm text-muted-foreground">{token.baseToken.symbol}</p>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">${parseFloat(token.priceUsd).toFixed(6)}</p>
            </div>
            
            {token.priceChange && (
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
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {token.liquidity && (
          <div>
            <p className="text-sm text-muted-foreground">Liquidity</p>
            <p className="font-semibold">{formatNumber(token.liquidity.usd)}</p>
          </div>
        )}
        {token.marketCap && (
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">{formatNumber(token.marketCap)}</p>
          </div>
        )}
        {token.fdv && (
          <div>
            <p className="text-sm text-muted-foreground">FDV</p>
            <p className="font-semibold">{formatNumber(token.fdv)}</p>
          </div>
        )}
        {token.pairCreatedAt && (
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-semibold">
              {new Date(token.pairCreatedAt * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex gap-2">
          {token.info?.websites?.[0] && (
            <Link
              href={token.info.websites[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center gap-1"
            >
              <LinkIcon className="w-4 h-4" />
              Website
            </Link>
          )}
          {token.url && (
            <Link
              href={token.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center gap-1"
            >
              <LinkIcon className="w-4 h-4" />
              DexScreener
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
