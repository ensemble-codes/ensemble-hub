// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAgent.sol";

contract Agent is IAgent, Ownable {
    string public model;
    string public prompt;
    Skill[] public skills;
    uint256 public reputation;

    constructor(
        string memory _model,
        string memory _prompt,
        string[] memory _skillNames,
        uint256[] memory _skillLevels
    ) Ownable(msg.sender) {
        require(_skillNames.length == _skillLevels.length, "Skills mismatch");
        
        model = _model;
        prompt = _prompt;
        reputation = 100;

        for (uint i = 0; i < _skillNames.length; i++) {
            skills.push(Skill({
                name: _skillNames[i],
                level: _skillLevels[i]
            }));
        }
    }

    function updateReputation(uint256 _reputation) external override onlyOwner {
        reputation = _reputation;
        emit ReputationUpdated(address(this), _reputation);
    }

    function getSkills() external view override returns (Skill[] memory) {
        return skills;
    }

    function getReputation() external view override returns (uint256) {
        return reputation;
    }

    function addSkill(string memory name, uint256 level) external onlyOwner {
        skills.push(Skill({
            name: name,
            level: level
        }));
    }
}
