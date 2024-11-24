import { BigNumberish } from "ethers";
import { BaseContract } from "ethers";
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
        wait(): Promise<{
            events: Array<{
                event: string;
                args: TaskCreatedEvent;
            }>;
        }>;
    }>;
    assignAgent(taskAddress: string, agentAddress: string): Promise<{
        wait(): Promise<{
            events: Array<{
                event: string;
                args: AgentAssignedEvent;
            }>;
        }>;
    }>;
    getTasksByOwner(ownerAddress: string): Promise<string[]>;
}
export interface AgentRegistryContract extends BaseContract {
    registerAgent(agentAddress: string, skills: string[]): Promise<any>;
    getReputation(agentAddress: string): Promise<bigint>;
    getSkills(agentAddress: string): Promise<string[]>;
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
export declare enum TaskType {
    SIMPLE = 0,
    COMPLEX = 1,
    COMPOSITE = 2
}
export declare enum TaskStatus {
    CREATED = 0,
    ASSIGNED = 1,
    COMPLETED = 2,
    FAILED = 3
}
export interface TaskData {
    prompt: string;
    taskType: TaskType;
    assignee?: string;
    status: TaskStatus;
}
export interface AgentData {
    address: string;
    reputation: BigNumberish;
    skills: string[];
}
export interface TaskCreationParams {
    prompt: string;
    taskType: TaskType;
}
export interface ContractConfig {
    taskRegistryAddress: string;
    agentRegistryAddress: string;
    rpcUrl: string;
}
