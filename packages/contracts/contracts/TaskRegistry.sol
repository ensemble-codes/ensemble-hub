// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Task.sol";

contract TaskRegistry is Ownable {
    mapping(address => Task[]) public tasksRegistry;
    
    constructor() Ownable(msg.sender) {}
    
    event TaskCreated(address indexed owner, address task);
    event AgentAssigned(address indexed task, address indexed agent);

    function createTask(
        string memory prompt,
        Task.TaskType taskType
    ) external returns (address) {
        // Create task with msg.sender as owner and registry permissions
        Task task = new Task(prompt, taskType, msg.sender, address(this));
        address taskAddr = address(task);
        tasksRegistry[msg.sender].push(task);
        
        emit TaskCreated({
            owner: msg.sender,
            task: taskAddr
        });
        return taskAddr;
    }

    function assignAgent(address taskAddr, address agent) external {
        Task task = Task(taskAddr);
        require(msg.sender == task.owner(), "Not authorized");
        require(task.permissions(address(this)), "Registry not authorized");
        
        task.assignTo(agent);
        emit AgentAssigned(taskAddr, agent);
    }

    function getTasksByOwner(address owner) external view returns (Task[] memory) {
        return tasksRegistry[owner];
    }
}
