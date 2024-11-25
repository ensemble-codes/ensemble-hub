/// <reference types="jest" />
import { expect } from 'chai';
import { ethers } from 'ethers';
import { TestSDK } from './helpers';

import { jest } from '@jest/globals';

// Enable Jest mocking
jest.mock('ethers', () => ({
  ethers: {
    Contract: jest.fn(),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: () => Promise.resolve({ chainId: BigInt(1337) })
    })),
    Wallet: jest.fn().mockImplementation(() => ({
      connect: jest.fn()
    }))
  }
}));

// Test configuration
export const TEST_CONFIG = {
  network: {
    rpcUrl: "http://localhost:8545",
    chainId: 1337,
    name: "hardhat"
  },
  taskRegistryAddress: "0x0000000000000000000000000000000000000001",
  agentRegistryAddress: "0x0000000000000000000000000000000000000002"
};

// Mock Provider Class
export class MockProvider {
  async getNetwork() {
    return { chainId: BigInt(1337) };
  }

  async getCode() {
    return "0x";
  }
}

// Test fixture
export const setupTestEnv = async () => {
  const provider = new MockProvider();
  const wallet = new ethers.Wallet(
    "0x0123456789012345678901234567890123456789012345678901234567890123",
    provider as any
  );
  
  // Mock ethers.Contract
  const mockTaskRegistry = {
    createTask: jest.fn(),
    assignAgent: jest.fn(),
    getTasksByOwner: jest.fn(),
  };

  const mockAgentRegistry = {
    registerAgent: jest.fn(),
    getReputation: jest.fn(),
    getSkills: jest.fn(),
  };

  (ethers.Contract as jest.Mock).mockImplementation((address, abi, signerOrProvider) => {
    if (address === TEST_CONFIG.taskRegistryAddress) return mockTaskRegistry;
    if (address === TEST_CONFIG.agentRegistryAddress) return mockAgentRegistry;
    return {};
  });

  const sdk = new TestSDK(TEST_CONFIG, wallet as any);
  
  return {
    provider,
    signer: wallet,
    sdk,
    mockTaskRegistry,
    mockAgentRegistry
  };
};

// Setup global Jest mocks
beforeEach(() => {
  jest.clearAllMocks();
});

export { expect };
