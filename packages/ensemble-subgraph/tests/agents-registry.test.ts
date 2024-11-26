import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AgentRegistered } from "../generated/schema"
import { AgentRegistered as AgentRegisteredEvent } from "../generated/AgentsRegistry/AgentsRegistry"
import { handleAgentRegistered } from "../src/agents-registry"
import { createAgentRegisteredEvent } from "./agents-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let agent = Address.fromString("0x0000000000000000000000000000000000000001")
    let model = "Example string value"
    let newAgentRegisteredEvent = createAgentRegisteredEvent(agent, model)
    handleAgentRegistered(newAgentRegisteredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AgentRegistered created and stored", () => {
    assert.entityCount("AgentRegistered", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AgentRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "agent",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AgentRegistered",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "model",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
