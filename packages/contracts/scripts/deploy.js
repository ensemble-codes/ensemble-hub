async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Deploy AgentRegistry
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    const agentRegistry = await AgentRegistry.deploy();
    console.log("AgentRegistry deployed to:", agentRegistry.address);

    // Deploy TaskRegistry
    const TaskRegistry = await ethers.getContractFactory("TaskRegistry");
    const taskRegistry = await TaskRegistry.deploy();
    console.log("TaskRegistry deployed to:", taskRegistry.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
