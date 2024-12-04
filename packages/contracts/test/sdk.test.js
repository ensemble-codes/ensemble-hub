const { expect } = require("chai");
const { ethers } = require("hardhat");
const { AIAgentsSDK } = require("ensemble-sdk");

describe("SDK", function () {
    let taskRegistrySDK;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        console.log('owner:', owner);
        const config = {
            network: {
                rpcUrl: "http://127.0.0.1:8545",
                chainId: 31337
            },
            taskRegistryAddress: "0xYourTaskRegistryAddress",
            agentRegistryAddress: "0xYourAgentRegistryAddress"
        };
        owner.connect()
        taskRegistrySDK = new AIAgentsSDK(config, owner);
    });

    it.only("Should create new task using SDK", async function () {
        // console.log(taskRegistrySDK);
        const tx = await taskRegistrySDK.createTask("Test prompt from SDK", 0);
        // const receipt = await tx.wait();
        // const events = receipt.logs.map(log => {
        //     try {
        //         return taskRegistrySDK.interface.parseLog(log);
        //     } catch (e) {
        //         return null;
        //     }
        // }).filter(Boolean);
        
        // const taskCreatedEvent = events.find(event => event.name === "TaskCreated");
        // expect(taskCreatedEvent).to.not.be.undefined;
        // expect(taskCreatedEvent.args.owner).to.equal(owner.address);
        // expect(taskCreatedEvent.args.task).to.not.equal(ethers.ZeroAddress);
    });
});