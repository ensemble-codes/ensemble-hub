// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Task.sol";

contract TaskRegistry is Ownable {
    mapping(address => Task[]) public tasksRegistry;
    
    event TaskCreated(address indexed owner, address task);
    event AgentAssigned(address indexed task, address indexed agent);

    function createTask(
        string memory prompt,
        Task.TaskType taskType
    ) external returns (address) {
        Task task = new Task(prompt, taskType, msg.sender);
        tasksRegistry[msg.sender].push(task);
        
        emit TaskCreated(msg.sender, address(task));
        return address(task);
    }

    function assignAgent(address taskAddr, address agent) external {
        Task task = Task(taskAddr);
        require(msg.sender == owner() || msg.sender == task.owner(), "Not authorized");
        
        task.assignTo(agent);
        emit AgentAssigned(taskAddr, agent);
    }

    function getTasksByOwner(address owner) external view returns (Task[] memory) {
        return tasksRegistry[owner];
    }
}
