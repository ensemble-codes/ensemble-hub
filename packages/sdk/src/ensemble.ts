import { BigNumberish, ethers } from "ethers";
import { AgentData, ContractConfig, Proposal, TaskData, TaskCreationParams } from "./types";
import { ContractService } from "./services/ContractService";
import { TaskService } from "./services/TaskService";
import { AgentService } from "./services/AgentService";
import { ProposalService } from "./services/ProposalService";
import TaskRegistryABI from './abi/TaskRegistry.abi.json';
import AgentRegistryABI from './abi/AgentsRegistry.abi.json';

export class Ensemble {
  protected contractService: ContractService;
  private taskService: TaskService;
  private agentService: AgentService;
  private proposalService: ProposalService;

  constructor(config: ContractConfig, signer: ethers.Wallet) {
    this.contractService = new ContractService(
      new ethers.JsonRpcProvider(config.network.rpcUrl),
      signer
    );

    // Initialize services
    const taskRegistry = this.contractService.createContract(
      config.taskRegistryAddress,
      TaskRegistryABI
    );
    
    const agentRegistry = this.contractService.createContract(
      config.agentRegistryAddress,
      AgentRegistryABI
    );

    this.taskService = new TaskService(taskRegistry);
    this.agentService = new AgentService(agentRegistry, signer);
    this.proposalService = new ProposalService({
      projectId: 'ensemble-ai-443111',
      topicName: 'ensemble-tasks',
      taskRegistry: taskRegistry
    });
  }
  
  async start() {
    this.taskService.subscribe()
    await this.proposalService.setupSubscription(await this.agentService.getAddress());
  }

  async stop() {
    
  }

  // Public API methods that delegate to appropriate services
  async createTask(params: TaskCreationParams): Promise<bigint> {
    return this.taskService.createTask(params);
  }

  async registerAgent(model: string, prompt: string, skills: string[]): Promise<string> {
    return this.agentService.registerAgent(model, prompt, skills);
  }

  async getWalletAddress(): Promise<string> {
    return this.agentService.getAddress();
  }

  async sendProposal(taskId: string, price: BigNumberish): Promise<void> {
    return this.proposalService.sendProposal(taskId, await this.agentService.getAddress(), price);
  }

  async getProposals(taskId: string): Promise<string[]> {
    return this.proposalService.getProposals(taskId);
  }

  async getTasksByOwner(owner: string): Promise<string[]> {
    return this.taskService.getTasksByOwner(owner);
  }

  async getAgentData(agentId: string): Promise<AgentData> {
    return this.agentService.getAgentData(agentId);
  }
  async isAgentRegistered(agentId: string): Promise<boolean> {
    return this.agentService.isAgentRegistered(agentId);
  }

  async getTaskData(taskId: string): Promise<TaskData> {
    return this.taskService.getTaskData(taskId);
  }

  async approveProposal(taskId: BigNumberish, proposal: Proposal): Promise<void> {
    return this.proposalService.approveProposal(taskId, proposal);
  }

  async completeTask(taskId: BigNumberish, result: string): Promise<void> {
    return this.taskService.completeTask(taskId, result);
  }

  async setOnNewTaskListener(listener: (taskId: string) => void) {
    return this.taskService
  }

  async setOnNewProposalListener(listener: (proposal: Proposal) => void) {
    return this.proposalService.setOnNewProposalListener(listener);
  }
} 
