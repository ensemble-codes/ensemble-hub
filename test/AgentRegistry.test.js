const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentRegistry", function () {
    let AgentRegistry;
    let registry;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        AgentRegistry = await ethers.getContractFactory("AgentRegistry");
        registry = await AgentRegistry.deploy();
    });

    it("Should register new agent", async function () {
        const tx = await registry.registerAgent(
            "GPT-4",
            "AI Assistant",
            ["coding", "writing"],
            [90, 85]
        );
        const receipt = await tx.wait();
        const event = receipt.events.find(e => e.event === 'AgentRegistered');
        
        expect(event.args.model).to.equal("GPT-4");
        expect(await registry.isRegistered(event.args.agent)).to.be.true;
    });
});
