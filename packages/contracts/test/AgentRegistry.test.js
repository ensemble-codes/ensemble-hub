const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentRegistry", function () {
    let AgentRegistry;
    let registry;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        AgentRegistry = await ethers.getContractFactory("AgentsRegistry");
        registry = await AgentRegistry.deploy();
    });

    it("Should register new agent", async function () {
        const tx = await registry.registerAgent(
            "GPT-4",
            "AI Assistant",
            ["coding", "writing"]
        );
        const receipt = await tx.wait();
        const events = receipt.logs.map(log => {
            try {
                return registry.interface.parseLog(log);
            } catch (e) {
                return null;
            }
        }).filter(Boolean);
        
        const agentRegisteredEvent = events.find(event => event.name === "AgentRegistered");
        expect(agentRegisteredEvent).to.not.be.undefined;
        expect(agentRegisteredEvent.args.agent).to.not.equal(ethers.ZeroAddress);
        expect(agentRegisteredEvent.args.model).to.equal("GPT-4");
        expect(await registry.isRegistered(agentRegisteredEvent.args.agent)).to.be.true;
    });
});
