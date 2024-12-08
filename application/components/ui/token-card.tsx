"use client";

import { ArrowUpRight, ArrowDownRight, Link as LinkIcon, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { TokenPair } from '@/components/providers/token-provider'
import Image from 'next/image'
import Link from 'next/link'
import { TrustScore } from "../TrustScore";
import { useEffect, useState } from "react";

interface TokenCardProps {
  token: TokenPair;
  trustScore: number;
}

export function TokenCard({ token, trustScore }: TokenCardProps) {
  // Get 24h price change and determine if it's positive
  const priceChange = parseFloat(token.priceChange?.h24 || "0");
  const isPositive = priceChange >= 0;

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Handle missing image URL
  const imageUrl = token.info?.imageUrl || "/placeholder-token.png";

  return (
    <div className="w-full max-w-[320px] aspect-[3/4] rounded-xl bg-card p-6 shadow-lg hover:shadow-xl transition-all border border-border/5 backdrop-blur-sm relative">
      <div className="absolute inset-y-0 -left-8 flex items-center text-muted-foreground/50">
        <ChevronsLeft className="w-10 h-10 animate-pulse" />
      </div>
      <div className="absolute inset-y-0 -right-8 flex items-center text-muted-foreground/50">
        <ChevronsRight className="w-10 h-10 animate-pulse" />
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-32 h-32">
          <Image
            src={imageUrl}
            alt={token.baseToken.name}
            className="rounded-2xl object-cover"
            fill
            sizes="128px"
          />
        </div>

        <div className="w-full text-center space-y-2">
          <div>
            <h3 className="text-2xl font-bold">{token.baseToken.name}</h3>
            <p className="text-sm text-muted-foreground">
              {token.baseToken.symbol}
            </p>
          </div>
          <TrustScore score={trustScore} className="justify-center" />
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">
                ${parseFloat(token.priceUsd).toFixed(6)}
              </p>
            </div>

            {token.priceChange && (
              <div
                className={`flex items-center gap-1 ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
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

      <div className="mt-8 grid grid-cols-2 gap-6">
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

      <div className="mt-auto pt-8">
        <div className="flex gap-3 justify-center">
          {token.info?.websites?.[0] && (
            <Link
              href={token.info.websites[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
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
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              DexScreener
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
