import { AIAgentsSDK } from '../src/sdk';
import { ethers } from 'ethers';
import { ContractConfig } from '../src/types';

// Test helper class to access protected members
export class TestSDK extends AIAgentsSDK {
  constructor(config: ContractConfig, signer: ethers.Wallet) {
    super(config, signer);
  }

  // Expose protected members for testing
  get testTaskRegistry(): ethers.Contract {
    return this.taskRegistry;
  }

  get testAgentRegistry(): ethers.Contract {
    return this.agentRegistry;
  }
}
