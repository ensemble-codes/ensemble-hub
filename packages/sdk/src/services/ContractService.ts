import { ethers } from "ethers";

export class ContractService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  
  constructor(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async validateNetwork(expectedChainId: number): Promise<void> {
    const network = await this.provider.getNetwork();
    if (network.chainId !== BigInt(expectedChainId)) {
      throw new Error(`Chain ID mismatch. Expected ${expectedChainId}, got ${network.chainId}`);
    }
  }

  createContract(address: string, abi: any): ethers.Contract {
    return new ethers.Contract(address, abi, this.signer);
  }
} 