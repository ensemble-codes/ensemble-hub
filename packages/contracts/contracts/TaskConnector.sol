// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TaskRegistry.sol";
import "./interfaces/ITask.sol";

contract TaskConnector is ReentrancyGuard {
    TaskRegistry public immutable registry;
    mapping(address => bool) public permissions;
    
    event TaskExecuted(uint256 indexed taskId, bool success);
    
    constructor(address _registry) {
        registry = TaskRegistry(_registry);
        permissions[_registry] = true;
    }
    
    modifier onlyRegistry() {
        require(msg.sender == address(registry), "Only registry can call");
        _;
    }
    
    function setPermission(address user, bool allowed) external onlyRegistry {
        permissions[user] = allowed;
    }
    
    function execute(bytes calldata data, address target, uint256 value)
        external
        nonReentrant
        returns (bool)
    {
        require(msg.sender == ITask(address(this)).getAssignee(), "Only assignee can execute");
        require(registry.getStatus(address(this)) == ITask.TaskStatus.ASSIGNED, "Invalid task status");
        require(permissions[target], "Target not permitted");
        
        (bool success, ) = target.call{value: value}(data);
        
        emit TaskExecuted(uint256(uint160(address(this))), success);
        return success;
    }
}
