const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task", function () {
    let Task;
    let task;
    let owner;
    let assignee;
    let other;

    beforeEach(async function () {
        [owner, assignee, other] = await ethers.getSigners();
        Task = await ethers.getContractFactory("Task");
        task = await Task.deploy("Test prompt", 0, owner.address, owner.address);
    });

    it("Should set correct initial values", async function () {
        expect(await task.prompt()).to.equal("Test prompt");
        expect(await task.taskType()).to.equal(0);
        expect(await task.owner()).to.equal(owner.address);
        expect(await task.status()).to.equal(0);
    });

    it("Should allow owner to assign agent", async function () {
        await task.assignTo(assignee.address);
        expect(await task.assignee()).to.equal(assignee.address);
        expect(await task.status()).to.equal(1);
    });

    it("Should not allow non-owner to assign agent", async function () {
        await expect(
            task.connect(other).assignTo(assignee.address)
        ).to.be.reverted;
    });
});
