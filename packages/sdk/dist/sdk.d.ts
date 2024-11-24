import { ethers, BigNumberish } from "ethers";
import { TaskData, AgentData, TaskCreationParams, ContractConfig, TaskRegistryContract, AgentRegistryContract } from "./types";
export declare class AIAgentsSDK {
    protected provider: ethers.Provider;
    protected taskRegistry: TaskRegistryContract;
    protected agentRegistry: AgentRegistryContract;
    protected chainId: number;
    constructor(config: ContractConfig, signer?: ethers.Signer);
    createTask(params: TaskCreationParams): Promise<string>;
    assignTask(taskAddress: string, agentAddress: string): Promise<void>;
    getTasksByOwner(ownerAddress: string): Promise<string[]>;
    registerAgent(model: string, prompt: string, skills: {
        name: string;
        level: number;
    }[]): Promise<string>;
    getAgentData(agentAddress: string): Promise<AgentData>;
    addAgentSkill(name: string, level: number): Promise<void>;
    updateAgentReputation(reputation: BigNumberish): Promise<void>;
    isAgentRegistered(agentAddress: string): Promise<boolean>;
    getTaskData(taskAddress: string): Promise<TaskData>;
    executeTask(taskAddress: string, data: string, target: string, value?: BigNumberish): Promise<boolean>;
    setTaskPermission(taskAddress: string, user: string, allowed: boolean): Promise<void>;
    private validateNetwork;
    connect(signer: ethers.Wallet | ethers.JsonRpcSigner): Promise<void>;
}
