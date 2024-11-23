// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITask {
    enum TaskType { SIMPLE, WORKFLOW, COMPLEX }
    enum TaskStatus { CREATED, ASSIGNED, COMPLETED, FAILED }

    event TaskStatusChanged(uint256 indexed taskId, TaskStatus status);
    event TaskAssigned(uint256 indexed taskId, address indexed agent);
    event TaskExecuted(uint256 indexed taskId, bool success);

    function execute(bytes calldata data, address target, uint256 value) external returns (bool);
    function getStatus() external view returns (TaskStatus);
    function getAssignee() external view returns (address);
}
