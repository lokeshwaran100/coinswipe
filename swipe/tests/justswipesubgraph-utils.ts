import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FeeCollectionAddressUpdated,
  FeePercentageUpdated,
  OwnershipTransferred,
  SwapETHToToken,
  SwapTokenToETH
} from "../generated/justswipesubgraph/justswipesubgraph"

export function createFeeCollectionAddressUpdatedEvent(
  oldAddress: Address,
  newAddress: Address
): FeeCollectionAddressUpdated {
  let feeCollectionAddressUpdatedEvent =
    changetype<FeeCollectionAddressUpdated>(newMockEvent())

  feeCollectionAddressUpdatedEvent.parameters = new Array()

  feeCollectionAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldAddress",
      ethereum.Value.fromAddress(oldAddress)
    )
  )
  feeCollectionAddressUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newAddress",
      ethereum.Value.fromAddress(newAddress)
    )
  )

  return feeCollectionAddressUpdatedEvent
}

export function createFeePercentageUpdatedEvent(
  oldFee: BigInt,
  newFee: BigInt
): FeePercentageUpdated {
  let feePercentageUpdatedEvent = changetype<FeePercentageUpdated>(
    newMockEvent()
  )

  feePercentageUpdatedEvent.parameters = new Array()

  feePercentageUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldFee", ethereum.Value.fromUnsignedBigInt(oldFee))
  )
  feePercentageUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return feePercentageUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSwapETHToTokenEvent(
  user: Address,
  ethAmount: BigInt,
  token: Address
): SwapETHToToken {
  let swapEthToTokenEvent = changetype<SwapETHToToken>(newMockEvent())

  swapEthToTokenEvent.parameters = new Array()

  swapEthToTokenEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  swapEthToTokenEvent.parameters.push(
    new ethereum.EventParam(
      "ethAmount",
      ethereum.Value.fromUnsignedBigInt(ethAmount)
    )
  )
  swapEthToTokenEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return swapEthToTokenEvent
}

export function createSwapTokenToETHEvent(
  user: Address,
  tokenAmount: BigInt,
  token: Address
): SwapTokenToETH {
  let swapTokenToEthEvent = changetype<SwapTokenToETH>(newMockEvent())

  swapTokenToEthEvent.parameters = new Array()

  swapTokenToEthEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  swapTokenToEthEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAmount",
      ethereum.Value.fromUnsignedBigInt(tokenAmount)
    )
  )
  swapTokenToEthEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return swapTokenToEthEvent
}
