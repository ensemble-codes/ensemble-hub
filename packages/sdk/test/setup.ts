/// <reference types="jest" />
import { expect } from 'chai';
import { ethers } from 'ethers';

// import { TestSDK } from './helpers';

import { jest } from '@jest/globals';

// Enable Jest mocking
// jest.mock('ethers', () => ({
//   ethers: {
//     Contract: jest.fn(),
//     JsonRpcProvider: jest.fn().mockImplementation(() => ({
//       getNetwork: () => Promise.resolve({ chainId: BigInt(1337) })
//     })),
//     Wallet: jest.fn().mockImplementation(() => ({
//       connect: jest.fn()
//     }))
//   }
// }));

// Test configuration
export const TEST_CONFIG = {
  network: {
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 1337,
    name: "hardhat"
  },
  taskRegistryAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  agentRegistryAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
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


export const setupEnv = (type = 'user') => {
  // const signers = hre.ethers.getSigners();
  // console.log('signers', signers);
  // console.log(hre.ethers);
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  return {
    provider,
    signer: wallet
  };
}

// Test fixture
export const setupTestEnv = async () => {
  // const provider = new MockProvider();
  // const wallet = new ethers.Wallet(
  //   "0x0123456789012345678901234567890123456789012345678901234567890123",
  //   provider as any
  // );
  
  // // Mock ethers.Contract
  // const mockTaskRegistry = {
  //   createTask: jest.fn(),
  //   assignAgent: jest.fn(),
  //   getTasksByOwner: jest.fn(),
  // };

  // const mockAgentRegistry = {
  //   registerAgent: jest.fn(),
  //   getReputation: jest.fn(),
  //   getSkills: jest.fn(),
  // };

  // (ethers.Contract as jest.Mock).mockImplementation((address, abi, signerOrProvider) => {
  //   if (address === TEST_CONFIG.taskRegistryAddress) return mockTaskRegistry;
  //   if (address === TEST_CONFIG.agentRegistryAddress) return mockAgentRegistry;
  //   return {};
  // });

  // const sdk = new TestSDK(TEST_CONFIG, wallet as any);
  
  // return {
  //   provider,
  //   signer: wallet,
  //   sdk,
  //   mockTaskRegistry,
  //   mockAgentRegistry
  // };
};

// Setup global Jest mocks
beforeEach(() => {
  jest.clearAllMocks();
});

export { expect };
