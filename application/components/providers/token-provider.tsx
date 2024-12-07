"use client"

import { createContext, useContext, useState } from 'react'

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
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h24: string;
  };
  info: {
    imageUrl: string;
  };
  amount?: string; // Keeping this for saved tokens functionality
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
  
  // Application state withdummy data
  const [tokenProfiles] = useState<TokenProfile[]>([
    {
      url: "https://dexscreener.com/base/sample",
      chainId: "base",
      tokenAddress: "0x123...",
      icon: "/sample-icon.png",
      header: "Sample Token",
      description: "A sample token for testing",
      links: [
        {
          type: "website",
          label: "Website",
          url: "https://example.com"
        }
      ]
    }
  ]);

  const [uniswapPairs] = useState<TokenPair[]>([
    {
      baseToken: {
        address: "0x123",
        name: "Ethereum",
        symbol: "ETH"
      },
      priceUsd: "3,456.20",
      priceChange: {
        h24: "2.5"
      },
      info: {
        imageUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
      }
    },
    {
      baseToken: {
        address: "0x456",
        name: "Bitcoin",
        symbol: "BTC"
      },
      priceUsd: "52,380.75",
      priceChange: {
        h24: "-1.2"
      },
      info: {
        imageUrl: "https://bitcoin.org/img/icons/opengraph.png"
      }
    },
    {
      baseToken: {
        address: "0x789",
        name: "Cardano",
        symbol: "ADA"
      },
      priceUsd: "0.58",
      priceChange: {
        h24: "3.7"
      },
      info: {
        imageUrl: "https://cryptologos.cc/logos/cardano-ada-logo.png"
      }
    }
  ] as TokenPair[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToken = (token: TokenPair) => {
    setSavedTokens(prev => [...prev, token])
  }

  const removeToken = (address: string) => {
    setSavedTokens(prev => prev.filter(token => token.baseToken.address !== address))
  }

  // Remove the useEffect hooks that were fetching data

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
