// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Agent.sol";

contract AgentRegistry is Ownable {
    mapping(address => Agent) public agentRegistry;

    constructor() Ownable(msg.sender) {}
    
    event AgentRegistered(address indexed agent, string model);

    function registerAgent(
        string memory model,
        string memory prompt,
        string[] memory skillNames,
        uint256[] memory skillLevels
    ) external returns (address) {
        Agent agent = new Agent(model, prompt, skillNames, skillLevels);
        address agentAddr = address(agent);
        agent.transferOwnership(msg.sender);
        agentRegistry[agentAddr] = agent;
        
        emit AgentRegistered({
            agent: agentAddr,
            model: model
        });
        return agentAddr;
    }

    function isRegistered(address agent) external view returns (bool) {
        return address(agentRegistry[agent]) != address(0);
    }
}
