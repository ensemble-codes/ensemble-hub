"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgentsSDK = void 0;
const ethers_1 = require("ethers");
class AIAgentsSDK {
    constructor(config, signer) {
        this.provider = new ethers_1.ethers.JsonRpcProvider(config.rpcUrl);
        const signerOrProvider = signer || this.provider;
        // Load contract ABIs
        const TaskRegistryABI = require("../../../packages/contracts/artifacts/contracts/TaskRegistry.sol/TaskRegistry.json").abi;
        const AgentRegistryABI = require("../../../packages/contracts/artifacts/contracts/AgentRegistry.sol/AgentRegistry.json").abi;
        this.taskRegistry = new ethers_1.ethers.Contract(config.taskRegistryAddress, TaskRegistryABI, signerOrProvider);
        this.agentRegistry = new ethers_1.ethers.Contract(config.agentRegistryAddress, AgentRegistryABI, signerOrProvider);
    }
    // Task Management Methods
    async createTask(params) {
        const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
        const receipt = await tx.wait();
        const event = receipt.events?.find((e) => e.event === "TaskCreated");
        if (!event?.args?.task) {
            throw new Error("Task creation failed: No task address in event");
        }
        return event.args.task;
    }
    async assignTask(taskAddress, agentAddress) {
        const tx = await this.taskRegistry.assignAgent(taskAddress, agentAddress);
        await tx.wait();
    }
    async getTasksByOwner(ownerAddress) {
        return await this.taskRegistry.getTasksByOwner(ownerAddress);
    }
    // Agent Management Methods
    async registerAgent(agentAddress, skills) {
        const tx = await this.agentRegistry.registerAgent(agentAddress, skills);
        await tx.wait();
    }
    async getAgentData(agentAddress) {
        const [reputation, skills] = await Promise.all([
            this.agentRegistry.getReputation(agentAddress),
            this.agentRegistry.getSkills(agentAddress)
        ]);
        return {
            address: agentAddress,
            reputation,
            skills
        };
    }
    // Task Instance Methods
    async getTaskData(taskAddress) {
        const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
        const taskContract = new ethers_1.ethers.Contract(taskAddress, TaskABI, this.provider);
        const [prompt, taskType, assignee, status] = await Promise.all([
            taskContract.prompt(),
            taskContract.taskType(),
            taskContract.assignee(),
            taskContract.status()
        ]);
        return {
            prompt,
            taskType,
            assignee: assignee || undefined,
            status
        };
    }
    async executeTask(taskAddress, data, target, value = 0) {
        const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
        const taskContract = new ethers_1.ethers.Contract(taskAddress, TaskABI, this.provider);
        try {
            const tx = await taskContract.execute(data, target, value);
            return tx;
        }
        catch (error) {
            console.error("Task execution failed:", error);
            throw error;
        }
    }
    async setTaskPermission(taskAddress, user, allowed) {
        const TaskABI = require("../../../packages/contracts/artifacts/contracts/Task.sol/Task.json").abi;
        const taskContract = new ethers_1.ethers.Contract(taskAddress, TaskABI, this.provider);
        try {
            const tx = await taskContract.setPermission(user, allowed);
            await tx.wait();
        }
        catch (error) {
            console.error("Setting task permission failed:", error);
            throw error;
        }
    }
    // Utils
    async connect(signer) {
        this.taskRegistry = this.taskRegistry.connect(signer);
        this.agentRegistry = this.agentRegistry.connect(signer);
    }
}
exports.AIAgentsSDK = AIAgentsSDK;
