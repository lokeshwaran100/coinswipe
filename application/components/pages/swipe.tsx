"use client";

import { useEffect, useState } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { useTokens } from "@/components/providers/token-provider";
import { TokenCard } from "@/components/ui/token-card";
import { useToast } from "@/hooks/use-toast";
export function SwipePage({ category }: { category: string }) {
  const {toast} = useToast();
  const router = useRouter();
  const { 
    addToken, 
    defaultAmount, 
    uniswapPairs, 
    loading, 
    error,
    hasMoreTokens,
    fetchMoreTokens 
  } = useTokens();
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  // Background fetching of more tokens
  useEffect(() => {
    if (currentIndex >= uniswapPairs.length - 5 && hasMoreTokens) {
      fetchMoreTokens();
    }
  }, [currentIndex, uniswapPairs.length, hasMoreTokens, fetchMoreTokens]);

  // Only show initial loading state
  if (!uniswapPairs.length && loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!uniswapPairs.length) return <div>No tokens found</div>;

  const buy = async (currentIndex: number) => {
    try {
      // const response = await fetch("/api/fetch-wallet", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // const data = await response.json();

      // if (!data.success) {
      //   throw new Error(data.error || "Contract call failed");
      // }

      // // Update wallet data with contract call results
      // console.log(data);
      toast({
        title: "Token bought",
        description: `successfully bought ${defaultAmount} ETH worth of ${uniswapPairs[currentIndex].baseToken.name}`,
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
  };

  const skip = (currentIndex: number) => {
    console.log("token skipped", uniswapPairs[currentIndex]);
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
        setCurrentIndex(prev => prev + 1);
      }
      else{
        
      }
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  // Ensure we have a token to display
  const currentToken = uniswapPairs[currentIndex];
  if (!currentToken) return null;

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
          <TokenCard token={currentToken} />
        </motion.div>
      </div>
    </div>
  );
}
