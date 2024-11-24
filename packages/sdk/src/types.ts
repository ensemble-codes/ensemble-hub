import { BigNumberish } from "ethers";
import { Contract, BaseContract, ContractRunner } from "ethers";

export interface TaskCreatedEvent {
  owner: string;
  task: string;
}

export interface AgentAssignedEvent {
  task: string;
  agent: string;
}

export interface TaskRegistryContract extends BaseContract {
  createTask(prompt: string, taskType: TaskType): Promise<{
    wait(): Promise<{ events: Array<{ event: string; args: TaskCreatedEvent }> }>;
  }>;
  assignAgent(taskAddress: string, agentAddress: string): Promise<{
    wait(): Promise<{ events: Array<{ event: string; args: AgentAssignedEvent }> }>;
  }>;
  getTasksByOwner(ownerAddress: string): Promise<string[]>;
}

export interface AgentRegistryContract extends BaseContract {
  registerAgent(
    model: string,
    prompt: string,
    skillNames: string[],
    skillLevels: number[]
  ): Promise<{ wait(): Promise<{ events: Array<{ event: string; args: { agent: string; model: string } }> }> }>;
  updateReputation(reputation: BigNumberish): Promise<any>;
  getSkills(): Promise<Skill[]>;
  getReputation(): Promise<bigint>;
  addSkill(name: string, level: number): Promise<any>;
  isRegistered(agent: string): Promise<boolean>;
  getAgentData(agent: string): Promise<[string, string, Skill[], BigNumberish]>;
}

export interface TaskContract extends BaseContract {
  prompt(): Promise<string>;
  taskType(): Promise<TaskType>;
  assignee(): Promise<string>;
  status(): Promise<TaskStatus>;
  permissions(address: string): Promise<boolean>;
  setPermission(user: string, allowed: boolean): Promise<any>;
  assignTo(assignee: string): Promise<any>;
  execute(data: string, target: string, value: BigNumberish): Promise<boolean>;
  getStatus(): Promise<TaskStatus>;
  getAssignee(): Promise<string>;
}

export enum TaskType {
  SIMPLE,
  COMPLEX,
  COMPOSITE
}

export enum TaskStatus {
  CREATED,
  ASSIGNED,
  COMPLETED,
  FAILED
}

export interface TaskData {
  prompt: string;
  taskType: TaskType;
  assignee?: string;
  status: TaskStatus;
}

export interface Skill {
  name: string;
  level: number;
}

export interface AgentData {
  address: string;
  model: string;
  prompt: string;
  skills: Skill[];
  reputation: BigNumberish;
  isRegistered: boolean;
}

export interface TaskCreationParams {
  prompt: string;
  taskType: TaskType;
}

export interface NetworkConfig {
  chainId: number;
  name?: string;
  rpcUrl: string;
}

export interface ContractConfig {
  taskRegistryAddress: string;
  agentRegistryAddress: string;
  network: NetworkConfig;
}
