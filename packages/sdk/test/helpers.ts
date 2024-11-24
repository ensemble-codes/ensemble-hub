import { AIAgentsSDK } from '../src/sdk';
import { ethers } from 'ethers';
import { ContractConfig, TaskRegistryContract, AgentRegistryContract } from '../src/types';

// Test helper class to access protected members
export class TestSDK extends AIAgentsSDK {
  constructor(config: ContractConfig, signer?: ethers.Signer) {
    super(config, signer);
  }

  // Expose protected members for testing
  get testTaskRegistry(): TaskRegistryContract {
    return this.taskRegistry;
  }

  get testAgentRegistry(): AgentRegistryContract {
    return this.agentRegistry;
  }

  // Mock contract creation helper
  setMockTaskContract(address: string, mockContract: any): void {
    (ethers.Contract as jest.Mock).mockImplementation((addr) => {
      if (addr === address) return mockContract;
      return this.testTaskRegistry;
    });
  }
}
