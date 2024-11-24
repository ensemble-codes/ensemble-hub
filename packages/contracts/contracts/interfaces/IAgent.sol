// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAgent {
    struct Skill {
        string name;
        uint256 level;
    }

    event ReputationUpdated(address indexed agent, uint256 newReputation);
    
    function updateReputation(uint256 _reputation) external;
    function getSkills() external view returns (Skill[] memory);
    function getReputation() external view returns (uint256);
}
