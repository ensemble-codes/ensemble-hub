import { ethers } from 'ethers';
import { expect } from './setup';
// import { TestSDK } from './helpers';
import { AIAgentsSDK } from '../src/sdk';
import { TaskType } from '../src/types';
import dotenv from 'dotenv';

dotenv.config({ path: '.env', override: true });

export const setupEnv = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  return {
    provider,
    signer: wallet
  };
}

const config = {
  network: {
    rpcUrl: process.env.RPC_URL!,
    chainId: parseInt(process.env.CHAIN_ID!, 10),
    name: process.env.NETWORK_NAME!
  },
  taskRegistryAddress: process.env.TASK_REGISTRY_ADDRESS!,
  agentRegistryAddress: process.env.AGENT_REGISTRY_ADDRESS!
}

describe('AIAgentsSDK', () => {

  let sdk: AIAgentsSDK;

  beforeEach(() => {
    const { signer } = setupEnv();
    sdk = new AIAgentsSDK(config, signer);
  });
  describe('Initialization', () => {
    it('should initialize with different configs', async () => {
      const { signer } = await setupEnv();
      const sdk1 = new AIAgentsSDK(config, signer);
      expect(sdk1).to.be.instanceOf(AIAgentsSDK);
    });
  });

  describe('Task Management', () => {
    it('should create task and emit event', async () => {
      
      const taskParams = {
        prompt: "Test task",
        taskType: TaskType.SIMPLE
      };
      

      const taskId = await sdk.createTask(taskParams);
      expect(taskId).to.be.a('bigint');
      console.log('tx:', taskId);
    });


    it('should get tasks by owner', async () => {
      // const { sdk } = await setupEnv();

      // Test with default config
      // const sdk1 = new TestSDK(TEST_CONFIG, signer);
      const ownerAddress = await sdk.getWalletAddress();
      
      const tasks = await sdk.getTasksByOwner(ownerAddress);
      expect(tasks).to.be.an('array');
      expect(tasks).to.have.lengthOf(1);
    });
  });

  describe.skip('Agent Management', () => {
    let agentAddress: string;
    const agentData = {
      model: "gpt-4",
      prompt: "You are a crypto analyzer agent",
      skills: ["analyzing stables", "analyzing memes"]
    };
    it('should register agent', async () => {      
      agentAddress = await sdk.registerAgent(agentData.model, agentData.prompt, agentData.skills);
      console.log('agentId:', agentAddress);
      expect(agentAddress).to.be.a('string');
    });

    it('should get agent data', async () => {
      const data = await sdk.getAgentData(agentAddress);
      expect(data).to.deep.include(agentData);
    });
  });

  describe('Proposal Management', () => {
    it('should approve proposal and emit event', async () => {

      const agentData = {
        model: "gpt-4",
        prompt: "You are a crypto analyzer agent",
        skills: ["analyzing stables", "analyzing memes"]
      };

      const agentAddress = await sdk.getWalletAddress()
      if (!(await sdk.isAgentRegistered(agentAddress))) {
        console.log('registering agent');
        await sdk.registerAgent(agentData.model, agentData.prompt, agentData.skills);
      }


      const taskId = 1; // Assuming a task with ID 1 exists
      const proposal = {
        id: 1,
        price: 100,
        taskId: taskId,
        agent: agentAddress
      };

      let taskData = await sdk.getTaskData(taskId.toString());
      console.log('taskData:', taskData);

      const tx = await sdk.approveProposal(taskId, proposal);
      // expect(tx).to.be.a('object');
      // console.log('tx:', tx);

      taskData = await sdk.getTaskData(taskId.toString());
      console.log('taskData:', taskData);
      expect(taskData.status).to.equal(BigInt(1));
      expect(taskData.assignee).to.equal(agentAddress);
    });

    it('should complete task and emit event', async () => {
      const taskId = '1'; // Assuming a task with ID 1 exists
      const result = "Task completed successfully";

      const tx = await sdk.completeTask(taskId, result);
      // expect(tx).to.be.a('object');
      console.log('tx:', tx);

      const taskData = await sdk.getTaskData(taskId);
      console.log('taskData:', taskData);
      expect(taskData.status).to.equal(BigInt(2));
    });

  });

  // describe('Task Instance Methods', () => {
  //   it('should get task data', async () => {
  //     const { sdk } = await setupEnv();
      
  //     const taskAddress = "0x0000000000000000000000000000000000000010";
  //     const mockData = {
  //       prompt: "Test prompt",
  //       taskType: "test",
  //       assignee: "0x0000000000000000000000000000000000000011",
  //       status: 1
  //     };
      
  //     const mockContract = {
  //       tasks: jest.fn().mockResolvedValue([
  //         mockData.prompt,
  //         mockData.taskType,
  //         "0x0000000000000000000000000000000000000001", // owner
  //         mockData.status,
  //         mockData.assignee
  //       ])
  //     };
  //     (sdk as any)._taskRegistry = mockContract;
      
  //     const data = await sdk.getTaskData(taskAddress);
  //     expect(data).to.deep.equal(mockData);
  //   });

  //   it('should execute task', async () => {
  //     const { sdk } = await setupEnv();
      
  //     const taskAddress = "0x0000000000000000000000000000000000000012";
      
  //     // Mock the ethers.Contract constructor
  //     const mockTaskConnector = {
  //       execute: jest.fn().mockImplementation(() => ({
  //         wait: async () => ({
  //           events: [{
  //             event: "TaskExecuted",
  //             args: { success: true }
  //           }]
  //         })
  //       }))
  //     };
      
  //     // Mock ethers.Contract class
  //     const originalContract = ethers.Contract;
  //     (ethers as any).Contract = jest.fn().mockImplementation(() => mockTaskConnector);
      
  //     const mockTaskRegistry = {
  //       tasks: jest.fn().mockResolvedValue([
  //         "Test prompt",
  //         0,
  //         "0x0000000000000000000000000000000000000001",
  //         0,
  //         "0x0000000000000000000000000000000000000002"
  //       ])
  //     };
  //     (sdk as any)._taskRegistry = mockTaskRegistry;
      
  //     const result = await sdk.executeTask(taskAddress, "0x", "0x0", 0);
  //     expect(result).to.be.true;
  //   });

  //   it('should set task permission', async () => {
  //     const { sdk } = await setupEnv();
      
  //     const taskAddress = "0x0000000000000000000000000000000000000013";
  //     let permissionSet = false;
      
  //     const mockContract = {
  //       setPermission: jest.fn().mockImplementation(() => {
  //         permissionSet = true;
  //         return { wait: async () => {} };
  //       })
  //     };
      
  //     // Replace the contract instance
  //     const originalContract = ethers.Contract;
  //     (ethers as any).Contract = jest.fn().mockImplementation(() => mockContract);
  //     (sdk as any)._taskRegistry = mockContract;
      
  //     await sdk.setTaskPermission(taskAddress, "0x0", true);
  //     expect(permissionSet).to.be.true;
  //   });
  // });

  // describe('Error Handling', () => {
  //   it('should handle failed task creation', async () => {
  //     const { sdk } = await setupEnv();
      
  //     // Set up mock provider with invalid chain ID
  //     const mockProvider = {
  //       getNetwork: jest.fn().mockResolvedValue({ 
  //         chainId: BigInt(999999), // Different from expected chain ID
  //         name: "Invalid Network"
  //       })
  //     };
  //     (sdk as any).provider = mockProvider;
      
  //     // Mock task registry to not interfere with chain ID validation
  //     (sdk as any)._taskRegistry = {
  //       createTask: jest.fn().mockImplementation(() => {
  //         throw new Error("Network validation failed: Chain ID mismatch");
  //       })
  //     };
      
  //     try {
  //       await sdk.createTask({ prompt: "Test", taskType: TaskType.SIMPLE });
  //       expect.fail("Should throw error");
  //     } catch (error: any) {
  //       expect(error.message).to.include("Network validation failed");
  //     }
  //   });

  //   it('should handle failed task execution', async () => {
  //     const { sdk } = await setupEnv();
      
  //     const taskAddress = "0x0000000000000000000000000000000000000014";
  //     const mockTaskConnector = {
  //       execute: jest.fn().mockRejectedValue(new Error("Execution failed")),
  //       wait: jest.fn()
  //     };

  //     // Mock Contract constructor and ensure it returns proper interface
  //     const originalContract = ethers.Contract;
  //     (ethers as any).Contract = jest.fn().mockImplementation(() => ({
  //       execute: mockTaskConnector.execute,
  //       wait: mockTaskConnector.wait
  //     }));
      
  //     try {
  //       await sdk.executeTask(taskAddress, "0x", "0x0", 0);
  //       expect.fail("Should throw error");
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         expect(error.message).to.equal("Execution failed");
  //       } else {
  //         throw error;
  //       }
  //     }
  //   });
  // });
});