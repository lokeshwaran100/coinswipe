import {
  FeeCollectionAddressUpdated as FeeCollectionAddressUpdatedEvent,
  FeePercentageUpdated as FeePercentageUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SwapETHToToken as SwapETHToTokenEvent,
  SwapTokenToETH as SwapTokenToETHEvent
} from "../generated/justswipesubgraph/justswipesubgraph"
import {
  FeeCollectionAddressUpdated,
  FeePercentageUpdated,
  OwnershipTransferred,
  SwapETHToToken,
  SwapTokenToETH
} from "../generated/schema"

export function handleFeeCollectionAddressUpdated(
  event: FeeCollectionAddressUpdatedEvent
): void {
  let entity = new FeeCollectionAddressUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldAddress = event.params.oldAddress
  entity.newAddress = event.params.newAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeePercentageUpdated(
  event: FeePercentageUpdatedEvent
): void {
  let entity = new FeePercentageUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldFee = event.params.oldFee
  entity.newFee = event.params.newFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwapETHToToken(event: SwapETHToTokenEvent): void {
  let entity = new SwapETHToToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.ethAmount = event.params.ethAmount
  entity.token = event.params.token

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwapTokenToETH(event: SwapTokenToETHEvent): void {
  let entity = new SwapTokenToETH(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.tokenAmount = event.params.tokenAmount
  entity.token = event.params.token

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
