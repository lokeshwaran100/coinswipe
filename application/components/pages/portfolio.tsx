"use client";

import { motion } from "framer-motion";
import { useTokens } from "@/components/providers/token-provider";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { Settings } from "lucide-react";

export function PortfolioPage() {
  const { savedTokens, tokenProfiles, defaultAmount, setDefaultAmount } =
    useTokens();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">Portfolio</h1>

          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Default Amount:
              </span>
              <input
                type="number"
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(e.target.value)}
                className="w-24 p-2 rounded-lg bg-background border border-input focus:border-primary outline-none transition"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tokenProfiles.map((token, index) => (
            <motion.div
              key={token.tokenAddress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PortfolioCard
                token={{
                  address: token.tokenAddress,
                  name: token.tokenAddress,
                  symbol: token.tokenAddress,
                  price: 0,
                  priceChange: 0,
                  image: token.icon,
                  amount: "0",
                }}
              />
            </motion.div>
          ))}
        </div>

        {tokenProfiles.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No tokens in your portfolio yet. Start swiping to add some!
          </div>
        )}
      </div>
    </div>
  );
}
