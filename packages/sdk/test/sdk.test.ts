import { ethers } from 'ethers';
import { setupTestEnv, TEST_CONFIG, expect } from './setup';
import { TestSDK } from './helpers';
import { TaskType } from '../src/types';

describe('AIAgentsSDK', () => {
  afterEach(() => {
    // Restore original Contract constructor if it was mocked
    if ((ethers as any).Contract.mockRestore) {
      (ethers as any).Contract.mockRestore();
    }
  });
  describe('Initialization', () => {
    it('should initialize with different configs', async () => {
      const { signer } = await setupTestEnv();
      
      // Test with default config
      const sdk1 = new TestSDK(TEST_CONFIG, signer);
      expect(sdk1).to.be.instanceOf(TestSDK);
      
      // Test with different network config
      const sdk2 = new TestSDK({
        ...TEST_CONFIG,
        network: {
          ...TEST_CONFIG.network,
          rpcUrl: "http://localhost:8546"
        }
      }, signer);
      expect(sdk2).to.be.instanceOf(TestSDK);
    });
  });

  describe('Task Management', () => {
    it('should create task and emit event', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskParams = {
        prompt: "Test task",
        taskType: TaskType.SIMPLE
      };
      
      // Mock event emission
      const mockTaskAddress = "0x0000000000000000000000000000000000000003";
      const tx = {
        wait: async () => ({
          events: [{
            event: "TaskCreated",
            args: { task: mockTaskAddress }
          }]
        })
      };
      
      const mockTaskRegistry = {
        createTask: jest.fn().mockResolvedValue(tx)
      };
      (sdk as any)._taskRegistry = mockTaskRegistry;
      
      const result = await sdk.createTask(taskParams);
      expect(result).to.equal(mockTaskAddress);
    });

    it('should assign task to agent', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000003";
      const agentAddress = "0x0000000000000000000000000000000000000004";
      
      let assigned = false;
      const mockTaskRegistry = {
        assignTo: jest.fn().mockImplementation(async () => {
          assigned = true;
          return { wait: async () => {} };
        })
      };
      (sdk as any)._taskRegistry = mockTaskRegistry;
      
      await sdk.assignTask(taskAddress, agentAddress);
      expect(assigned).to.be.true;
    });

    it.only('should get tasks by owner', async () => {
      // const { sdk } = await setupTestEnv();
      const { signer } = await setupTestEnv();
      const sdk = new TestSDK(TEST_CONFIG, signer);

      // Test with default config
      // const sdk1 = new TestSDK(TEST_CONFIG, signer);
      const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      const tasks = await sdk.getTasksByOwner(ownerAddress);
      console.log(tasks);
      // const mockTasks = [
      //   "0x0000000000000000000000000000000000000006",
      //   "0x0000000000000000000000000000000000000007"
      // ];
      
      // const mockTaskRegistry = {
      //   getTasksByOwner: jest.fn().mockResolvedValue(mockTasks)
      // };
      // (sdk as any)._taskRegistry = mockTaskRegistry;
      
      // const tasks = await sdk.getTasksByOwner(ownerAddress);
      // expect(tasks).to.deep.equal(mockTasks);
    });
  });

  describe('Agent Management', () => {
    it('should register agent', async () => {
      
      const { sdk } = await setupTestEnv();
      
      const agentAddress = "0x0000000000000000000000000000000000000008";
      const skills = ["skill1", "skill2"];
      
      
      let registered = false;
      const mockAgentRegistry = {
        registerAgent: jest.fn().mockImplementation(async () => {
          registered = true;
          return { 
            wait: async () => ({
              events: [{
                event: "AgentRegistered",
                args: { agent: "0x0000000000000000000000000000000000000001" }
              }]
            })
          };
        })
      };
      (sdk as any)._agentRegistry = mockAgentRegistry;
      
      await sdk.registerAgent("gpt-4", "Test prompt", [
        { name: "skill1", level: 1 },
        { name: "skill2", level: 2 }
      ]);
      expect(registered).to.be.true;
    });

    it('should get agent data', async () => {
      const { sdk } = await setupTestEnv();
      
      const agentAddress = "0x0000000000000000000000000000000000000009";
      const mockData = {
        reputation: 100,
        skills: ["skill1", "skill2"]
      };
      
      const mockAgentRegistry = {
        getReputation: jest.fn().mockResolvedValue(BigInt(mockData.reputation)),
        getSkills: jest.fn().mockResolvedValue(mockData.skills.map(s => ({ name: s, level: 1 }))),
        isRegistered: jest.fn().mockResolvedValue(true)
      };
      (sdk as any)._agentRegistry = mockAgentRegistry;
      
      const data = await sdk.getAgentData(agentAddress);
      expect(data).to.deep.include(mockData);
    });
  });

  describe('Task Instance Methods', () => {
    it('should get task data', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000010";
      const mockData = {
        prompt: "Test prompt",
        taskType: "test",
        assignee: "0x0000000000000000000000000000000000000011",
        status: 1
      };
      
      const mockContract = {
        tasks: jest.fn().mockResolvedValue([
          mockData.prompt,
          mockData.taskType,
          "0x0000000000000000000000000000000000000001", // owner
          mockData.status,
          mockData.assignee
        ])
      };
      (sdk as any)._taskRegistry = mockContract;
      
      const data = await sdk.getTaskData(taskAddress);
      expect(data).to.deep.equal(mockData);
    });

    it('should execute task', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000012";
      
      // Mock the ethers.Contract constructor
      const mockTaskConnector = {
        execute: jest.fn().mockImplementation(() => ({
          wait: async () => ({
            events: [{
              event: "TaskExecuted",
              args: { success: true }
            }]
          })
        }))
      };
      
      // Mock ethers.Contract class
      const originalContract = ethers.Contract;
      (ethers as any).Contract = jest.fn().mockImplementation(() => mockTaskConnector);
      
      const mockTaskRegistry = {
        tasks: jest.fn().mockResolvedValue([
          "Test prompt",
          0,
          "0x0000000000000000000000000000000000000001",
          0,
          "0x0000000000000000000000000000000000000002"
        ])
      };
      (sdk as any)._taskRegistry = mockTaskRegistry;
      
      const result = await sdk.executeTask(taskAddress, "0x", "0x0", 0);
      expect(result).to.be.true;
    });

    it('should set task permission', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000013";
      let permissionSet = false;
      
      const mockContract = {
        setPermission: jest.fn().mockImplementation(() => {
          permissionSet = true;
          return { wait: async () => {} };
        })
      };
      
      // Replace the contract instance
      const originalContract = ethers.Contract;
      (ethers as any).Contract = jest.fn().mockImplementation(() => mockContract);
      (sdk as any)._taskRegistry = mockContract;
      
      await sdk.setTaskPermission(taskAddress, "0x0", true);
      expect(permissionSet).to.be.true;
    });
  });

  describe('Error Handling', () => {
    it('should handle failed task creation', async () => {
      const { sdk } = await setupTestEnv();
      
      // Set up mock provider with invalid chain ID
      const mockProvider = {
        getNetwork: jest.fn().mockResolvedValue({ 
          chainId: BigInt(999999), // Different from expected chain ID
          name: "Invalid Network"
        })
      };
      (sdk as any).provider = mockProvider;
      
      // Mock task registry to not interfere with chain ID validation
      (sdk as any)._taskRegistry = {
        createTask: jest.fn().mockImplementation(() => {
          throw new Error("Network validation failed: Chain ID mismatch");
        })
      };
      
      try {
        await sdk.createTask({ prompt: "Test", taskType: TaskType.SIMPLE });
        expect.fail("Should throw error");
      } catch (error: any) {
        expect(error.message).to.include("Network validation failed");
      }
    });

    it('should handle failed task execution', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000014";
      const mockTaskConnector = {
        execute: jest.fn().mockRejectedValue(new Error("Execution failed")),
        wait: jest.fn()
      };

      // Mock Contract constructor and ensure it returns proper interface
      const originalContract = ethers.Contract;
      (ethers as any).Contract = jest.fn().mockImplementation(() => ({
        execute: mockTaskConnector.execute,
        wait: mockTaskConnector.wait
      }));
      
      try {
        await sdk.executeTask(taskAddress, "0x", "0x0", 0);
        expect.fail("Should throw error");
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).to.equal("Execution failed");
        } else {
          throw error;
        }
      }
    });
  });
});