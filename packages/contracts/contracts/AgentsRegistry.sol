// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentsRegistry is Ownable {
    struct Skill {
        string name;
        uint256 level;
    }

    struct AgentData {
        string model;
        string prompt;
        Skill[] skills;
        uint256 reputation;
        bool isRegistered;
    }

    mapping(address => AgentData) public agents;

    constructor() Ownable(msg.sender) {}
    
    event AgentRegistered(address indexed agent, string model);
    event ReputationUpdated(address indexed agent, uint256 newReputation);
    /**
     * @dev Registers a new agent with the given model, prompt, and skills.
     * @param model The model of the agent.
     * @param prompt The prompt for the agent.
     * @param skillNames The names of the skills the agent possesses.
     * @return The address of the registered agent.
     */
    function registerAgent(
        string memory model,
        string memory prompt,
        string[] memory skillNames
    ) external returns (address) {
        require(!agents[msg.sender].isRegistered, "Agent already registered");

        Skill[] memory skills = new Skill[](skillNames.length);
        for (uint i = 0; i < skillNames.length; i++) {
            skills[i] = Skill({
                name: skillNames[i],
                level: 0
            });
        }

        agents[msg.sender].model = model;
        agents[msg.sender].prompt = prompt;
        agents[msg.sender].reputation = 100;
        agents[msg.sender].isRegistered = true;
        
        // Add skills one by one
        for (uint i = 0; i < skills.length; i++) {
            agents[msg.sender].skills.push(skills[i]);
        }
        
        emit AgentRegistered({
            agent: msg.sender,
            model: model
        });
        return msg.sender;
    }

    function updateReputation(uint256 _reputation) external onlyOwner {
        require(agents[msg.sender].isRegistered, "Agent not registered");
        agents[msg.sender].reputation = _reputation;
        emit ReputationUpdated(msg.sender, _reputation);
    }

    function getSkills() external view returns (Skill[] memory) {
        require(agents[msg.sender].isRegistered, "Agent not registered");
        return agents[msg.sender].skills;
    }

    function getReputation() external view returns (uint256) {
        require(agents[msg.sender].isRegistered, "Agent not registered");
        return agents[msg.sender].reputation;
    }

    function addSkill(string memory name, uint256 level) external onlyOwner {
        require(agents[msg.sender].isRegistered, "Agent not registered");
        agents[msg.sender].skills.push(Skill({
            name: name,
            level: level
        }));
    }

    function isRegistered(address agent) external view returns (bool) {
        return agents[agent].isRegistered;
    }

    function getAgentData(address agent) external view returns (
        string memory model,
        string memory prompt,
        Skill[] memory skills,
        uint256 reputation
    ) {
        require(agents[agent].isRegistered, "Agent not registered");
        AgentData storage data = agents[agent];
        return (data.model, data.prompt, data.skills, data.reputation);
    }
}
