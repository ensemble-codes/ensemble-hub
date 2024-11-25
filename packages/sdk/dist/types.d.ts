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
    assignTo(taskAddress: string, agentAddress: string): Promise<{
        wait(): Promise<{
            events: Array<{
                event: string;
                args: AgentAssignedEvent;
            }>;
        }>;
    }>;
    setPermission(taskAddress: string, user: string, allowed: boolean): Promise<{
        wait(): Promise<void>;
    }>;
    getTasksByOwner(ownerAddress: string): Promise<string[]>;
    getStatus(taskAddress: string): Promise<TaskStatus>;
    getAssignee(taskAddress: string): Promise<string>;
    tasks(taskAddress: string): Promise<[string, number, string, number, string]>;
}
export interface AgentRegistryContract extends BaseContract {
    registerAgent(model: string, prompt: string, skillNames: string[], skillLevels: number[]): Promise<{
        wait(): Promise<{
            events: Array<{
                event: string;
                args: {
                    agent: string;
                    model: string;
                };
            }>;
        }>;
    }>;
    updateReputation(reputation: BigNumberish): Promise<any>;
    getSkills(): Promise<Skill[]>;
    getReputation(): Promise<bigint>;
    addSkill(name: string, level: number): Promise<any>;
    isRegistered(agent: string): Promise<boolean>;
    getAgentData(agent: string): Promise<[string, string, Skill[], BigNumberish]>;
}
export interface TaskConnectorContract extends BaseContract {
    execute(data: string, target: string, value: BigNumberish): Promise<{
        wait(): Promise<{
            events: Array<{
                event: string;
                args: {
                    taskId: BigNumberish;
                    success: boolean;
                };
            }>;
        }>;
    }>;
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
    owner: string;
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
