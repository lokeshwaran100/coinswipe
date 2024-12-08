"use client";

import { useEffect, useState } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { useTokens } from "@/components/providers/token-provider";
import { TokenCard } from "@/components/ui/token-card";
import { useToast } from "@/hooks/use-toast";
import { addCoinToPortfolio } from "@/lib/dbOperations";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { HfInference } from "@huggingface/inference";
const inference = new HfInference("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");

import { gql, request } from "graphql-request";
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

export function SwipePage({ category }: { category: string }) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const {
    addToken,
    defaultAmount,
    uniswapPairs,
    tokenProfiles,
    loading,
    error,
    hasMoreTokens,
    fetchMoreTokens,
  } = useTokens();
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const { data } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(url, query);
    },
  });
  const [trustScore, setTrustScore] = useState(0);
  const [tokenbought, setTokenBought] = useState(false);

  useEffect(() => {
    const callHuggingFace = async () => {
      const prompt: Array<{ role: string; content: string }> = [
        {
          role: "system",
          content: `ONLY NUMBER AS RESPONSE. Given the JSON data for a cryptocurrency token, analyze the trustworthiness of the coin based on factors such as liquidity, market data, token verification, social media presence, and developer activity. Do not provide an explanation or additional context. Only return a score out of 100 indicating the trustworthiness of the coin`,
        },
        {
          role: "user",
          content: JSON.stringify(currentToken),
        },
      ];

      let fullResponse = "";
      try {
        for await (const chunk of inference.chatCompletionStream({
          model: "mistralai/Mistral-Nemo-Instruct-2407",
          messages: prompt,
          max_tokens: 5,
          stream: false,
        })) {
          let content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
        }

        console.log(fullResponse, "fullResponse");
        setTrustScore(parseInt(fullResponse)); // Only set trust score if valid response
      } catch (err) {
        console.error("Error calling HuggingFace API:", err);
      }
    };

    callHuggingFace();
  }, [tokenbought]);

  // Background fetching of more tokens
  useEffect(() => {
    if (currentIndex >= uniswapPairs.length - 5 && hasMoreTokens) {
      fetchMoreTokens();
    }
  }, [currentIndex, uniswapPairs.length, hasMoreTokens, fetchMoreTokens]);

  // Ensure we have a token to display
  const currentToken = uniswapPairs[currentIndex];
  if (!currentToken) return null;

  // Only show initial loading state
  if (!uniswapPairs.length && loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!uniswapPairs.length) return <div>No tokens found</div>;

  const buy = async (currentIndex: number) => {
    try {
      const currentToken = tokenProfiles[currentIndex];

      const addressOfToken = currentToken.tokenAddress;
      const response = await fetch("/api/fetch-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressOfToken }), // Send addressToBuy as part of the request body
      });

      const dataa = await response.json();

      console.log("data from the contract", dataa);
      if (!dataa.success) {
        throw new Error(dataa.error || "Contract call failed");
      }

      // Update wallet data with contract call results
      console.log(dataa);

      // GETTING THE LAST TX HASH by the user from subgraph
      const address = (data as Data)?.swapETHToTokens[0].id;
      console.log(address);

      await addCoinToPortfolio(
        session?.user?.email as string,
        uniswapPairs[currentIndex],
        defaultAmount
      );
      toast({
        title: "Token bought",
        description: (
          <>
            Successfully bought {defaultAmount} ETH worth.{" "}
            <a
              href={`https://sepolia.basescan.org/address/0xd53cc2fad80f2661e7fd70fc7f2972a9fd9904c3`}
              target="_blank"
              style={{ color: "#3498db" }}
            >
              Click here for details
            </a>
          </>
        ),
      });
    } catch (err) {
      console.error("Error calling contract:", err);
      toast({
        title: "Error",
        description: "Error calling contract",
        variant: "destructive",
      });
    }
    console.log("token bought", uniswapPairs[currentIndex]);

    setTokenBought(true);
  };

  const skip = async (currentIndex: number) => {
    console.log("token skipped", uniswapPairs[currentIndex]);
    setTokenBought(false);
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        await controls.start({ x: 500, opacity: 0 });
        addToken({ ...uniswapPairs[currentIndex], amount: defaultAmount });
        buy(currentIndex);
      } else {
        await controls.start({ x: -500, opacity: 0 });
        skip(currentIndex);
      }
      controls.set({ x: 0, opacity: 1 });

      // Only increment if we have more tokens
      if (currentIndex < uniswapPairs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
      }
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex gap-4">
            <ThumbsDown className="w-6 h-6 text-red-500" />
            <ThumbsUp className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="touch-none flex justify-center"
        >
          <TokenCard token={currentToken} trustScore={trustScore} />
        </motion.div>
      </div>
    </div>
  );
}
