import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PermissionUpdated,
  TaskAssigned,
  TaskCreated,
  TaskStatusChanged
} from "../generated/TaskRegistry/TaskRegistry"

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

export function createPermissionUpdatedEvent(
  taskId: BigInt,
  user: Address,
  allowed: boolean
): PermissionUpdated {
  let permissionUpdatedEvent = changetype<PermissionUpdated>(newMockEvent())

  permissionUpdatedEvent.parameters = new Array()

  permissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  permissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  permissionUpdatedEvent.parameters.push(
    new ethereum.EventParam("allowed", ethereum.Value.fromBoolean(allowed))
  )

  return permissionUpdatedEvent
}

export function createTaskAssignedEvent(
  taskId: BigInt,
  agent: Address
): TaskAssigned {
  let taskAssignedEvent = changetype<TaskAssigned>(newMockEvent())

  taskAssignedEvent.parameters = new Array()

  taskAssignedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskAssignedEvent.parameters.push(
    new ethereum.EventParam("agent", ethereum.Value.fromAddress(agent))
  )

  return taskAssignedEvent
}

export function createTaskCreatedEvent(
  owner: Address,
  taskId: BigInt
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )

  return taskCreatedEvent
}

export function createTaskStatusChangedEvent(
  taskId: BigInt,
  status: i32
): TaskStatusChanged {
  let taskStatusChangedEvent = changetype<TaskStatusChanged>(newMockEvent())

  taskStatusChangedEvent.parameters = new Array()

  taskStatusChangedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskStatusChangedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return taskStatusChangedEvent
}
