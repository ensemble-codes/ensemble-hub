// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TaskRegistry.sol";
import "./interfaces/ITask.sol";

contract TaskConnector is ITask, ReentrancyGuard {
    TaskRegistry public immutable registry;
    
    constructor(address _registry) {
        registry = TaskRegistry(_registry);
    }
    
    function execute(bytes calldata data, address target, uint256 value)
        external
        override
        nonReentrant
        returns (bool)
    {
        require(msg.sender == registry.getAssignee(address(this)), "Only assignee can execute");
        require(registry.getStatus(address(this)) == TaskStatus.ASSIGNED, "Invalid task status");
        
        (bool success, ) = target.call{value: value}(data);
        
        registry.updateTaskStatus(address(this), success ? TaskStatus.COMPLETED : TaskStatus.FAILED);
        emit TaskExecuted(uint256(uint160(address(this))), success);
        return success;
    }

    function getStatus() external view override returns (TaskStatus) {
        return registry.getStatus(address(this));
    }

    function getAssignee() external view override returns (address) {
        return registry.getAssignee(address(this));
    }
}
