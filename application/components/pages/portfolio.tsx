"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTokens } from "@/components/providers/token-provider";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { Settings } from "lucide-react";

export function PortfolioPage() {
  const { savedTokens, tokenProfiles, defaultAmount, setDefaultAmount } =
    useTokens();
  const [inputValue, setInputValue] = useState<String>(defaultAmount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-1xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Portfolio</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* <Settings className="w-6 h-6 text-muted-foreground" /> */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Default Amount:
              </span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-20 sm:w-24 p-2 text-sm sm:text-base rounded-lg bg-background border border-input focus:border-primary outline-none transition"
                step="0.01"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setDefaultAmount(inputValue)}>Buy</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
