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
        await registry.deployed();
    });

    it("Should create new task", async function () {
        const tx = await registry.createTask("Test prompt", 0);
        const receipt = await tx.wait();
        const event = receipt.events.find(e => e.event === 'TaskCreated');
        
        expect(event.args.owner).to.equal(owner.address);
        expect(event.args.task).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should allow task assignment", async function () {
        const tx = await registry.createTask("Test prompt", 0);
        const receipt = await tx.wait();
        const taskAddress = receipt.events[0].args.task;

        await registry.assignAgent(taskAddress, user.address);
        const task = await ethers.getContractAt("Task", taskAddress);
        expect(await task.assignee()).to.equal(user.address);
    });
});
