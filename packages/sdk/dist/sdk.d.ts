import { ethers, BigNumberish } from "ethers";
import { TaskData, AgentData, TaskCreationParams, ContractConfig } from "./types";
export declare class AIAgentsSDK {
    private provider;
    private taskRegistry;
    private agentRegistry;
    constructor(config: ContractConfig, signer?: ethers.Signer);
    createTask(params: TaskCreationParams): Promise<string>;
    assignTask(taskAddress: string, agentAddress: string): Promise<void>;
    getTasksByOwner(ownerAddress: string): Promise<string[]>;
    registerAgent(agentAddress: string, skills: string[]): Promise<void>;
    getAgentData(agentAddress: string): Promise<AgentData>;
    getTaskData(taskAddress: string): Promise<TaskData>;
    executeTask(taskAddress: string, data: string, target: string, value?: BigNumberish): Promise<boolean>;
    setTaskPermission(taskAddress: string, user: string, allowed: boolean): Promise<void>;
    connect(signer: ethers.Signer): Promise<void>;
}
