import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FeeCollectionAddressUpdated } from "../generated/schema"
import { FeeCollectionAddressUpdated as FeeCollectionAddressUpdatedEvent } from "../generated/justswipesubgraph/justswipesubgraph"
import { handleFeeCollectionAddressUpdated } from "../src/justswipesubgraph"
import { createFeeCollectionAddressUpdatedEvent } from "./justswipesubgraph-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newFeeCollectionAddressUpdatedEvent =
      createFeeCollectionAddressUpdatedEvent(oldAddress, newAddress)
    handleFeeCollectionAddressUpdated(newFeeCollectionAddressUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FeeCollectionAddressUpdated created and stored", () => {
    assert.entityCount("FeeCollectionAddressUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FeeCollectionAddressUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FeeCollectionAddressUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
