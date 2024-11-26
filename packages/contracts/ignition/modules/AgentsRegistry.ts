import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AgentsRegistryModule = buildModule("AgentsRegistryModule", (m) => {
    const agentsRegistry = m.contract("AgentsRegistry");

    return { agentsRegistry };
});

export default AgentsRegistryModule; 