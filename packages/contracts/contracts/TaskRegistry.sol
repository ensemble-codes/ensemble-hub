    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/access/Ownable.sol";

    contract TaskRegistry is Ownable {
        enum TaskType { SIMPLE, COMPLEX, COMPOSITE }
        enum TaskStatus { CREATED, ASSIGNED, COMPLETED, FAILED }

        struct TaskData {
            uint256 id;
            string prompt;
            TaskType taskType;
            address owner;
            TaskStatus status;
            address assignee;
            mapping(address => bool) permissions;
        }
        
        mapping(uint256 => TaskData) public tasks;
        mapping(address => uint256[]) public ownerTasks;
        uint256 private nextTaskId;
        
        constructor() Ownable(msg.sender) {}
        
        event TaskCreated(address indexed owner, uint256 taskId, string prompt, TaskType taskType);
        event TaskStatusChanged(uint256 indexed taskId, TaskStatus status);
        event TaskAssigned(uint256 indexed taskId, address indexed agent);
        event PermissionUpdated(uint256 indexed taskId, address indexed user, bool allowed);

        function createTask(
            string memory prompt,
            TaskType taskType
        ) external returns (uint256) {
            nextTaskId++;
            TaskData storage task = tasks[nextTaskId];
            task.id = nextTaskId;
            task.prompt = prompt;
            task.taskType = taskType;
            task.owner = msg.sender;
            task.status = TaskStatus.CREATED;
            task.permissions[address(this)] = true;
            
            ownerTasks[msg.sender].push(nextTaskId);
            
            emit TaskCreated(msg.sender, nextTaskId, prompt, taskType);
            return nextTaskId;
        }

        function setPermission(uint256 taskId, address user, bool allowed) external {
            TaskData storage task = tasks[taskId];
            require(msg.sender == task.owner, "Not authorized");
            task.permissions[user] = allowed;
            emit PermissionUpdated(taskId, user, allowed);
        }

        function assignTo(uint256 taskId, address _assignee) external {
            TaskData storage task = tasks[taskId];
            require(msg.sender == task.owner || task.permissions[msg.sender], "Not authorized");
            require(task.status == TaskStatus.CREATED, "Invalid task status");
            
            task.assignee = _assignee;
            task.status = TaskStatus.ASSIGNED;
            
            emit TaskAssigned(taskId, _assignee);
            emit TaskStatusChanged(taskId, TaskStatus.ASSIGNED);
        }

        function getTasksByOwner(address owner) external view returns (uint256[] memory) {
            return ownerTasks[owner];
        }

        function getStatus(uint256 taskId) external view returns (TaskStatus) {
            return tasks[taskId].status;
        }
        
        function getAssignee(uint256 taskId) external view returns (address) {
            return tasks[taskId].assignee;
        }
        
        function updateTaskStatus(uint256 taskId, TaskStatus newStatus) external onlyOwner {
            TaskData storage task = tasks[taskId];
            task.status = newStatus;
            emit TaskStatusChanged(taskId, newStatus);
        }
    }
