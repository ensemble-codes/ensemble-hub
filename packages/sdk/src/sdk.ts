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
  TaskConnectorContract
} from "./types";
import { execute } from '../.graphclient'
import  {PubSub}  from '@google-cloud/pubsub';
import TaskRegistryABI from './abi/TaskRegistry.abi.json';
import AgentRegistryABI from './abi/AgentsRegistry.abi.json';
// import { gql } from "graphql-request";

export class AIAgentsSDK {
  protected provider: ethers.Provider;
  protected taskRegistry: TaskRegistryContract;
  protected agentRegistry: AgentRegistryContract;
  protected chainId: number;
  protected pubsub: PubSub;
  protected signer: ethers.Wallet;
  protected oneNewTask: (taskId: string) => void;
  protected onTaskUpdated: (taskId: string) => void;

  constructor(config: ContractConfig, signer: ethers.Wallet, oneNewTask: (taskId: string) => void = () => {}, onTaskUpdated: (taskId: string) => void = () => {}) {
    console.log("Config:", config);
    this.provider = new ethers.JsonRpcProvider(config.network.rpcUrl);
    this.chainId = config.network.chainId;
    this.signer = signer;
    console.log('signersigner:', this.signer);
    this.oneNewTask = oneNewTask;
    this.onTaskUpdated = onTaskUpdated;
    // Validate network connection and chain ID
    this.validateNetwork();

    // Load contract ABIs
    // const TaskRegistryABI = require("./abi/TaskRegistry.json").abi;
    // const AgentRegistryABI = require("./abi/AgentsRegistry.json").abi;
    console.log('signer:', this.signer);
    this.taskRegistry = new ethers.Contract(
      config.taskRegistryAddress,
      TaskRegistryABI,
      this.signer
    ) as unknown as TaskRegistryContract;
    
    console.log('this.taskRegistry.runner:', this.taskRegistry.runner);
    console.log('this.taskRegistry.signer:', this.taskRegistry.signer);

    const taskRegistryWithSigner = this.taskRegistry.connect(this.signer);

    console.log('taskRegistryWithSigner.runner:', taskRegistryWithSigner.runner);
    console.log('taskRegistryWithSigner.signer:', taskRegistryWithSigner.signer);

    this.agentRegistry = new ethers.Contract(
      config.agentRegistryAddress,
      AgentRegistryABI,
      this.signer
    ) as unknown as AgentRegistryContract;

    this.pubsub = new PubSub({projectId: 'projects/ensemble-ai-443111/topics/ensemble-tasks'});

    // // Creates a new topic
    // const [topic] = await pubsub.createTopic(topicNameOrId);
    // // console.log(`Topic ${topic.name} created.`);
  
    // // Creates a subscription on that new topic
    // const [subscription] = await topic.createSubscription(`tasks: ${this.signer.address}`);
  
    // // Receive callbacks for new messages on the subscription
    // subscription.on('message', message => {
    //   console.log('Received message:', message.data.toString());
    // });
  }

  async start() {
    const topicNameOrId = 'projects/ensemble-ai-443111/topics/ensemble-tasks';
    const subscriptionNameOrId = `tasks: ${this.signer.address}`;
    // const timeout = 60;

    // Create a topic if it doesn't exist
    const topic = this.pubsub.topic(topicNameOrId);
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

  async getProposals(taskId: string): Promise<string[]> {
    // USE PUBSUB
    return [];
  }


  // Task Management Methods
  async createTask(params: TaskCreationParams): Promise<string> {
    console.log("Signer address:", await this.signer.getAddress());
    console.log("Signer provider:", this.signer.provider);


    console.log('this.taskRegistry.createTask:', this.taskRegistry.createTask);

    // try {
    //   // Ensure the taskRegistry has a connected signer
    //   if (!this.taskRegistry.runner) {
    //     throw new Error("Contract is not connected to a signer. Ensure you have a valid signer.");
    //   }
    // } catch (error) {
    //   console.error('Error creating task:', error);
    // }

      
    console.log('this.taskRegistry!!', this.taskRegistry.createTask);
    

    try {
      const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
      console.log('promise:', tx);
    } catch (error) {
      console.error('Error creating task:', error);
    }
    // tx.then((tx) => console.log(tx));
    // return tx;
    // const receipt = await tx.wait();
    // const event = receipt.events?.find((e: { event: string }) => e.event === "TaskCreated");
    // if (!event?.args?.task) {
    //   throw new Error("Task creation failed: No task address in event");
    // }
    // return event.args.task;
  }

  async assignTask(taskAddress: string, agentAddress: string): Promise<void> {
    const tx = await this.taskRegistry.assignTo(taskAddress, agentAddress);
    await tx.wait();
  }

  async getTasksByOwner(ownerAddress: string): Promise<string[]> {
    return this.taskRegistry.getTasksByOwner(ownerAddress);
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
    const [prompt, taskType, owner, status, assignee] = await this.taskRegistry.tasks(taskAddress);

    return {
      prompt,
      taskType,
      assignee: assignee || undefined,
      status,
      owner
    };
  }

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
