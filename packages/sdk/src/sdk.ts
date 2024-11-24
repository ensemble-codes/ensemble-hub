import { ethers, BigNumberish } from "ethers";
import { 
  TaskData, 
  AgentData, 
  TaskCreationParams, 
  ContractConfig, 
  TaskType, 
  TaskStatus,
  TaskRegistryContract,
  AgentRegistryContract,
  TaskContract
} from "./types";

export class AIAgentsSDK {
  protected provider: ethers.Provider;
  protected taskRegistry: TaskRegistryContract;
  protected agentRegistry: AgentRegistryContract;

  protected chainId: number;

  constructor(config: ContractConfig, signer?: ethers.Signer) {
    this.provider = new ethers.JsonRpcProvider(config.network.rpcUrl);
    this.chainId = config.network.chainId;
    const signerOrProvider = signer || this.provider;

    // Validate network connection and chain ID
    this.validateNetwork();

    // Load contract ABIs
    const TaskRegistryABI = require("../../../packages/contracts/artifacts/contracts/TaskRegistry.sol/TaskRegistry.json").abi;
    const AgentRegistryABI = require("../../../packages/contracts/artifacts/contracts/AgentRegistry.sol/AgentRegistry.json").abi;

    this.taskRegistry = new ethers.Contract(
      config.taskRegistryAddress,
      TaskRegistryABI,
      signerOrProvider
    ) as unknown as TaskRegistryContract;

    this.agentRegistry = new ethers.Contract(
      config.agentRegistryAddress,
      AgentRegistryABI,
      signerOrProvider
    ) as unknown as AgentRegistryContract;
  }

  // Task Management Methods
  async createTask(params: TaskCreationParams): Promise<string> {
    const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: { event: string }) => e.event === "TaskCreated");
    if (!event?.args?.task) {
      throw new Error("Task creation failed: No task address in event");
    }
    return event.args.task;
  }

  async assignTask(taskAddress: string, agentAddress: string): Promise<void> {
    const tx = await this.taskRegistry.assignAgent(taskAddress, agentAddress);
    await tx.wait();
  }

  async getTasksByOwner(ownerAddress: string): Promise<string[]> {
    return await this.taskRegistry.getTasksByOwner(ownerAddress);
  }

  // Agent Management Methods
  async registerAgent(
    model: string,
    prompt: string,
    skills: { name: string; level: number }[]
  ): Promise<string> {
    const skillNames = skills.map(s => s.name);
    const skillLevels = skills.map(s => s.level);
    
    const tx = await this.agentRegistry.registerAgent(model, prompt, skillNames, skillLevels);
    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === "AgentRegistered");
    
    if (!event?.args?.agent) {
      throw new Error("Agent registration failed: No agent address in event");
    }
    
    return event.args.agent;
  }

  async getAgentData(agentAddress: string): Promise<AgentData> {
    const [model, prompt, skills, reputation] = await this.agentRegistry.getAgentData(agentAddress);
    const isRegistered = await this.agentRegistry.isRegistered(agentAddress);

    return {
      address: agentAddress,
      model,
      prompt,
      skills,
      reputation,
      isRegistered
    };
  }

  async addAgentSkill(name: string, level: number): Promise<void> {
    const tx = await this.agentRegistry.addSkill(name, level);
    await tx.wait();
  }

  async updateAgentReputation(reputation: BigNumberish): Promise<void> {
    const tx = await this.agentRegistry.updateReputation(reputation);
    await tx.wait();
  }

  async isAgentRegistered(agentAddress: string): Promise<boolean> {
    return await this.agentRegistry.isRegistered(agentAddress);
  }

  // Task Instance Methods
  async getTaskData(taskAddress: string): Promise<TaskData> {
    const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
    const taskContract = new ethers.Contract(taskAddress, TaskABI, this.provider) as unknown as TaskContract;

    const [prompt, taskType, assignee, status] = await Promise.all([
      taskContract.prompt(),
      taskContract.taskType(),
      taskContract.assignee(),
      taskContract.status()
    ]);

    return {
      prompt,
      taskType,
      assignee: assignee || undefined,
      status
    };
  }

  async executeTask(
    taskAddress: string, 
    data: string, 
    target: string, 
    value: BigNumberish = 0
  ): Promise<boolean> {
    const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
    const taskContract = new ethers.Contract(taskAddress, TaskABI, this.provider) as unknown as TaskContract;
    
    try {
      const tx = await taskContract.execute(data, target, value);
      return tx;
    } catch (error) {
      console.error("Task execution failed:", error);
      throw error;
    }
  }

  async setTaskPermission(taskAddress: string, user: string, allowed: boolean): Promise<void> {
    const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
    const taskContract = new ethers.Contract(taskAddress, TaskABI, this.provider) as unknown as TaskContract;
    
    try {
      const tx = await taskContract.setPermission(user, allowed);
      await tx.wait();
    } catch (error) {
      console.error("Setting task permission failed:", error);
      throw error;
    }
  }

  // Network validation
  private async validateNetwork(): Promise<void> {
    try {
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(this.chainId)) {
        throw new Error(
          `Chain ID mismatch. Expected ${this.chainId}, got ${network.chainId}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Utils
  async connect(signer: ethers.Wallet | ethers.JsonRpcSigner): Promise<void> {
    this.taskRegistry = this.taskRegistry.connect(signer) as TaskRegistryContract;
    this.agentRegistry = this.agentRegistry.connect(signer) as AgentRegistryContract;
  }
}
