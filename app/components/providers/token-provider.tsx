"use client"

import { createContext, useContext, useState } from 'react'
import { Token } from '@/types/token'

interface TokenContextType {
  tokens: Token[]
  addToken: (token: Token) => void
  removeToken: (address: string) => void
  defaultAmount: string
  setDefaultAmount: (amount: string) => void
}

const TokenContext = createContext<TokenContextType>({
  tokens: [],
  addToken: () => {},
  removeToken: () => {},
  defaultAmount: '0.1',
  setDefaultAmount: () => {},
})

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [defaultAmount, setDefaultAmount] = useState('0.1')

  const addToken = (token: Token) => {
    setTokens(prev => [...prev, token])
  }

  const removeToken = (address: string) => {
    setTokens(prev => prev.filter(token => token.address !== address))
  }

  return (
    <TokenContext.Provider value={{
      tokens,
      addToken,
      removeToken,
      defaultAmount,
      setDefaultAmount,
    }}>
      {children}
    </TokenContext.Provider>
  )
}

export const useTokens = () => useContext(TokenContext)