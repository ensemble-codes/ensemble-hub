import { ethers } from 'ethers';
import { setupTestEnv, TEST_CONFIG, expect } from './setup';
import { TestSDK } from './helpers';
import { TaskType } from '../src/types';

describe('AIAgentsSDK', () => {
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
      
      const { mockTaskRegistry } = await setupTestEnv();
      mockTaskRegistry.createTask.mockResolvedValue(tx);
      
      const result = await sdk.createTask(taskParams);
      expect(result).to.equal(mockTaskAddress);
    });

    it('should assign task to agent', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000003";
      const agentAddress = "0x0000000000000000000000000000000000000004";
      
      let assigned = false;
      const { mockTaskRegistry } = await setupTestEnv();
      mockTaskRegistry.assignAgent.mockImplementation(async () => {
        assigned = true;
        return { wait: async () => {} };
      });
      
      await sdk.assignTask(taskAddress, agentAddress);
      expect(assigned).to.be.true;
    });

    it('should get tasks by owner', async () => {
      const { sdk } = await setupTestEnv();
      
      const ownerAddress = "0x0000000000000000000000000000000000000005";
      const mockTasks = [
        "0x0000000000000000000000000000000000000006",
        "0x0000000000000000000000000000000000000007"
      ];
      
      const { mockTaskRegistry } = await setupTestEnv();
      mockTaskRegistry.getTasksByOwner.mockResolvedValue(mockTasks);
      
      const tasks = await sdk.getTasksByOwner(ownerAddress);
      expect(tasks).to.deep.equal(mockTasks);
    });
  });

  describe('Agent Management', () => {
    it('should register agent', async () => {
      const { sdk } = await setupTestEnv();
      
      const agentAddress = "0x0000000000000000000000000000000000000008";
      const skills = ["skill1", "skill2"];
      
      let registered = false;
      const { mockAgentRegistry } = await setupTestEnv();
      mockAgentRegistry.registerAgent.mockImplementation(async () => {
        registered = true;
        return { wait: async () => {} };
      });
      
      await sdk.registerAgent(agentAddress, skills);
      expect(registered).to.be.true;
    });

    it('should get agent data', async () => {
      const { sdk } = await setupTestEnv();
      
      const agentAddress = "0x0000000000000000000000000000000000000009";
      const mockData = {
        reputation: 100,
        skills: ["skill1", "skill2"]
      };
      
      const { mockAgentRegistry } = await setupTestEnv();
      mockAgentRegistry.getReputation.mockResolvedValue(mockData.reputation);
      mockAgentRegistry.getSkills.mockResolvedValue(mockData.skills);
      
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
      
      // Mock contract methods
      const mockContract = {
        prompt: async () => mockData.prompt,
        taskType: async () => mockData.taskType,
        assignee: async () => mockData.assignee,
        status: async () => mockData.status
      };
      
      (sdk as TestSDK).setMockTaskContract(taskAddress, mockContract);
      
      const data = await sdk.getTaskData(taskAddress);
      expect(data).to.deep.equal(mockData);
    });

    it('should execute task', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000012";
      const mockTx = { hash: "0x123" };
      
      const mockContract = {
        execute: async () => mockTx
      };
      
      (sdk as TestSDK).setMockTaskContract(taskAddress, mockContract);
      
      const result = await sdk.executeTask(taskAddress, "0x", "0x0", 0);
      expect(result).to.deep.equal(mockTx);
    });

    it('should set task permission', async () => {
      const { sdk } = await setupTestEnv();
      
      const taskAddress = "0x0000000000000000000000000000000000000013";
      let permissionSet = false;
      
      const mockContract = {
        setPermission: async () => {
          permissionSet = true;
          return { wait: async () => {} };
        }
      };
      
      (sdk as TestSDK).setMockTaskContract(taskAddress, mockContract);
      
      await sdk.setTaskPermission(taskAddress, "0x0", true);
      expect(permissionSet).to.be.true;
    });
  });

  describe('Error Handling', () => {
    it('should handle failed task creation', async () => {
      const { sdk } = await setupTestEnv();
      
      const prototype = Object.getPrototypeOf(sdk);
      prototype._taskRegistry = {
        createTask: async () => {
          throw new Error("Transaction failed");
        }
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
      const mockContract = {
        execute: async () => {
          throw new Error("Execution failed");
        }
      };
      
      (sdk as TestSDK).setMockTaskContract(taskAddress, mockContract);
      
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