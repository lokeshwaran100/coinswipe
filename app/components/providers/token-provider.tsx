"use client"

import { createContext, useContext, useEffect, useState } from 'react'

export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  description: string;
  links: {
    type: string;
    label: string;
    url: string;
  }[];
}

export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  priceChange: {
    h24: string;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    websites: { url: string }[];
    socials: {
      platform: string;
      handle: string;
    }[];
  };
  boosts: {
    active: number;
  };
  amount?: string; // Added for saved tokens
}

interface TokenContextType {
  // Saved tokens state
  savedTokens: TokenPair[];
  addToken: (token: TokenPair) => void;
  removeToken: (address: string) => void;
  defaultAmount: string;
  setDefaultAmount: (amount: string) => void;
  // Application state
  tokenProfiles: TokenProfile[];
  uniswapPairs: TokenPair[];
  loading: boolean;
  error: string | null;
}

const TokenContext = createContext<TokenContextType>({
  savedTokens: [],
  addToken: () => {},
  removeToken: () => {},
  defaultAmount: '0.1',
  setDefaultAmount: () => {},
  tokenProfiles: [],
  uniswapPairs: [],
  loading: true,
  error: null,
})

export function TokenProvider({ children }: { children: React.ReactNode }) {
  // Saved tokens state
  const [savedTokens, setSavedTokens] = useState<TokenPair[]>([])
  const [defaultAmount, setDefaultAmount] = useState('0.1')
  
  // Application state
  const [tokenProfiles, setTokenProfiles] = useState<TokenProfile[]>([]);
  const [baseTokenAddresses, setBaseTokenAddresses] = useState<string[]>([]);
  const [uniswapPairs, setUniswapPairs] = useState<TokenPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToken = (token: TokenPair) => {
    setSavedTokens(prev => [...prev, token])
  }

  const removeToken = (address: string) => {
    setSavedTokens(prev => prev.filter(token => token.baseToken.address !== address))
  }

  // Fetch token profiles
  useEffect(() => {
    const fetchTokenProfiles = async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/token-profiles/latest/v1"
        );
        const data = await response.json();

        console.log("data from https://api.dexscreener.com/token-profiles/latest/v1", data);

        const baseProfiles = data.filter(
          (profile: TokenProfile) => profile.chainId === "base"
        );
        setTokenProfiles(baseProfiles);

        const addresses = baseProfiles.map(
          (profile: TokenProfile) => profile.tokenAddress
        );
        setBaseTokenAddresses(addresses);
      } catch (err) {
        console.error("Error fetching token profiles:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch token profiles"
        );
      }
    };

    fetchTokenProfiles();
  }, []);

  // Fetch token pairs
  useEffect(() => {
    const fetchTokenPairs = async () => {
      if (!baseTokenAddresses.length) return;

      try {
        const addressesString = baseTokenAddresses.join(",");
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${addressesString}`
        );
        const data = await response.json();

        console.log("data from https://api.dexscreener.com/latest/dex/tokens", data);

        const uniswapPairsData = data.pairs.filter(
          (pair: TokenPair) => pair.dexId === "uniswap"
        );
        setUniswapPairs(uniswapPairsData);
      } catch (err) {
        console.error("Error fetching token pairs:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch token pairs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTokenPairs();
  }, [baseTokenAddresses]);

  return (
    <TokenContext.Provider value={{
      savedTokens,
      addToken,
      removeToken,
      defaultAmount,
      setDefaultAmount,
      tokenProfiles,
      uniswapPairs,
      loading,
      error,
    }}>
      {children}
    </TokenContext.Provider>
  )
}

export const useTokens = () => useContext(TokenContext)
