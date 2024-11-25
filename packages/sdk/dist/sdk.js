"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgentsSDK = void 0;
const ethers_1 = require("ethers");
class AIAgentsSDK {
    constructor(config, signer) {
        this.provider = new ethers_1.ethers.JsonRpcProvider(config.network.rpcUrl);
        this.chainId = config.network.chainId;
        const signerOrProvider = signer || this.provider;
        // Validate network connection and chain ID
        this.validateNetwork();
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
        const tx = await this.taskRegistry.assignTo(taskAddress, agentAddress);
        await tx.wait();
    }
    async getTasksByOwner(ownerAddress) {
        return await this.taskRegistry.getTasksByOwner(ownerAddress);
    }
    // Agent Management Methods
    async registerAgent(model, prompt, skills) {
        const skillNames = skills.map(s => s.name);
        const skillLevels = skills.map(s => s.level);
        const tx = await this.agentRegistry.registerAgent(model, prompt, skillNames, skillLevels);
        const receipt = await tx.wait();
        const event = receipt.events?.find(e => e.event === "AgentRegistered");
        if (!event?.args?.agent) {
            throw new Error("Agent registration failed: No agent address in event");
        }
        return event.args.agent;
    }
    async getAgentData(agentAddress) {
        const [model, prompt, skills, reputation] = await this.agentRegistry.getAgentData(agentAddress);
        const isRegistered = await this.agentRegistry.isRegistered(agentAddress);
        return {
            address: agentAddress,
            model,
            prompt,
            skills,
            reputation,
            isRegistered
        };
    }
    async addAgentSkill(name, level) {
        const tx = await this.agentRegistry.addSkill(name, level);
        await tx.wait();
    }
    async updateAgentReputation(reputation) {
        const tx = await this.agentRegistry.updateReputation(reputation);
        await tx.wait();
    }
    async isAgentRegistered(agentAddress) {
        return await this.agentRegistry.isRegistered(agentAddress);
    }
    // Task Instance Methods
    async getTaskData(taskAddress) {
        const [prompt, taskType, owner, status, assignee] = await this.taskRegistry.tasks(taskAddress);
        return {
            prompt,
            taskType,
            assignee: assignee || undefined,
            status,
            owner
        };
    }
    async executeTask(taskAddress, data, target, value = 0) {
        const TaskConnectorABI = require("../../../packages/contracts/artifacts/contracts/TaskConnector.sol/TaskConnector.json").abi;
        const taskConnector = new ethers_1.ethers.Contract(taskAddress, TaskConnectorABI, this.provider);
        try {
            const tx = await taskConnector.execute(data, target, value);
            const receipt = await tx.wait();
            const event = receipt.events?.find((e) => e.event === "TaskExecuted");
            return event?.args?.success || false;
        }
        catch (error) {
            console.error("Task execution failed:", error);
            throw error;
        }
    }
    async setTaskPermission(taskAddress, user, allowed) {
        try {
            const tx = await this.taskRegistry.setPermission(taskAddress, user, allowed);
            await tx.wait();
        }
        catch (error) {
            console.error("Setting task permission failed:", error);
            throw error;
        }
    }
    // Network validation
    async validateNetwork() {
        try {
            const network = await this.provider.getNetwork();
            if (network.chainId !== BigInt(this.chainId)) {
                throw new Error(`Chain ID mismatch. Expected ${this.chainId}, got ${network.chainId}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Network validation failed: ${error.message}`);
            }
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
