const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskRegistry", function () {
    let TaskRegistry;
    let registry;
    let owner;
    let user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        TaskRegistry = await ethers.getContractFactory("TaskRegistry");
        registry = await TaskRegistry.deploy();
    });

    it("Should create new task", async function () {
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
        expect(taskCreatedEvent.args.owner).to.equal(owner.address);
        expect(taskCreatedEvent.args.task).to.not.equal(ethers.ZeroAddress);
    });

    it("Should allow task assignment", async function () {
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
        const taskAddress = taskCreatedEvent.args.task;

        await registry.assignTo(taskAddress, user.address);
        const task = await ethers.getContractAt("TaskConnector", taskAddress);
        expect(await registry.getAssignee(taskAddress)).to.equal(user.address);
    });
});
