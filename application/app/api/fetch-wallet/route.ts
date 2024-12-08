import { NextResponse } from "next/server";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
// import { downloadAndDecrypt } from "@/lib/lit";
// import seed from "";

export async function POST(request: Request) {
  try {
    const { addressToBuy } = await request.json(); // Extract addressToBuy from the request
    // Configure Coinbase SDK
    Coinbase.configureFromJson({ filePath: "~/Downloads/cdp_api_key.json" });

    // Create wallet on Base Mainnet
    // const wallet = await Wallet.create();

    // Pick a file to which to save your wallet seed.
    const filePath = "my_seed.json";
    // Set encrypt to true to encrypt the wallet seed with your CDP secret API key.
    // wallet.saveSeed(filePath, true);

    // console.log(
    //   `Seed for wallet ${wallet.getId()} successfully saved to ${filePath}.`
    // );

    // You should implement the "fetch" method to retrieve the securely persisted data object,
    // keyed by the wallet ID.

    // Fetch and parse the wallet data

    // const getJsonString = async () => {
    //   const uploadUrl = "";
    //   const decryptedString = await downloadAndDecrypt(uploadUrl);
    //   console.log("Decrypted data:", decryptedString);
    // };

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

    // const faucetTransaction = await wallet.faucet();
    // console.log(`Faucet transaction: ${faucetTransaction}`);

    const approveInvocation = await wallet.invokeContract({
      contractAddress: "0x4200000000000000000000000000000000000006",
      method: "approve",
      args: {
        guy: "0x42C98f2e8d7d6c9E39d62bFA70C6F05CfcA94026",
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
      // amount: 1000000000000,
    });

    const appResult = await approveInvocation.wait();
    console.log(appResult);

    // Execute the contract call
    const buyInvocation = await wallet.invokeContract({
      contractAddress: "0x42C98f2e8d7d6c9E39d62bFA70C6F05CfcA94026",
      method: "swapETHToToken",
      args: {
        _token: addressToBuy,
        _ethAmount: "10000000000000",
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

    // const transferArgs = {
    //   to: "0xef9C9e03d8cF4fb38D8Ce3d44A956b21aC4bF90b",
    //   value: "100000000000000", // 0.001 ETH with 18 decimals
    // };

    // console.log("here");

    // let contractInvocation = await wallet.invokeContract({
    //   contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    //   method: "transfer",
    //   args: transferArgs,
    //   abi: [
    //     {
    //       inputs: [
    //         { name: "to", type: "address" },
    //         { name: "value", type: "uint256" },
    //       ],
    //       name: "transfer",
    //       outputs: [{ name: "", type: "bool" }],
    //       type: "function",
    //     },
    //   ],
    // });

    // Get the result from the invocation
    // const depositResult = await depositInvocation.wait();

    const result = await buyInvocation.wait();
    console.log(result);

    // const approveSellInvocation = await wallet.invokeContract({
    //   contractAddress: "0x5EdF9324539DaF9dFeff8E15c8A8ce813968C08e",
    //   method: "approve",
    //   args: {
    //     guy: "0x42C98f2e8d7d6c9E39d62bFA70C6F05CfcA94026",
    //     wad: "600000000000000000000000000",
    //   },
    //   abi: [
    //     {
    //       constant: false,
    //       inputs: [
    //         {
    //           internalType: "address",
    //           name: "guy",
    //           type: "address",
    //         },
    //         {
    //           internalType: "uint256",
    //           name: "wad",
    //           type: "uint256",
    //         },
    //       ],
    //       name: "approve",
    //       outputs: [
    //         {
    //           internalType: "bool",
    //           name: "",
    //           type: "bool",
    //         },
    //       ],
    //       payable: false,
    //       stateMutability: "nonpayable",
    //       type: "function",
    //     },
    //   ],
    //   // amount: 1000000000000,
    // });

    // const result = await approveSellInvocation.wait();
    // console.log(result);

    // const sellInvocation = await wallet.invokeContract({
    //   contractAddress: "0x42C98f2e8d7d6c9E39d62bFA70C6F05CfcA94026",
    //   method: "swapTokenToETH",
    //   args: {
    //     _token: "0x5EdF9324539DaF9dFeff8E15c8A8ce813968C08e",
    //     _tokenAmount: "600000000000000000",
    //     _minETH: "39200",
    //   },
    //   abi: [
    //     {
    //       inputs: [
    //         {
    //           internalType: "address",
    //           name: "_token",
    //           type: "address",
    //         },
    //         {
    //           internalType: "uint256",
    //           name: "_tokenAmount",
    //           type: "uint256",
    //         },
    //         {
    //           internalType: "uint256",
    //           name: "_minETH",
    //           type: "uint256",
    //         },
    //       ],
    //       name: "swapTokenToETH",
    //       outputs: [],
    //       stateMutability: "nonpayable",
    //       type: "function",
    //     },
    //   ],
    //   // amount: 1000000000000,
    // });

    // const result2 = await sellInvocation.wait();
    // console.log(result2);

    return NextResponse.json({
      success: true,
      data: {
        feeCollectionAddress: "result", // Assuming result contains the address
        // contractAddress,
        // method,
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
