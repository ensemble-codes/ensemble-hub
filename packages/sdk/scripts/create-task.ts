import { ethers } from "ethers";
import { Ensemble } from "../src"
import { TaskType } from "../src/types";
import dotenv from "dotenv";

dotenv.config({ override: true });

const rpcUrl = process.env.RPC_URL!;
const privateKey = process.env.PRIVATE_KEY!;
const taskRegistryAddress = process.env.TASK_REGISTRY_ADDRESS!;
const agentRegistryAddress = process.env.AGENT_REGISTRY_ADDRESS!;

const chainId = parseInt(process.env.CHAIN_ID!, 10);
const networkName = process.env.NETWORK_NAME!;

export const setupEnv = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const pk = process.env.PRIVATE_KEY!;
  const wallet = new ethers.Wallet(pk, provider);

  return {
    provider,
    signer: wallet
  };
}


export const setupSdk = () => {
  const { signer } = setupEnv();

  const config = {
    network: {
      rpcUrl: rpcUrl,
      chainId: chainId,
      name: networkName
    },
    taskRegistryAddress: taskRegistryAddress,
    agentRegistryAddress: agentRegistryAddress
  }
  const sdk = new Ensemble(config, signer);
  // sdk.start();
  return sdk;
}

async function main() {
  const ensemble = setupSdk()

  ensemble.setOnNewProposalListener((proposal) => {
    console.log("New proposal received:", proposal);
  })
  const task = await ensemble.createTask({
    prompt: "Create a task",
    taskType: TaskType.SIMPLE,
  });
  console.log(task)
}

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exit(1);
});
