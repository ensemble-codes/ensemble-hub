import hre, { tasks } from "hardhat";
import AgentsRegistry from "../ignition/modules/AgentsRegistry";
import TaskRegistry from "../ignition/modules/TaskRegistry";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const { agentsRegistry } = await hre.ignition.deploy(AgentsRegistry);
  console.log(`AGENT_REGISTRY_ADDRESS=${await agentsRegistry.getAddress()}`);

  const { taskRegistry } = await hre.ignition.deploy(TaskRegistry);
  console.log(`TASK_REGISTRY_ADDRESS=${await taskRegistry.getAddress()}`);

  const simpleTask = await taskRegistry.createTask(
    "Do X for me",
    0
  );
  console.log(`first task created in tx: ${simpleTask.hash}`);

  const secondTask = await taskRegistry.createTask(
    "Do Y for me",
    0
  );
  console.log(`second task created in tx: ${secondTask.hash}`);

  const tasks = await taskRegistry.getTasksByOwner(deployer.address);
  console.log(tasks);
}

main().catch(console.error);