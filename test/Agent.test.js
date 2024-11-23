const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Agent", function () {
    let Agent;
    let agent;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        Agent = await ethers.getContractFactory("Agent");
        agent = await Agent.deploy(
            "GPT-4",
            "AI Assistant",
            ["coding", "writing"],
            [90, 85]
        );
        await agent.deployed();
    });

    it("Should set correct initial values", async function () {
        expect(await agent.model()).to.equal("GPT-4");
        expect(await agent.prompt()).to.equal("AI Assistant");
        expect(await agent.reputation()).to.equal(100);
    });

    it("Should update reputation", async function () {
        await agent.updateReputation(95);
        expect(await agent.reputation()).to.equal(95);
    });

    it("Should return skills", async function () {
        const skills = await agent.getSkills();
        expect(skills.length).to.equal(2);
        expect(skills[0].name).to.equal("coding");
        expect(skills[0].level).to.equal(90);
    });
});
