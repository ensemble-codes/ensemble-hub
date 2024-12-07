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

    it("Should approve task proposal", async function () {
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
        const taskId = taskCreatedEvent.args.taskId;
        const proposal = {
            id: 1,
            price: ethers.parseEther("0.01"),
            taskId: taskId,
            agent: user.address
        };
        // await registry.proposeTask(taskId, user.address);
        await registry.approveProposal(taskId, proposal);
        expect(await registry.getStatus(taskId)).to.be.equal(1); // TaskStatus.ASSIGNED
    });

    it("Should complete task", async function () {
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
        const taskId = taskCreatedEvent.args.taskId;
        const proposal = {
            id: 1,
            price: ethers.parseEther("0.01"),
            taskId: taskId,
            agent: user.address
        };
        await registry.approveProposal(taskId, proposal);
        expect(await registry.getStatus(taskId)).to.be.equal(1); // TaskStatus.ASSIGNED

        await registry.connect(user).completeTask(taskId, "Task completed successfully", { from: user.address });
        expect(await registry.getStatus(taskId)).to.be.equal(2); // TaskStatus.COMPLETED
    });
});
