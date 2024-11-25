const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskConnector", function () {
    let TaskConnector;
    let TaskRegistry;
    let task;
    let registry;
    let owner;
    let assignee;
    let other;

    beforeEach(async function () {
        [owner, assignee, other] = await ethers.getSigners();
        TaskRegistry = await ethers.getContractFactory("TaskRegistry");
        TaskConnector = await ethers.getContractFactory("TaskConnector");
        
        registry = await TaskRegistry.deploy();
        await registry.waitForDeployment();
        
        const tx = await registry.createTask("Test prompt", 0);
        const receipt = await tx.wait();
        const events = receipt.logs.map(log => {
            try {
                return registry.interface.parseLog(log);
            } catch (e) {
                return null;
            }
        }).filter(Boolean);
        
        const taskCreatedEvent = events.find(event => event.name === "TaskCreated");
        expect(taskCreatedEvent).to.not.be.undefined;
        task = await TaskConnector.attach(taskCreatedEvent.args.task);
    });

    it("Should set correct initial values", async function () {
        expect(await task.prompt()).to.equal("Test prompt");
        expect(await task.taskType()).to.equal(0);
        expect(await task.owner()).to.equal(owner.address);
        expect(await task.status()).to.equal(0);
    });

    it("Should allow owner to assign agent", async function () {
        await registry.assignTo(task.address, assignee.address);
        expect(await task.assignee()).to.equal(assignee.address);
        expect(await task.status()).to.equal(1);
    });

    it("Should not allow non-owner to assign agent", async function () {
        await expect(
            registry.connect(other).assignTo(task.address, assignee.address)
        ).to.be.reverted;
    });
});
