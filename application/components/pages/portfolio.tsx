"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTokens } from "@/components/providers/token-provider";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { Settings } from "lucide-react";
import { getUserDetails } from "@/lib/dbOperations";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
// import { encryptAndUpload } from "@/lib/lit";
const query = gql`
  {
    swapETHToTokens(
      where: { user: "0xd53cc2fAD80f2661e7Fd70fC7F2972A9fd9904C3" }
    ) {
      id
      token
    }
  }
`;
const url = "https://api.studio.thegraph.com/query/97549/swipe/version/latest";
interface SwapETHToToken {
  id: string;
  token: string;
}

interface Data {
  swapETHToTokens: SwapETHToToken[];
}

export function PortfolioPage() {
  const { data: session, status } = useSession();
  const [portfolio, setPortfolio] = useState<any>([]);

  const { savedTokens, tokenProfiles, defaultAmount, setDefaultAmount } =
    useTokens();
  const { data } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(url, query);
    },
  });

  const getAllTokensAndHashesByUser = async () => {
    (data as Data)?.swapETHToTokens.forEach((item) => {
      console.log("Hash (id):", item.id);
      console.log("Token (token):", item.token);
    });
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchPortfolio = async () => {
        const userDetails = await getUserDetails(
          session?.user?.email as string
        );
        setPortfolio(userDetails.portfolio);
      };
      fetchPortfolio();
    }
  }, [session, status]);
  const [inputValue, setInputValue] = useState<string>(defaultAmount);

  // useEffect(() => {
  //   const fetchAndUpload = async () => {
  //     const response = await fetch("../../my_seed.json"); // path to your JSON file
  //     const seedData = await response.json(); // Parse the JSON file
  //     const jsonString = JSON.stringify({
  //       "3be99109-1d74-43bf-b36e-80fdb9fe8227": {
  //         seed: seedData.seed,
  //         encrypted: true,
  //         authTag: seedData.authTag,
  //         iv: seedData.iv,
  //       },
  //     });

  //     // Encrypt and upload
  //     const uploadUrl = await encryptAndUpload(jsonString);
  //     console.log("Data uploaded to:", uploadUrl);
  //   };
  //   fetchAndUpload();
  // }, []);

  if (status !== "authenticated") {
    return <div>please sign in to view your portfolio</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-1xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Portfolio
          </h1>

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
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setDefaultAmount(inputValue)}
              >
                Set default buy
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolio.map((token: any, index: number) => (
            <motion.div
              key={token.tokenAddress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PortfolioCard
                token={{
                  address: token.address,
                  name: token.name,
                  symbol: "",
                  price: 0,
                  priceChange: 0,
                  image: token.imageUrl,
                  amount: token.amount,
                  value: token.value,
                }}
              />
            </motion.div>
          ))}
        </div>

        {portfolio.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No tokens in your portfolio yet. Start swiping to add some!
          </div>
        )}
      </div>
    </div>
  );
}
