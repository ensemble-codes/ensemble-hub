// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITask.sol";
import "./TaskConnector.sol";

contract TaskRegistry is Ownable {
    struct TaskData {
        string prompt;
        ITask.TaskType taskType;
        address owner;
        ITask.TaskStatus status;
        address assignee;
        mapping(address => bool) permissions;
    }
    
    mapping(address => TaskData) public tasks;
    mapping(address => address[]) public ownerTasks;
    
    constructor() Ownable(msg.sender) {}
    
    event TaskCreated(address indexed owner, address task);
    event TaskStatusChanged(address indexed task, ITask.TaskStatus status);
    event TaskAssigned(address indexed task, address indexed agent);
    event PermissionUpdated(address indexed task, address indexed user, bool allowed);

    function createTask(
        string memory prompt,
        ITask.TaskType taskType
    ) external returns (address) {
        address taskAddr = address(new TaskConnector(address(this)));
        
        TaskData storage task = tasks[taskAddr];
        task.prompt = prompt;
        task.taskType = taskType;
        task.owner = msg.sender;
        task.status = ITask.TaskStatus.CREATED;
        task.permissions[address(this)] = true;
        
        ownerTasks[msg.sender].push(taskAddr);
        
        emit TaskCreated(msg.sender, taskAddr);
        return taskAddr;
    }

    function setPermission(address taskAddr, address user, bool allowed) external {
        TaskData storage task = tasks[taskAddr];
        require(msg.sender == task.owner, "Not authorized");
        task.permissions[user] = allowed;
        emit PermissionUpdated(taskAddr, user, allowed);
    }

    function assignTo(address taskAddr, address _assignee) external {
        TaskData storage task = tasks[taskAddr];
        require(msg.sender == task.owner || task.permissions[msg.sender], "Not authorized");
        require(task.status == ITask.TaskStatus.CREATED, "Invalid task status");
        
        task.assignee = _assignee;
        task.status = ITask.TaskStatus.ASSIGNED;
        
        emit TaskAssigned(taskAddr, _assignee);
        emit TaskStatusChanged(taskAddr, ITask.TaskStatus.ASSIGNED);
    }

    function getTasksByOwner(address owner) external view returns (address[] memory) {
        return ownerTasks[owner];
    }

    function getStatus(address taskAddr) external view returns (ITask.TaskStatus) {
        return tasks[taskAddr].status;
    }
    
    function getAssignee(address taskAddr) external view returns (address) {
        return tasks[taskAddr].assignee;
    }
    
    function updateTaskStatus(address taskAddr, ITask.TaskStatus newStatus) external {
        TaskData storage task = tasks[taskAddr];
        require(msg.sender == taskAddr, "Only task can update status");
        task.status = newStatus;
        emit TaskStatusChanged(taskAddr, newStatus);
    }
}
