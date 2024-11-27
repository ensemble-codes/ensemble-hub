import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PermissionUpdated as PermissionUpdatedEvent,
  TaskAssigned as TaskAssignedEvent,
  TaskCreated as TaskCreatedEvent,
  TaskStatusChanged as TaskStatusChangedEvent,
} from "../generated/TaskRegistry/TaskRegistry"
import {
  OwnershipTransferred,
  PermissionUpdated,
  TaskAssigned,
  TaskCreated,
  TaskStatusChanged,
  Task,
} from "../generated/schema"

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.taskId = event.params.taskId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let task = new Task(
    event.params.taskId.toString()
  )
  task.owner = event.params.owner
  task.taskId = event.params.taskId
  task.prompt = event.params.prompt
  task.taskType = event.params.taskType
  task.status = 0 // Assuming 0 corresponds to TaskStatus.CREATED in the enum
  
  task.blockNumber = event.block.number
  task.blockTimestamp = event.block.timestamp
  task.transactionHash = event.transaction.hash

  task.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePermissionUpdated(event: PermissionUpdatedEvent): void {
  let entity = new PermissionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.user = event.params.user
  entity.allowed = event.params.allowed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskAssigned(event: TaskAssignedEvent): void {
  let entity = new TaskAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.agent = event.params.agent

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let task = Task.load(event.params.taskId.toString())
  if (task) {
    task.assignee = event.params.agent
    task.save()
  }
}

export function handleTaskStatusChanged(event: TaskStatusChangedEvent): void {
  let entity = new TaskStatusChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.taskId = event.params.taskId
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let task = Task.load(event.params.taskId.toString())
  if (task) {
    task.status = event.params.status
    task.save()
  }
}
