import { ethers, BigNumberish } from "ethers";
import { 
  TaskData, 
  AgentData, 
  TaskCreationParams, 
  ContractConfig, 
  TaskType, 
  TaskStatus,
  TaskConnectorContract
} from "./types";
import { execute } from '../.graphclient'
import  {PubSub}  from '@google-cloud/pubsub';
import TaskRegistryABI from './abi/TaskRegistry.abi.json';
import AgentRegistryABI from './abi/AgentsRegistry.abi.json';
// import { gql } from "graphql-request";

/**
 * @docs  - https://viem.sh/docs/ethers-migration
 */

export class AIAgentsSDK {
  protected provider: ethers.Provider;
  protected taskRegistry: ethers.Contract;
  protected agentRegistry: ethers.Contract;
  protected chainId: number;
  protected pubsub: PubSub;
  protected signer: ethers.Wallet;
  protected oneNewTask: (taskId: string) => void;
  protected onNewProposal: (taskId: string) => void;
  protected static topicName: string = 'projects/ensemble-ai-443111/topics/ensemble-tasks';

  constructor(config: ContractConfig, signer: ethers.Wallet, oneNewTask: () => void = () => {}, onNewProposal: () => void = () => {}) {
    console.log("Config:", config);
    console.log('config.network.rpcUrl:', config.network.rpcUrl);
    this.provider = new ethers.JsonRpcProvider(config.network.rpcUrl);
    this.chainId = config.network.chainId;
    this.signer = signer;
    console.log('signersigner:', this.signer);
    this.oneNewTask = oneNewTask;
    this.onNewProposal = onNewProposal;
    // Validate network connection and chain ID
    this.validateNetwork();

    console.log('signer:', this.signer);
    this.taskRegistry = new ethers.Contract(
      config.taskRegistryAddress,
      TaskRegistryABI,
      this.signer
    );
    
    // console.log('this.taskRegistry.runner:', this.taskRegistry.runner);
    // console.log('this.taskRegistry.signer:', this.taskRegistry.signer);

    this.agentRegistry = new ethers.Contract(
      config.agentRegistryAddress,
      AgentRegistryABI,
      this.signer
    );

    this.pubsub = new PubSub({projectId: 'ensemble-ai-443111'});
  }

  async start() {
    this.subscribeToNewTasks();
    this.subscribeToNewProposals();
  }

  private async subscribeToNewTasks() {
    const filter = this.taskRegistry.filters.TaskCreated();

    this.taskRegistry.on(filter, ({ args: [ owner, taskId, prompt, taskType ] }) => {
      // console.log(owner);
      console.log(`Owner: ${owner}
        Task ID: ${taskId}
        Prompt: ${prompt}
        Task Type: ${taskType}`);
      this.oneNewTask(taskId.toString());
    });
  }

  private async subscribeToNewProposals() {
    const subscriptionNameOrId = `tasks-${this.signer.address}`;
    // const timeout = 60;

    // Create a topic if it doesn't exist
    const topic = this.pubsub.topic(AIAgentsSDK.topicName);
    // Create a subscription to the topic
    const [subscription] = await topic.createSubscription(subscriptionNameOrId);
    console.log(`Subscription ${subscription.name} created.`);

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message: any) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
  }

  async getWalletAddress(): Promise<string> {
    return this.signer.getAddress();
  }

  async getTasksByStatus(owner: string, status: TaskStatus): Promise<string[]> {
    // const myQuery = gql`
    //   query {
    //     tasks(where: {owner: "${owner}", status: "${status}"}) {
    //       id
    //     }
    //   }
    //  `
    // const result = await execute(myQuery, {})
    // console.log(result)
    // return result.tasks;
    return new Promise<string[]>((resolve) => {
      resolve([]);
    });
  }

  async sendProposal(taskId: string, price: BigNumberish): Promise<void> {
    const pubsub = new PubSub();
    const topicName = AIAgentsSDK.topicName;

    const data = JSON.stringify({
      taskId,
      price: price.toString(),
      agent: await this.getWalletAddress()
    });

    const dataBuffer = Buffer.from(data);

    try {
      await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
      console.log(`Proposal for task ${taskId} sent successfully.`);
    } catch (error) {
      console.error(`Failed to send proposal for task ${taskId}:`, error);
      throw error;
    }
  }

  async getProposals(taskId: string): Promise<string[]> {
    // USE PUBSUB
    return [];
  }


  // Task Management Methods
  async createTask(params: TaskCreationParams): Promise<bigint> {
    console.log("Signer address:", await this.signer.getAddress());
    
    const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
    console.log('tx hash:', tx.hash);
    const receipt = await tx.wait();
    // console.log('receipt:', receipt);
    // console.log('receipt.events:', receipt.events);
    // console.log('receipt.logs', receipt.logs);
    
    const events = receipt.logs.map((log: any) => {
      // console.log('log:', log);
      try {
        const event = this.taskRegistry.interface.parseLog(log);
        // console.log('event:', event);
        return event;
      } catch (e) {
        console.error('error:', e);
        return null;
      }
    }).filter((event: any) => event !== null);

    const event = events?.find((e: { name: string }) => e.name === "TaskCreated");
    if (!event?.args?.[1]) {
      throw new Error("Task creation failed: No task address in event");
    }
    console.log('event:', event);
    console.log('event.args.task:', event.args[1]);
    return event.args[1];

    // try {
    //   const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
    //   console.log('promise:', tx);
    // } catch (error) {
    //   console.error('Error creating task:', error);
    // }
    // tx.then((tx) => console.log(tx));
    // return tx;
    // const receipt = await tx.wait();
    // const event = receipt.events?.find((e: { event: string }) => e.event === "TaskCreated");
    // if (!event?.args?.task) {
    //   throw new Error("Task creation failed: No task address in event");
    // }
    // return event.args.task;
    // return '';
  }


  async getTasksByOwner(ownerAddress: string): Promise<string[]> {
    return this.taskRegistry.getTasksByOwner(ownerAddress);
  }

  // Agent Management Methods
  async registerAgent(
    model: string,
    prompt: string,
    skills: string[]
  ): Promise<string> {
    
    const tx = await this.agentRegistry.registerAgent(model, prompt, skills);
    console.log('tx hash:', tx.hash);
    const receipt = await tx.wait();
    console.log('receipt:', receipt);

    const events = receipt.logs.map((log: any) => {
      console.log('log:', log);
      try {
        const event = this.agentRegistry.interface.parseLog(log);
        console.log('event:', event);
        return event;
      } catch (e) {
        console.error('error:', e);
        return null;
      }
    }).filter((event: any) => event !== null);

    const event = events.find((e: { name: string }) => e.name === "AgentRegistered");
    console.log('event:', event);
    if (!event?.args) {
      throw new Error("Agent registration failed: No agent address in event");
    }
    console.log('event.args:', event.args);
    return event.args[0];
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
  async getTaskData(taskId: string): Promise<TaskData> {
    const [id, prompt, taskType, owner, status, assignee] = await this.taskRegistry.tasks(taskId);

    return {
      id,
      prompt,
      taskType,
      assignee: assignee || undefined,
      status,
      owner
    };
  }

  //
  async executeTask(
    taskAddress: string, 
    data: string, 
    target: string, 
    value: BigNumberish = 0
  ): Promise<boolean> {
    const TaskConnectorABI = require("../../../packages/contracts/artifacts/contracts/TaskConnector.sol/TaskConnector.json").abi;
    const taskConnector = new ethers.Contract(taskAddress, TaskConnectorABI, this.provider) as unknown as TaskConnectorContract;
    
    try {
      const tx = await taskConnector.execute(data, target, value);
      const receipt = await tx.wait();
      const event = receipt.events?.find((e: { event: string }) => e.event === "TaskExecuted");
      return event?.args?.success || false;
    } catch (error) {
      console.error("Task execution failed:", error);
      throw error;
    }
  }

  async setTaskPermission(taskAddress: string, user: string, allowed: boolean): Promise<void> {
    try {
      const tx = await this.taskRegistry.setPermission(taskAddress, user, allowed);
      await tx.wait();
    } catch (error) {
      console.error("Setting task permission failed:", error);
      throw error;
    }
  }

  async approveProposal(taskId: BigNumberish, proposal: { id: BigNumberish; price: BigNumberish; taskId: BigNumberish; agent: string }): Promise<void> {
    try {
      const tx = await this.taskRegistry.approveProposal(taskId, proposal);
      await tx.wait();
    } catch (error) {
      console.error("Approving proposal failed:", error);
      throw error;
    }
  }

  async completeTask(taskId: BigNumberish, result: string): Promise<void> {
    try {
      const tx = await this.taskRegistry.completeTask(taskId, result);
      await tx.wait();
    } catch (error) {
      console.error("Completing task failed:", error);
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
  // async connect(signer: ethers.Wallet | ethers.JsonRpcSigner): Promise<void> {
  //   this.taskRegistry = this.taskRegistry.connect(signer);
  //   this.agentRegistry = this.agentRegistry.connect(signer);
  // }
}
