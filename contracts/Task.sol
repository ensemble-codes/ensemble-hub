// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/ITask.sol";

contract Task is ITask, Ownable, ReentrancyGuard {
    string public prompt;
    TaskType public taskType;
    mapping(address => bool) public permissions;
    address public assignee;
    TaskStatus public status;

    constructor(
        string memory _prompt,
        TaskType _type,
        address _owner
    ) {
        prompt = _prompt;
        taskType = _type;
        status = TaskStatus.CREATED;
        _transferOwnership(_owner);
    }

    modifier onlyAssignee() {
        require(msg.sender == assignee, "Only assignee can execute");
        _;
    }

    modifier inStatus(TaskStatus _status) {
        require(status == _status, "Invalid task status");
        _;
    }

    function setPermission(address user, bool allowed) external onlyOwner {
        permissions[user] = allowed;
        emit TaskStatusChanged(uint256(uint160(address(this))), status);
    }

    function assignTo(address _assignee) external onlyOwner inStatus(TaskStatus.CREATED) {
        assignee = _assignee;
        status = TaskStatus.ASSIGNED;
        emit TaskAssigned(uint256(uint160(address(this))), _assignee);
    }

    function execute(bytes calldata data, address target, uint256 value)
        external
        override
        onlyAssignee
        inStatus(TaskStatus.ASSIGNED)
        nonReentrant
        returns (bool)
    {
        require(permissions[target], "Target not permitted");
        
        (bool success, ) = target.call{value: value}(data);
        status = success ? TaskStatus.COMPLETED : TaskStatus.FAILED;
        
        emit TaskExecuted(uint256(uint160(address(this))), success);
        return success;
    }

    function getStatus() external view override returns (TaskStatus) {
        return status;
    }

    function getAssignee() external view override returns (address) {
        return assignee;
    }
}
