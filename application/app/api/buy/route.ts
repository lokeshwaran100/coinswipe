import { NextResponse } from "next/server";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { parseEther } from "ethers";
// import { downloadAndDecrypt } from "@/lib/lit";
// import seed from "";

export async function POST(request: Request) {
  try {
    const { addressOfToken, ethAmount } = await request.json(); // Extract addressToBuy from the request
    // Configure Coinbase SDK
    const apiKeyName =
      "organizations/34030d3c-581b-4d96-92a6-6fd0dd21e969/apiKeys/f7fdffbf-b65d-4f22-b2b7-3a340a8541cb";
    const privateKey =
      "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIHpXLAmHtxtlk9D+2AtJh4olcnWEThP6RjJey6WI6jjtoAoGCCqGSM49\nAwEHoUQDQgAErvPP36NtEqBrExc9mS1fjr12LpI9nCQfyI3hnlMoJLlRFS+xsRTk\n8t4nCP69sv0TOOv2aPgHMwKgRncrdpdlAg==\n-----END EC PRIVATE KEY-----\n";
    Coinbase.configure({ apiKeyName: apiKeyName, privateKey: privateKey });

    // Pick a file to which to save your wallet seed.
    const path = require("path");
    const filePath = path.join(process.cwd(), "my_seed.json");

    const fetchedWallet = await Wallet.fetch(
      "3be99109-1d74-43bf-b36e-80fdb9fe8227"
    );

    // You can now load the seed into the wallet from the local file.
    // fetchedWallet will be equivalent to importedWallet.
    await fetchedWallet.loadSeed(filePath);

    // importedWallet will be equivalent to wallet.
    let wallet = fetchedWallet;
    // Get default address as string
    const address = await wallet.getDefaultAddress();
    const walletAddress = address.toString();
    console.log(walletAddress);

    const approveInvocation = await wallet.invokeContract({
      contractAddress: "0x4200000000000000000000000000000000000006",
      method: "approve",
      args: {
        guy: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        wad: "10000000000000",
      },
      abi: [
        {
          constant: false,
          inputs: [
            {
              internalType: "address",
              name: "guy",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    });

    const appResult = await approveInvocation.wait();
    console.log(appResult);

    // Execute the contract call
    const buyInvocation = await wallet.invokeContract({
      contractAddress: "0xd9145CCE52D386f254917e481eB44e9943F39138",
      method: "swapETHToToken",
      args: {
        _token: addressOfToken as string,
        _ethAmount: parseEther(ethAmount).toString(),
        _minTokens: "39200",
      },
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_ethAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_minTokens",
              type: "uint256",
            },
          ],
          name: "swapETHToToken",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      // amount: 1000000000000,
    });

    const result = await buyInvocation.wait();
    console.log(result);

    return NextResponse.json({
      success: true,
      data: {
        feeCollectionAddress: "result", // Assuming result contains the address
      },
    });
  } catch (error) {
    console.error("Contract call failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Contract call failed",
      },
      { status: 500 }
    );
  }
}
