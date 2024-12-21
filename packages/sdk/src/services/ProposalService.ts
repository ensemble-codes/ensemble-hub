import { PubSub } from '@google-cloud/pubsub';
import { Proposal } from '../types';
import { BigNumberish, ethers } from 'ethers';

export interface ProposalServiceParams {
  projectId: string;
  topicName: string;
  taskRegistry: ethers.Contract;
}

export class ProposalService {
  private pubsub: PubSub;
  private topicName: string;
  private subscription: any;
  private taskRegistry: ethers.Contract;
  protected onNewProposal: (proposal: Proposal) => void = () => {};

  constructor(params: ProposalServiceParams) {
    this.pubsub = new PubSub({projectId: params.projectId});
    this.topicName = params.topicName;
    this.taskRegistry = params.taskRegistry;
  }


  /**
   * Subscribes to new proposals using Google PubSub.
   */
  public async setupSubscription(userId: string) {
    const subscriptionNameOrId = `tasks-${userId}`;

    // Create a topic if it doesn't exist
    const topic = this.pubsub.topic(this.topicName);
    
    // Check if the subscription already exists
    const [subscriptions] = await topic.getSubscriptions();
    this.subscription = subscriptions.find(sub => sub.name.endsWith(subscriptionNameOrId));
    
    if (!this.subscription) {
      // Create a subscription to the topic if it doesn't exist
      [this.subscription] = await topic.createSubscription(subscriptionNameOrId);
      console.log(`Subscription ${this.subscription.name} created.`);
    } else {
      console.log(`Subscription ${this.subscription.name} already exists.`);
    }

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = (message: any) => {
      console.log(`Received message ${message.id}:`);
      const proposal = JSON.parse(message.data);
      console.log(`\Proposal: ${proposal}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;
      this.onNewProposal(proposal);
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
    // Listen for new messages until timeout is hit
    this.subscription.on('message', messageHandler);
  }

  /**
   * Sends a proposal for a task.
   * @param {string} taskId - The ID of the task.
   * @param {BigNumberish} price - The price of the proposal.
   * @returns {Promise<void>} A promise that resolves when the proposal is sent.
   */
  async sendProposal(taskId: string, agentId: string, price: BigNumberish): Promise<void> {
    const pubsub = new PubSub();
    const topicName = this.topicName;
    console.log(`Task ID: ${taskId} (type: ${typeof taskId})`);
    console.log(`Agent ID: ${agentId} (type: ${typeof agentId})`);
    console.log(`Price: ${price} (type: ${typeof price})`);
    const data = JSON.stringify({
      taskId: taskId.toString(),
      price: price.toString(),
      agent: agentId
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

  /**
   * Gets proposals for a task.
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<string[]>} A promise that resolves to an array of proposal IDs.
   */
  async getProposals(taskId: string): Promise<string[]> {
    // USE PUBSUB
    return [];
  }
  

  /**
   * Sets the listener for new proposals.
   * @param listener - The function to be called when a new proposal is created.
   */
  setOnNewProposalListener(listener: (proposal: Proposal) => void) {
    this.onNewProposal = listener;
  }

  /**
   * Approves a proposal for a task.
   * @param {BigNumberish} taskId - The ID of the task.
   * @param {Object} proposal - The proposal object.
   * @param {BigNumberish} proposal.id - The ID of the proposal.
   * @param {BigNumberish} proposal.price - The price of the proposal.
   * @param {BigNumberish} proposal.taskId - The ID of the task.
   * @param {string} proposal.agent - The agent address.
   * @returns {Promise<void>} A promise that resolves when the proposal is approved.
   */
  async approveProposal(taskId: BigNumberish, proposal: { id: BigNumberish; price: BigNumberish; taskId: BigNumberish; agent: string }): Promise<void> {
    try {
      const tx = await this.taskRegistry.approveProposal(taskId, proposal);
      await tx.wait();
    } catch (error) {
      console.error("Approving proposal failed:", error);
      throw error;
    }
  }
} 